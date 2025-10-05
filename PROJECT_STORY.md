# InternCompass - Project Story

## Inspiration

The corporate onboarding experience is often overwhelming—new hires are bombarded with massive PDF handbooks, policy documents, and training materials that can span hundreds of pages. We noticed that many interns and new employees struggle to find specific information quickly, leading to repeated questions to HR teams and delayed productivity. We wanted to create an intelligent assistant that could understand natural language questions and provide accurate, cited answers from organizational documents, making the onboarding process more efficient and less stressful for everyone involved.

## What it does

InternCompass is an AI-powered onboarding assistant that transforms static PDF documents into an interactive knowledge base. Here's what makes it special:

- **Intelligent Document Processing**: Upload PDF handbooks, policies, and training materials that are automatically processed and indexed
- **RAG-Powered Q&A**: Ask questions in natural language and receive accurate answers with source citations showing exactly where the information came from
- **5 AI Personas**: Choose from Default, Mentor, Tech, Creative, or Academic personas to match your learning style
- **Real-time Chat Interface**: Engaging chat experience with typing indicators, markdown support, and formatted code blocks
- **Admin Dashboard**: Manage documents, view analytics, and monitor system performance
- **Source Attribution**: Every answer includes citations to specific document chunks, ensuring transparency and accuracy

The system uses Retrieval-Augmented Generation (RAG) to ground AI responses in actual company documents, preventing hallucinations and ensuring reliable information delivery.

## How we built it

InternCompass is a full-stack application with a sophisticated backend pipeline:

### Tech Stack
- **Frontend**: React + TypeScript + Vite, styled with shadcn/ui components and Tailwind CSS
- **Backend**: Express + TypeScript with comprehensive error handling and rate limiting
- **Database**: PostgreSQL (Neon) for document storage and vector embeddings
- **AI**: Google Gemini API (`gemini-1.5-pro` for generation, `text-embedding-004` for embeddings)
- **Auth**: Auth0 integration for secure user management

### The RAG Pipeline
We built a multi-stage document processing pipeline:

1. **PDF Processing**: Extract text and metadata from uploaded documents using `pdf-parse`
2. **Intelligent Chunking**: Split documents into ~512 token chunks with 50-token overlap to maintain context
3. **Vector Embeddings**: Generate 768-dimensional embeddings using Gemini's embedding model
4. **Similarity Search**: Retrieve top-K most relevant chunks using cosine similarity
5. **Grounded Generation**: Feed retrieved chunks to Gemini for contextual answer generation
6. **Citation Tracking**: Return source references with page numbers and document names

### Key Features
- Custom persona system that adjusts AI tone and style
- Rate limiting middleware (50 requests/minute) to prevent API abuse
- Comprehensive logging with emoji prefixes for easy debugging
- Batch embedding processing with graceful failure handling
- Document type detection (onboarding, policy, handbook, training)
- Migration system for database schema management

## Challenges we ran into

### 1. **Vector Storage Strategy**
Initially, we considered using pgvector extension, but opted for JSONB storage in standard PostgreSQL for easier deployment on Neon's free tier. This meant implementing cosine similarity calculations in-memory, requiring optimization to handle large document sets efficiently.

### 2. **Chunking Strategy Balance**
Finding the right chunk size was tricky—too small and we lost context; too large and we exceeded token limits. We settled on ~512 tokens with 50-token overlap after extensive testing, ensuring context continuity while staying within API constraints.

### 3. **Rate Limiting & API Quotas**
Gemini's rate limits (50 requests/minute) required implementing sophisticated rate limiting middleware. We built an in-memory token bucket system with retry-after headers and graceful degradation to handle concurrent users.

### 4. **Citation Accuracy**
Ensuring citations pointed to the correct source was challenging when documents were split into chunks. We implemented metadata tracking through the entire pipeline, preserving document names, page numbers, and chunk positions.

### 5. **Environment Configuration**
Managing dual-service architecture with separate frontend and backend configurations required careful environment variable management and CORS setup. We created comprehensive startup scripts and debugging guides to streamline development.

