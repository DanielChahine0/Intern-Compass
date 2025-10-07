<!-- README.md – Intern-Compass -->
<h1 align="center">Intern Compass</h1>
<p align="center"><em>RAG-Powered Onboarding Assistant for Seamless Employee Integration</em></p>

<p align="center">
  
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/DanielChahine0/Intern-Compass?style=for-the-badge&logo=GitHub">

  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/DanielChahine0/Intern-Compass?style=for-the-badge&logo=TypeScript">

  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/DanielChahine0/Intern-Compass?style=for-the-badge">

</p>

---

## Built with the tools and technologies

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript badge"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React badge"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite badge"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express badge"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL badge"/>
  <img src="https://img.shields.io/badge/Google&nbsp;Gemini-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Google Gemini badge"/>
  <img src="https://img.shields.io/badge/Auth0-EB5424?style=for-the-badge&logo=auth0&logoColor=white" alt="Auth0 badge"/>
  <img src="https://img.shields.io/badge/Tailwind&nbsp;CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS badge"/>
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui badge"/>
  <img src="https://img.shields.io/badge/TanStack&nbsp;Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white" alt="TanStack Query badge"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js badge"/>
  <img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white" alt="Bun badge"/>
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm badge"/>
  <img src="https://img.shields.io/badge/.ENV-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black" alt=".ENV badge"/>
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint badge"/>
  <img src="https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white" alt="Nodemon badge"/>
  <img src="https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white" alt="PostCSS badge"/>
  <img src="https://img.shields.io/badge/Radix&nbsp;UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white" alt="Radix UI badge"/>
</p>

---

## Table of Contents

