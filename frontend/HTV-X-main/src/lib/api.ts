// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Rate limit error interface
interface RateLimitError extends Error {
  status: number;
  retryAfter?: number;
  quotaType?: string;
}

// Enhanced error handling
class ApiError extends Error {
  public status: number;
  public retryAfter?: number;
  public quotaType?: string;

  constructor(message: string, status: number, retryAfter?: number, quotaType?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.retryAfter = retryAfter;
    this.quotaType = quotaType;
  }
}

// Generic API request function with improved error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'Request failed',
        message: response.statusText
      }));
      
      // Handle rate limiting specifically
      if (response.status === 429) {
        const retryAfter = error.retryAfter || parseInt(response.headers.get('Retry-After') || '60');
        const quotaType = error.quotaType || 'unknown';
        throw new ApiError(
          error.message || 'Rate limit exceeded',
          429,
          retryAfter,
          quotaType
        );
      }
      
      throw new ApiError(
        error.message || 'API request failed',
        response.status
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(`API Error (${endpoint}):`, error);
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

// Helper function to wait for a specified time
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Retry wrapper for API calls with exponential backoff
async function apiRequestWithRetry<T>(
  endpoint: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: ApiError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiRequest<T>(endpoint, options);
    } catch (error) {
      lastError = error as ApiError;
      
      // Don't retry if this is the last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Don't retry on client errors (except rate limiting)
      if (lastError.status >= 400 && lastError.status < 500 && lastError.status !== 429) {
        break;
      }
      
      // Calculate delay
      let delay = baseDelay * Math.pow(2, attempt);
      
      // Use server-provided retry delay for rate limiting
      if (lastError.status === 429 && lastError.retryAfter) {
        delay = lastError.retryAfter * 1000;
      }
      
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }

  throw lastError;
}

// ========== User API ==========
export interface User {
  id?: number;
  auth0_id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin';
  created_at?: Date;
  updated_at?: Date;
}