### 6. **Multipart Upload Handling**
Implementing PDF upload with multer required careful configuration of file size limits (50MB), temporary storage, and error handling for corrupted or invalid files.

## Accomplishments that we're proud of

- **End-to-End RAG Implementation**: Built a complete RAG pipeline from scratch without using pre-built frameworks like LangChain, giving us deep understanding of the architecture
- **Production-Ready Error Handling**: Comprehensive error handling with custom `ApiError` classes, graceful degradation, and user-friendly error messages
- **Scalable Architecture**: Designed with separation of concerns—services, controllers, routes, and middleware are cleanly separated for maintainability
- **Developer Experience**: Created extensive documentation including testing guides, API references, quick start guides, and debugging documentation
- **Persona System**: Implemented a unique 5-persona system that adapts AI responses to different user preferences and learning styles
- **Source Attribution**: Achieved transparent AI responses with accurate citations, building trust in the system
- **Performance Optimization**: Batch processing for embeddings, efficient database queries, and in-memory similarity calculations for fast response times

## What we learned

### Technical Skills
- **RAG Architecture**: Deep dive into retrieval-augmented generation, understanding trade-offs between different chunking strategies, embedding models, and similarity metrics
- **Vector Embeddings**: Learned how modern embedding models work and how to effectively use cosine similarity for semantic search
- **TypeScript Best Practices**: Strong typing, interface design, and error handling patterns in full-stack applications
- **Database Design**: Schema design for document management systems, including views, cascade deletes, and efficient querying
- **API Integration**: Working with Google Gemini API, handling rate limits, retries, and streaming responses

### Soft Skills
- **Documentation**: Learned the importance of comprehensive documentation for complex systems—our docs proved invaluable during debugging
- **System Design**: Breaking down complex problems into manageable services and understanding how components interact
- **Debugging Strategies**: Using structured logging with visual indicators (emojis) made debugging significantly easier
- **User Experience**: Balancing technical capabilities with user-friendly interfaces and clear error messages

### Key Insights
- RAG systems require careful tuning of multiple parameters (chunk size, overlap, top-K, similarity threshold)
- Good logging and observability are essential for debugging AI systems
- Citation and transparency are crucial for building trust in AI assistants
- Environment management and deployment scripts are as important as the code itself

## What's next for Intern Compass

### Short-term Enhancements
- **Conversation History**: Implement persistent chat history with conversation threading
- **Multi-document Search**: Allow queries across multiple document types simultaneously
- **Advanced Filters**: Filter by document type, date, or department during search
- **User Feedback Loop**: Allow users to rate answer quality and relevance
- **Markdown Export**: Enable users to export conversations as markdown files

### Medium-term Features
- **Hybrid Search**: Combine semantic search with keyword-based search for better accuracy
- **Document Versioning**: Track document updates and notify users of changes
- **Analytics Dashboard**: Visualize common questions, document usage, and user engagement
- **Multi-language Support**: Extend to support documents and queries in multiple languages
- **Integration APIs**: Webhook support for Slack, Teams, or other workplace tools

### Long-term Vision
- **Fine-tuned Models**: Train custom models on organizational data for even better accuracy
- **Video & Audio Processing**: Extend beyond PDFs to process training videos and audio files
- **Proactive Suggestions**: AI that anticipates questions based on user role and onboarding stage
- **Collaborative Learning**: Allow teams to collectively improve the knowledge base with annotations
- **Enterprise Features**: SSO, audit logs, compliance reporting, and multi-tenant architecture
- **Mobile App**: Native mobile experience for on-the-go access to onboarding resources

### Technical Improvements
- **pgvector Migration**: Move to proper vector database extension for better performance at scale
- **Caching Layer**: Implement Redis for frequent queries and embedding caching
- **Streaming Responses**: Real-time streaming of AI responses for better UX
- **Testing Suite**: Comprehensive unit and integration tests with CI/CD pipeline
- **Monitoring**: Production monitoring with error tracking, performance metrics, and usage analytics

---

InternCompass represents our vision of making corporate onboarding more accessible, efficient, and intelligent. We believe that AI assistants should be transparent, reliable, and genuinely helpful—and we're excited to continue building toward that future.