- [Overview](#-overview)
- [Features](#features)
- [Quick Start](#-quick-start)
- [About](#-about)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

### 📚 Overview
Intern Compass is a RAG-powered (Retrieval-Augmented Generation) onboarding chatbot designed to help new employees quickly access company information, policies, and technical documentation. The application leverages Google's Gemini AI to provide intelligent responses based on uploaded PDF documents, creating a seamless onboarding experience.

### 🚀 Quick Start

#### 1. Clone the repo
```bash
git clone https://github.com/DanielChahine0/Intern-Compass.git
cd Intern-Compass
```

#### 2. Install dependencies (client + server)
```bash
cd backend
npm install              # installs server deps

cd ../frontend
npm install              # installs React/Vite deps (uses Bun)
```

#### 3. Create an .env file in the root directory
```
# Database (PostgreSQL with SSL)
PGHOST=<your-postgres-host>
PGDATABASE=<your-database-name>
PGUSER=<your-database-user>
PGPASSWORD=<your-database-password>
PGSSLMODE=require

# Gemini AI
GEMINI_API_KEY=<your-gemini-api-key>
GEN_MODEL=gemini-1.5-flash

# Frontend (Vite loads from root via envDir: "../")
VITE_API_URL=http://localhost:3001/api

# Auth0 (for frontend)
VITE_AUTH0_DOMAIN=<your-auth0-domain>
VITE_AUTH0_CLIENT_ID=<your-auth0-client-id>
VITE_AUTH0_AUDIENCE=<your-auth0-audience>
```

#### 4. Set up the database
```bash
cd backend
node run-migrations.js   # applies SQL migrations
```

#### 5. Run in dev mode
```bash
# Terminal 1 - Backend (from /backend)
npm run dev              # uses nodemon + ts-node

# Terminal 2 - Frontend (from /frontend)
npm run dev              # Vite dev server
```

Access the app at `http://localhost:8080` (frontend) and API at `http://localhost:3001` (backend).

### 📝 About
Intern Compass is a modern, full-stack RAG application built with TypeScript, React, Express, and PostgreSQL. The project aims to give HR teams, managers, and new employees a friction-free onboarding experience through:
- **Intelligent Document Processing** – upload PDF documents that are automatically processed, chunked, and embedded for semantic search.
- **AI-Powered Chat Interface** – interactive chatbot using Google Gemini AI to answer onboarding questions with contextual citations.
- **Admin Dashboard** – manage documents, view statistics, and control the knowledge base through an intuitive interface.
- **Semantic Search** – vector-based retrieval system powered by Gemini embeddings (text-embedding-004) that finds relevant information across all uploaded documents.
- **Citation System** – all AI responses include citations linking back to source documents for verification and trust.
- **Secure Authentication** – Auth0 integration with role-based access control for admin and user roles.
- **Rate Limiting & Request Queueing** – built-in protection against Gemini API rate limits with intelligent request queueing, exponential backoff, and retry mechanisms.
- **Responsive, Accessible UI** – React + shadcn/ui components with Radix UI primitives, styled with Tailwind CSS and compiled by Vite for <50ms HMR.
- **Robust API** – Express routes with TypeScript type safety, input validation middleware, and PostgreSQL connection pooling.
- **Developer-Friendly Workflow** – Nodemon auto-reloads the server, ESLint enforces code quality, and environment variables (.env) keep secrets out of source control.

The badge block at the top of the `README` shows the repo's last commit date, primary language, and language count, assuring newcomers the project is actively maintained. The second badge grid highlights every key tool so contributors can instantly see if the tech stack fits their skill set.

## Features

- **Intelligent Document Processing**: Upload PDF documents that are automatically processed, chunked, and embedded for semantic search.
- **AI-Powered Chat Interface**: Interactive chatbot using Google Gemini AI to answer onboarding questions with contextual citations.
- **Admin Dashboard**: Manage documents, view statistics, and control the knowledge base through an intuitive interface.
- **Semantic Search**: Vector-based retrieval system that finds relevant information across all uploaded documents.
- **Authentication**: Secure user authentication powered by Auth0 with role-based access control.
- **Rate Limiting**: Built-in protection against API rate limits with intelligent request queueing and retry mechanisms.
- **Citation System**: All AI responses include citations linking back to source documents for verification.

## Architecture

Intern Compass is built with a modern fullstack TypeScript architecture:

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with JSONB for vector embeddings
- **AI Service**: Google Gemini API (gemini-1.5-flash for chat, text-embedding-004 for embeddings)
- **PDF Processing**: pdf-parse library for text extraction
- **Port**: 3001

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Authentication**: Auth0 React SDK
- **Port**: 8080

### Data Flow
1. Administrators upload PDF documents via the admin interface
2. Backend processes PDFs to extract text and metadata
3. Text is chunked into semantic segments (512 tokens with 50-token overlap)
4. Each chunk is embedded using Gemini's text-embedding-004 model
5. Chunks and embeddings are stored in PostgreSQL as JSONB
6. User queries are embedded and compared using cosine similarity
7. Top-K relevant chunks are retrieved and passed to Gemini for response generation
8. Responses include citations pointing to source documents

## Prerequisites

Before installing Intern Compass, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Bun**: Latest version (for frontend only)
- **PostgreSQL**: Version 14.x or higher with SSL support
- **Google Gemini API Key**: Obtain from Google AI Studio
- **Auth0 Account**: Create a free account at auth0.com

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/DanielChahine0/Intern-Compass.git
cd Intern-Compass
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

The frontend uses Bun as its package manager:

```bash
cd ../frontend
npm install
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory (not in backend or frontend subdirectories):

```env
# Database Configuration (PostgreSQL)
PGHOST=your-database-host
PGDATABASE=your-database-name
PGUSER=your-database-user
PGPASSWORD=your-database-password
PGSSLMODE=require

# Google Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key
GEN_MODEL=gemini-1.5-flash

# Frontend Configuration (Vite will load these from root)
VITE_API_URL=http://localhost:3001/api

# Optional: Rate Limiting and Chunking Configuration
RAG_TOP_K=5
CHUNK_TOKENS=512
CHUNK_OVERLAP_TOKENS=50
```

### Important Configuration Notes

- **Root .env Location**: The `.env` file must be in the root directory. The frontend's Vite configuration is set to load environment variables from the parent directory using `envDir: path.resolve(__dirname, "..")`.
- **VITE_ Prefix**: All frontend environment variables must be prefixed with `VITE_` to be accessible in the client-side code.
- **Database SSL**: The application requires SSL connections to PostgreSQL. Ensure your database supports SSL connections.

### Auth0 Configuration

1. Create an Auth0 application (Single Page Application type)
2. Configure Allowed Callback URLs: `http://localhost:8080/auth/callback`
3. Configure Allowed Logout URLs: `http://localhost:8080`
4. Configure Allowed Web Origins: `http://localhost:8080`
5. Add Auth0 credentials to your frontend code or environment variables

## Running the Application

### Development Mode

The application requires two separate terminal sessions to run both backend and frontend services.

#### Start the Backend (Terminal 1)

```powershell
cd backend
npm run dev
```

The backend server will start on `http://localhost:3001` using nodemon for automatic reloading.

#### Start the Frontend (Terminal 2)

```powershell
cd frontend
npm run dev
```

The frontend will start on `http://localhost:8080` using Vite's development server.

### Production Build

#### Build Backend

```powershell
cd backend
npm run build
npm start
```

#### Build Frontend

```powershell
cd frontend
npm run build
npm run preview
```

## Deployment

Intern Compass is ready to deploy to multiple platforms! We provide complete deployment configurations for:

- ⭐ **Render** (All-in-One - Recommended for quick start)
- **Vercel** (Frontend) + **Render** (Backend) - Best for production
- **Railway** (Backend + DB) + **Netlify** (Frontend)
- **Docker** - Platform-agnostic containerization

### Quick Deploy to Render (5 minutes)

1. **Push to GitHub**:
   ```powershell
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **"New"** → **"Blueprint"**
   - Connect GitHub → Select repository
   - Set environment variables (Gemini API key, Auth0 config)
   - Deploy! 🚀

### Deployment Documentation

- **Quick Start**: See [QUICKSTART_DEPLOY.md](./QUICKSTART_DEPLOY.md) - 5-minute deployment guide
- **Comprehensive Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed instructions for all platforms
- **Summary**: See [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) - Overview of what's configured

### Pre-Deployment Check

Run this before deploying to catch common issues:

```powershell
cd backend
npm run predeploy
```

This validates:
- ✓ Build configuration
- ✓ Required files present
- ✓ TypeScript compiles successfully
- ✓ Database migrations ready

### Environment Variables for Production

See [.env.template](./.env.template) for a complete list of required variables.

**Backend (5 required)**:
- `GEMINI_API_KEY` - From Google AI Studio
- `PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` - PostgreSQL connection
- `CORS_ORIGIN` - Your frontend URL

**Frontend (3 required)**:
- `VITE_API_URL` - Your backend API URL
- `VITE_AUTH0_DOMAIN` - Auth0 tenant domain
- `VITE_AUTH0_CLIENT_ID` - Auth0 application client ID

## Database Setup

### 1. Create PostgreSQL Database

Create a new PostgreSQL database with SSL support enabled.

### 2. Run Initial Schema

Execute the base schema to create the initial tables:

```sql
CREATE TABLE IF NOT EXISTS users (
    userid SERIAL PRIMARY KEY,
    auth0_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tags (
    tagid SERIAL PRIMARY KEY,
    tagtype VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS documents (
    documentid SERIAL PRIMARY KEY,
    documenttitle VARCHAR(255) NOT NULL,
    documentcontent TEXT NOT NULL,
    tagid INTEGER REFERENCES tags(tagid),
    uploadedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chathistory (
    id SERIAL PRIMARY KEY,
    userid INTEGER REFERENCES users(userid),
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    citations JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Run Enhanced RAG Migration

Execute the migration script located at `backend/src/db/migrations/001_enhanced_rag_schema.sql`:

```powershell
# Using psql
psql -h your-host -U your-user -d your-database -f backend/src/db/migrations/001_enhanced_rag_schema.sql

# Or using the Node.js migration script
cd backend
node run-migrations.js
```

This migration adds:
- Enhanced `documents` table with author, page count, word count, and metadata
- `document_chunks` table for storing text chunks and embeddings
- Full-text search indexes for fallback retrieval
- `documents_with_stats` view for admin dashboard
- `cosine_similarity` function for vector search

### 4. Verify Database Schema

Run the schema verification script:

```powershell
cd backend
node check-schema.js
```

## Project Structure

```
Intern-Compass/
├── .env                          # Environment variables (root level)
├── .github/
│   └── copilot-instructions.md  # AI agent development guidelines
├── README.md
├── backend/
│   ├── src/
│   │   ├── index.ts             # Express server entry point
│   │   ├── database.ts          # Database connection singleton
│   │   ├── config/
│   │   │   └── gemini.ts        # Gemini AI configuration
│   │   ├── controllers/
│   │   │   ├── adminController.ts
│   │   │   └── geminiController.ts
│   │   ├── db/
│   │   │   └── migrations/
│   │   │       └── 001_enhanced_rag_schema.sql
│   │   ├── lib/
│   │   │   ├── requestQueue.ts   # Rate limit queue manager
│   │   │   └── retry.ts          # Retry with exponential backoff
│   │   ├── middleware/
│   │   │   ├── rateLimiter.ts    # Express rate limiting
│   │   │   └── validation.ts     # Request validation
│   │   ├── routes/
│   │   │   ├── admin.ts          # Admin API routes
│   │   │   ├── chat.ts           # Chat API routes
│   │   │   ├── gemini.ts         # Gemini test routes
│   │   │   └── users.ts          # User management routes
│   │   └── services/
│   │       ├── ragService.ts     # RAG orchestration
│   │       ├── embeddingService.ts
│   │       ├── geminiService.ts
│   │       ├── chunkingService.ts
│   │       └── pdfProcessor.ts
│   ├── test/
│   │   └── data/                 # Test documents
│   ├── test-gemini.js            # Gemini API connection test
│   ├── test-admin-endpoint.js    # Document upload test
│   ├── check-schema.js           # Database schema verification
│   ├── run-migrations.js         # Migration runner
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
└── frontend/
    ├── src/
    │   ├── main.tsx              # React entry point
    │   ├── App.tsx               # Route configuration
    │   ├── components/
    │   │   ├── Layout.tsx
    │   │   └── ui/               # shadcn/ui components
    │   ├── lib/
    │   │   ├── api.ts            # API client functions
    │   │   ├── auth.tsx          # Auth0 context
    │   │   └── utils.ts
    │   └── pages/
    │       ├── Auth.tsx          # Authentication page
    │       ├── Chat.tsx          # Main chat interface
    │       ├── Admin.tsx         # Admin dashboard
    │       ├── Outline.tsx       # Document outline view
    │       └── NotFound.tsx
    ├── public/
    ├── bun.lockb                 # Bun lock file
    ├── components.json           # shadcn/ui configuration
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── tailwind.config.ts
```

## API Documentation

### Admin Endpoints

#### Upload Document
```http
POST /api/admin/documents/upload
Content-Type: multipart/form-data

FormData:
  - file: PDF file
  - documentTitle: string
  - tagId?: number
```

#### Get All Documents
```http
GET /api/admin/documents
```

#### Get Single Document
```http
GET /api/admin/documents/:id
```

#### Delete Document
```http
DELETE /api/admin/documents/:id
```

#### Search Documents
```http
GET /api/admin/documents/search?query=string
```

#### Get Knowledge Base Statistics
```http
GET /api/admin/stats
```

### Chat Endpoints

#### Send Chat Message
```http
POST /api/chat/send
Content-Type: application/json

{
  "message": "string",
  "userId": number,
  "conversationId"?: string
}
```

#### Get Chat History
```http
GET /api/chat/history/:userId?limit=50
```

### User Endpoints

#### Upsert User
```http
POST /api/users/upsert
Content-Type: application/json

{
  "auth0_id": "string",
  "email": "string",
  "name"?: "string"
}
```

## Testing

The backend includes several utility scripts for testing different components:

### Test Gemini Connection
```powershell
cd backend
node test-gemini.js
```

### Test Document Upload
```powershell
cd backend
node test-admin-endpoint.js
```

### Verify Database Schema
```powershell
cd backend
node check-schema.js
```

### Run Database Migrations
```powershell
cd backend
node run-migrations.js
```

## Troubleshooting

### Common Issues

#### Backend fails to start with database connection error
- Verify that all database credentials in `.env` are correct
- Ensure your PostgreSQL instance supports SSL connections
- Check that the database exists and is accessible from your network
- Verify `PGSSLMODE=require` is set in your `.env` file

#### Frontend cannot connect to backend API
- Confirm the backend is running on port 3001
- Check that `VITE_API_URL` in root `.env` points to `http://localhost:3001/api`
- Verify the `.env` file is in the root directory, not in the frontend folder
- Restart the Vite development server after changing environment variables

#### Gemini API rate limit errors (429)
- The application implements two-layer rate limiting to handle Gemini's free tier limits (10 requests per minute)
- Requests are automatically queued and spaced at 6.5-second intervals
- If you consistently hit rate limits, consider upgrading to a paid Gemini API plan or reducing concurrent requests

#### PDF processing fails
- Verify the PDF is not encrypted or password-protected
- Check that the PDF contains extractable text (not scanned images)
- Ensure the file size is reasonable (under 50MB recommended)
- Review backend logs for specific error messages

#### Frontend shows "Rate limit exceeded" message
- Wait for the specified retry period before sending new requests
- The frontend displays the retry countdown automatically
- Consider batching queries or reducing request frequency during development

#### Workspace path issues in PowerShell
- The project path contains spaces ("Intern Compass")
- Always quote paths in terminal commands: `cd "C:\Users\...\Intern Compass\..."`
- Use the tab completion feature in PowerShell to automatically escape paths

#### Auth0 authentication callback fails
- Ensure `/auth/callback` route exists in `App.tsx`
- Verify callback URLs are correctly configured in Auth0 dashboard
- Check that Auth0 domain and client ID match your application settings
- Clear browser cache and cookies if authentication state is inconsistent

## Deployment

The application is designed for cloud deployment with the following options:

### Deployment Platforms
- **Backend**: Render.com, Railway, Heroku (Node.js with PostgreSQL addon)
- **Frontend**: Vercel, Netlify, or served statically from backend
- **Database**: Render PostgreSQL, Neon, Supabase, or any managed PostgreSQL service

### Pre-Deployment Checklist
1. Ensure all environment variables are configured in your hosting platform
2. Run `npm run build` in the frontend directory to generate production assets
3. Verify database migrations have been applied: `node run-migrations.js`
4. Test Gemini API connection with your production API key
5. Configure Auth0 callback URLs for your production domain
6. Set up SSL/TLS certificates (usually automatic on Render/Vercel)
7. Review and adjust rate limiting settings for production traffic

For detailed deployment instructions, see:
- `DEPLOYMENT.md` - Comprehensive deployment guide
- `QUICKSTART_DEPLOY.md` - Quick deployment walkthrough
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment verification steps

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository and create a feature branch
2. Follow the existing code style and TypeScript conventions
3. Write clear commit messages describing your changes
4. Test your changes thoroughly in both development and production builds
5. Update documentation if you change functionality
6. Submit a pull request with a detailed description of your changes

### Development Guidelines

- Use the singleton pattern for database and service configurations
- Always enqueue Gemini API calls through the request queue to respect rate limits
- Include error handling with retry logic for external API calls
- Follow the semantic chunking strategy for document processing
- Maintain type safety throughout the codebase with TypeScript
- Use the existing shadcn/ui components for consistency in the frontend

## License

This project is licensed under the ISC License. See the repository for more details.

---

For additional guidance on working with this codebase, developers should refer to `.github/copilot-instructions.md` for AI-assisted development patterns and architectural decisions.