export const userApi = {
  // Create or update user
  upsertUser: (userData: User) =>
    apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Get user by Auth0 ID
  getUserByAuth0Id: (auth0_id: string) =>
    apiRequest<User>(`/users/auth0/${auth0_id}`, { method: 'GET' }),

  // Get user by email
  getUserByEmail: (email: string) =>
    apiRequest<User>(`/users/email/${email}`, { method: 'GET' }),

  // Get all users
  getAllUsers: () =>
    apiRequest<User[]>('/users', { method: 'GET' }),

  // Update user role
  updateUserRole: (userId: number, role: 'user' | 'admin') =>
    apiRequest<User>(`/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),

  // Delete user
  deleteUser: (userId: number) =>
    apiRequest<{ message: string }>(`/users/${userId}`, { method: 'DELETE' }),
};

// ========== Document API ==========
export interface Document {
  id?: number;
  title: string;
  content: string;
  access_scope?: 'all' | 'admin' | 'specific';
  status?: 'pending' | 'processing' | 'processed' | 'failed';
  uploaded_by?: number;
  uploaded_at?: Date;
  updated_at?: Date;
  tags?: string[];
}

export const documentApi = {
  // Create document
  createDocument: (document: Document) =>
    apiRequest<Document>('/documents', {
      method: 'POST',
      body: JSON.stringify(document),
    }),

  // Get all documents
  getAllDocuments: () =>
    apiRequest<Document[]>('/documents', { method: 'GET' }),

  // Get document by ID
  getDocumentById: (documentId: number) =>
    apiRequest<Document>(`/documents/${documentId}`, { method: 'GET' }),

  // Get documents by tag
  getDocumentsByTag: (tag: string) =>
    apiRequest<Document[]>(`/documents/tag/${tag}`, { method: 'GET' }),

  // Search documents
  searchDocuments: (searchTerm: string) =>
    apiRequest<Document[]>(`/documents/search/${searchTerm}`, { method: 'GET' }),

  // Update document status
  updateDocumentStatus: (
    documentId: number,
    status: 'pending' | 'processing' | 'processed' | 'failed'
  ) =>
    apiRequest<Document>(`/documents/${documentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Delete document
  deleteDocument: (documentId: number) =>
    apiRequest<{ message: string }>(`/documents/${documentId}`, {
      method: 'DELETE',
    }),
};

// ========== Chat API ==========
export interface Citation {
  id?: number;
  message_id?: number;
  doc_title: string;
  page?: number;
  snippet: string;
  created_at?: Date;
}

export interface ChatMessage {
  id?: number;
  user_id: number;
  role: 'user' | 'assistant';
  content: string;
  filter_category?: string;
  created_at?: Date;
  citations?: Citation[];
}

export const chatApi = {
  // Create message
  createMessage: (message: ChatMessage, citations?: Citation[]) =>
    apiRequest<ChatMessage>('/chat', {
      method: 'POST',
      body: JSON.stringify({ ...message, citations }),
    }),

  // Get chat history for user
  getUserChatHistory: (userId: number, limit: number = 50) =>
    apiRequest<ChatMessage[]>(`/chat/user/${userId}?limit=${limit}`, {
      method: 'GET',
    }),

  // Get messages by filter
  getMessagesByFilter: (userId: number, filterCategory: string) =>
    apiRequest<ChatMessage[]>(`/chat/user/${userId}/filter/${filterCategory}`, {
      method: 'GET',
    }),

  // Get message statistics
  getMessageStats: (userId: number) =>
    apiRequest<any>(`/chat/user/${userId}/stats`, { method: 'GET' }),

  // Delete message
  deleteMessage: (messageId: number) =>
    apiRequest<{ message: string }>(`/chat/${messageId}`, { method: 'DELETE' }),

  // Delete all messages for user
  deleteUserChatHistory: (userId: number) =>
    apiRequest<{ message: string }>(`/chat/user/${userId}`, {
      method: 'DELETE',
    }),
};

// ========== Admin Document API ==========
export interface AdminDocument {
  documentid: string;
  documenttitle: string;
  documentcontent: string;
  uploadedat: string;
  tagtype: string | null;
}

export interface AdminApiResponse {
  success: boolean;
  data: AdminDocument[] | AdminDocument;
  error?: string;
  message?: string;
}

export const adminDocumentApi = {
  // Get all documents for admin panel
  getDocuments: (): Promise<AdminApiResponse> =>
    apiRequest<AdminApiResponse>('/admin/documents', { method: 'GET' }),

  // Upload new document
  uploadDocument: (document: {
    documenttitle: string;
    documentcontent: string;
    tagid: number | null;
  }): Promise<AdminApiResponse> =>
    apiRequest<AdminApiResponse>('/admin/documents', {
      method: 'POST',
      body: JSON.stringify(document),
    }),

  // Delete document (placeholder for future implementation)
  deleteDocument: (documentId: string): Promise<AdminApiResponse> =>
    apiRequest<AdminApiResponse>(`/admin/documents/${documentId}`, {
      method: 'DELETE',
    }),
};

// ========== Gemini API ==========
type GeminiSuccessResponse<T> = {
  success: true;
  data: T;
};

type GeminiErrorResponse = {
  success: false;
  error: string;
  message?: string;
};

export const geminiApi = {
  // Get queue status
  getQueueStatus: async (): Promise<{
    queueLength: number;
    processing: boolean;
    maxQueueSize: number;
    requestInterval: number;
    lastRequestTime: number;
  }> => {
    const res = await apiRequest<GeminiSuccessResponse<any>>('/gemini/queue');
    if (res.success) {
      return res.data;
    }
    throw new Error('Failed to get queue status');
  },

  // Simple text generation with retry logic
  generateText: async (
    prompt: string,
    options?: {
      model?: 'flash' | 'pro';
      config?: {
        temperature?: number;
        topK?: number;
        topP?: number;
        maxOutputTokens?: number;
      };
    }
  ): Promise<string> => {
    try {
      const res = await apiRequestWithRetry<GeminiSuccessResponse<{ prompt: string; response: string }>|GeminiErrorResponse>(
        '/gemini/generate',
        {
          method: 'POST',
          body: JSON.stringify({ prompt, ...options }),
        },
        2 // Max 2 retries for user-facing requests
      );

      if ((res as any).success) {
        return (res as GeminiSuccessResponse<{ prompt: string; response: string }>).data.response;
      }
      throw new Error((res as GeminiErrorResponse).message || (res as GeminiErrorResponse).error || 'Gemini generate error');
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        throw new Error(`AI service is busy. Please wait ${error.retryAfter || 60} seconds and try again.`);
      }
      throw error;
    }
  },

  // Chat message with optional history and enhanced error handling
  sendChatMessage: async (
    message: string,
    options?: {
      history?: Array<{ role: 'user' | 'model'; parts: string }>;
      model?: 'flash' | 'pro';
      config?: {
        temperature?: number;
        topK?: number;
        topP?: number;
        maxOutputTokens?: number;
      };
    }
  ): Promise<string> => {
    try {
      const res = await apiRequestWithRetry<GeminiSuccessResponse<{ message: string; response: string }>|GeminiErrorResponse>(
        '/gemini/chat/message',
        {
          method: 'POST',
          body: JSON.stringify({ message, ...options }),
        },
        2 // Max 2 retries for user-facing requests
      );

      if ((res as any).success) {
        return (res as GeminiSuccessResponse<{ message: string; response: string }>).data.response;
      }
      throw new Error((res as GeminiErrorResponse).message || (res as GeminiErrorResponse).error || 'Gemini chat error');
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        throw new Error(`AI service is busy. Your message has been queued and will be processed shortly. Please wait ${error.retryAfter || 60} seconds before sending another message.`);
      }
      throw error;
    }
  },
};

// Export the ApiError class for use in components
export { ApiError };
