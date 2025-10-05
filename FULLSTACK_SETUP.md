# Full-Stack Setup Guide - InternCompass

This guide will help you set up the complete connection between the **HTV-X** frontend and the **Inter-Compass-Service** backend.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Database Initialization](#database-initialization)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [API Endpoints](#api-endpoints)
7. [Testing the Connection](#testing-the-connection)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **bun** package manager
- **PostgreSQL** database (Neon DB is already configured)
- **Git** (for version control)

---

## Backend Setup

### 1. Navigate to Backend Directory

```powershell
cd "Inter-Compass-Service"
```

### 2. Install Dependencies

```powershell
npm install
```

This will install:
- express
- cors
- dotenv
- pg (PostgreSQL client)
- TypeScript and related dev dependencies

### 3. Environment Configuration

The backend is pre-configured to connect to your Neon PostgreSQL database. The credentials are stored in `src/database.ts` with fallback values:

```typescript
PGHOST=ep-icy-cake-adlg1pak-pooler.c-2.us-east-1.aws.neon.tech
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=npg_V0ks7LPqizvX
PGSSLMODE=require
```

**Optional:** Create a `.env` file if you want to override these values:

```env
PGHOST=your-host
PGDATABASE=your-database
PGUSER=your-user
PGPASSWORD=your-password
PGSSLMODE=require
PORT=3000
```

---

## Database Initialization

### 1. Initialize Database Tables

Run the database initialization script to create all required tables:

```powershell
npm run init-db
```

This script will create the following tables:
- **users** - Store user information from Auth0
- **documents** - Store uploaded documents
- **document_tags** - Store tags for documents
- **chat_messages** - Store chat conversation history
- **chat_citations** - Store source citations for chat responses

### 2. Verify Database Connection

Start the backend server to test the connection:

```powershell
npm run dev
```

You should see:
```
🚀 Server is running on port 3000
📍 Health check: http://localhost:3000/health
✅ Database connected successfully at: [timestamp]
```

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```powershell
cd "..\HTV-X"
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `HTV-X` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Auth0 Configuration (if you have Auth0 set up)
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
```

**Note:** If you don't have Auth0 configured yet, the app will still work but user-specific features will be limited.

---

## Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```powershell
cd "Inter-Compass-Service"
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd "HTV-X"
npm run dev
```

### Option 2: Using VS Code Tasks (Recommended)

1. Open VS Code
2. Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
3. Type "Tasks: Run Task"
4. Run both "dev" tasks for backend and frontend

### Expected Output

**Backend (Port 3000):**
- API running at: `http://localhost:3000`
- Health check: `http://localhost:3000/health`

**Frontend (Port 5173):**
- App running at: `http://localhost:5173`

---

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### 🔹 User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create or update user (upsert) |
| GET | `/api/users/auth0/:auth0_id` | Get user by Auth0 ID |
| GET | `/api/users/email/:email` | Get user by email |
| GET | `/api/users` | Get all users |
| PATCH | `/api/users/:userId/role` | Update user role |
| DELETE | `/api/users/:userId` | Delete user |

### 📄 Document Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents` | Create new document |
| GET | `/api/documents` | Get all documents |
| GET | `/api/documents/:documentId` | Get document by ID |
| GET | `/api/documents/tag/:tag` | Get documents by tag |
| GET | `/api/documents/search/:searchTerm` | Search documents |
| PATCH | `/api/documents/:documentId/status` | Update document status |
| DELETE | `/api/documents/:documentId` | Delete document |

### 💬 Chat Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Create new chat message |
| GET | `/api/chat/user/:userId` | Get user's chat history |
| GET | `/api/chat/user/:userId/filter/:filterCategory` | Get filtered messages |
| GET | `/api/chat/user/:userId/stats` | Get message statistics |
| DELETE | `/api/chat/:messageId` | Delete a message |
| DELETE | `/api/chat/user/:userId` | Delete user's chat history |

---

## Testing the Connection

### 1. Test Backend Health

Open your browser or use curl:
```powershell
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-04T12:00:00.000Z",
  "uptime": 123.456
}
```

### 2. Test Database Connection

Visit: `http://localhost:3000` in your browser

You should see:
```json
{
  "message": "Welcome to Inter-Compass Service API",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "users": "/api/users",
    "documents": "/api/documents",
    "chat": "/api/chat",
    "health": "/health"
  }
}
```

### 3. Test Frontend-Backend Connection

1. Open `http://localhost:5173` in your browser
2. Log in with Auth0 (if configured)
3. Navigate to **Admin Panel** (`/admin`)
4. Try uploading a document:
   - Fill in the title and content
   - Select tags
   - Click "Upload Document"
   - You should see a success toast notification
5. Navigate to **Chat** (`/chat`)
6. Send a message
   - Type a question
   - Click send
   - The message should be saved to the database

### 4. Verify Database Entries

You can check the database directly using a PostgreSQL client or via the API:

```powershell
# Get all documents
curl http://localhost:3000/api/documents

# Get all users
curl http://localhost:3000/api/users
```

---

## Troubleshooting

### Backend Issues

#### Database Connection Failed
```
❌ Database connection failed
```

**Solution:**
- Verify your database credentials in `src/database.ts`
- Check your internet connection (Neon DB is cloud-hosted)
- Ensure SSL is enabled (`PGSSLMODE=require`)

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```powershell
# Find the process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change the port in backend
$env:PORT=3001; npm run dev
```

### Frontend Issues

#### API Connection Failed
```
Failed to fetch
```

**Solution:**
- Ensure backend is running on `http://localhost:3000`
- Check `.env` file has correct `VITE_API_URL`
- Restart the frontend dev server after changing `.env`

#### CORS Errors
```
Access to fetch has been blocked by CORS policy
```

**Solution:**
- CORS is already enabled in backend `src/index.ts`
- Make sure both frontend and backend are running
- Clear browser cache and restart

#### Auth0 Issues
```
User not initialized
```

**Solution:**
- Set up Auth0 configuration in `.env`
- Or modify the pages to work without Auth0 (create a mock user)

### Database Issues

#### Tables Not Found
```
relation "users" does not exist
```

**Solution:**
```powershell
cd Inter-Compass-Service
npm run init-db
```

#### Permission Denied
```
permission denied for table users
```

**Solution:**
- Verify database user has proper permissions
- Check connection string in `database.ts`

---

## Development Workflow

### Making Changes

1. **Backend Changes:**
   - Edit files in `Inter-Compass-Service/src/`
   - Server will auto-restart (nodemon is configured)
   
2. **Frontend Changes:**
   - Edit files in `HTV-X/src/`
   - Browser will auto-reload (Vite HMR)

3. **Database Schema Changes:**
   - Edit `src/db/schema.sql`
   - Run `npm run init-db` to apply changes
   - **Warning:** This will drop and recreate tables!

### API Integration Pattern

When adding new features:

1. **Backend:**
   - Create controller in `src/controllers/`
   - Create routes in `src/routes/`
   - Import routes in `src/index.ts`

2. **Frontend:**
   - Add API functions to `src/lib/api.ts`
   - Use in React components with `useEffect` and state

Example:
```typescript
// Backend: src/controllers/exampleController.ts
export class ExampleController {
  static async getData() {
    // implementation
  }
}

// Backend: src/routes/exampleRoutes.ts
router.get('/', async (req, res) => {
  const data = await ExampleController.getData();
  res.json(data);
});

// Frontend: src/lib/api.ts
export const exampleApi = {
  getData: () => apiRequest('/example', { method: 'GET' })
};

// Frontend: Component
const data = await exampleApi.getData();
```

---

## Production Deployment

### Backend Deployment

1. Build the TypeScript code:
```powershell
npm run build
```

2. Start production server:
```powershell
npm start
```

### Frontend Deployment

1. Build the production bundle:
```powershell
npm run build
```

2. Preview production build:
```powershell
npm run preview
```

### Environment Variables for Production

Update your production environment with:
- Database credentials
- API URLs
- Auth0 production credentials
- Enable proper CORS origins

---

## Next Steps

### Recommended Enhancements

1. **Add Authentication Middleware**
   - Verify Auth0 tokens on backend
   - Protect admin-only endpoints

2. **Implement AI/RAG Features**
   - Connect to OpenAI or similar API
   - Implement vector search with ChromaDB
   - Generate intelligent responses in chat

3. **Add File Upload**
   - Support PDF/DOCX uploads
   - Extract and process document content
   - Store files in cloud storage (S3, Azure Blob)

4. **Implement Search**
   - Full-text search across documents
   - Filter by tags and categories
   - Search in chat history

5. **Add Analytics**
   - Track user interactions
   - Monitor API usage
   - Generate usage reports

---

## Support

If you encounter issues:

1. Check the console logs (both frontend and backend)
2. Verify all services are running
3. Review this documentation
4. Check the GitHub repository for updates

---

## License

This project is part of HTV X hackathon.

---

**Last Updated:** October 4, 2025

**Version:** 1.0.0
