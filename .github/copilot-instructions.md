# InternCompass - AI Copilot Instructions

## Project Overview
InternCompass is a full-stack RAG-powered onboarding assistant with a React/Vite frontend (HTV-X) and Express/TypeScript backend (Inter-Compass-Service). The system processes PDF documents, generates vector embeddings via Google Gemini, and provides grounded Q&A with source citations.

## Architecture

### Two-Service Structure
- **Frontend (HTV-X)**: Vite + React + TypeScript + shadcn/ui on port 8080/5173
- **Backend (Inter-Compass-Service)**: Express + TypeScript + PostgreSQL (Neon) on port 3000

### Core Data Flow
```
PDF Upload → pdfProcessor → chunkingService → embeddingService → PostgreSQL
User Query → RAG Retrieval → Gemini Generation → Cited Response
```

### Critical Components
- **RAG Pipeline**: `src/services/{ragService,pdfProcessor,chunkingService,embeddingService}.ts`
- **Database**: PostgreSQL (Neon) with vector embeddings stored as JSONB in `document_chunks` table
- **AI**: Google Gemini API (`gemini-1.5-pro` for generation, `text-embedding-004` for vectors)
- **Auth**: Auth0 integration (frontend uses `@auth0/auth0-react`)

## Development Workflow

### Starting Services (Windows PowerShell)
```powershell
# Backend - always start first
cd Inter-Compass-Service
npm run dev  # nodemon on port 3000

# Frontend - in separate terminal
cd HTV-X
npm run dev  # Vite on port 5173
```

### Database Initialization
The backend uses hardcoded Neon PostgreSQL credentials in `src/database.ts` (fallback if `.env` missing). Run migrations with:
```powershell
node run-migrations.js
```
Schema lives in `src/db/migrations/001_enhanced_rag_schema.sql`.

### Testing RAG System
1. Upload PDF: `POST /api/admin/upload-pdf` (multipart/form-data with `pdf` file field)
2. Query: `POST /api/chat/ask` with `{ question: "..." }`
3. Check logs: Backend outputs detailed processing steps with emoji prefixes (📄, 🔪, 🧮, ✅)

## Key Patterns & Conventions

### API Structure
- All backend routes mount under `/api/*` (admin, chat, gemini, users)
- Frontend API client (`HTV-X/src/lib/api.ts`) uses `VITE_API_URL` env var
- Custom `ApiError` class handles rate limits (429) with `retryAfter` field

### Document Processing
- PDFs processed via `pdf-parse` library in `pdfProcessor.ts`
- Chunks: ~512 tokens with 50-token overlap (see `chunkingService.ts`)
- Embeddings: 768-dimensional vectors from Gemini's `text-embedding-004`
- Metadata extraction includes document type detection (onboarding, policy, handbook)

### RAG Configuration
```typescript
// In ragService.ts
TOP_K = 5                    // chunks retrieved per query
MIN_RELEVANCE_SCORE = 0.3    // cosine similarity threshold
temperature = 0.2            // Gemini generation (low for factual accuracy)
```

### Rate Limiting
- Gemini endpoints: 50 requests/minute (see `middleware/rateLimiter.ts`)
- Custom in-memory store (no Redis in current setup)
- Returns `429` with `Retry-After` header on limit

### Database Conventions
- All tables use lowercase with underscores: `document_chunks`, `chat_messages`
- Foreign keys cascade delete: deleting document removes all chunks
- Use `documents_with_stats` view for document listings with chunk counts

## Critical Files to Check

### When Modifying RAG
1. `ragService.ts` - orchestrates entire pipeline, contains prompt engineering
2. `embeddingService.ts` - batch processing (handle partial failures gracefully)
3. `adminController.ts` - multipart upload handling with multer (50MB limit)

### When Adding API Endpoints
1. Create route in `src/routes/*.ts`
2. Add controller in `src/controllers/*Controller.ts`
3. Mount route in `src/index.ts`
4. Add client function to `HTV-X/src/lib/api.ts`

### When Debugging
- Backend logs use console with emoji prefixes for visual scanning
- Check terminal output for processing steps (times measured)
- Use `check-backend.ps1` or `start-backend.ps1` scripts
- Frontend errors surface via toast notifications (shadcn/ui toast component)

## Environment Variables

### Backend (.env)
```bash
# PostgreSQL (Neon) - has fallback hardcoded values
PGHOST=ep-ancient-sky-ado6vkwx-pooler.c-2.us-east-1.aws.neon.tech
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=npg_V0ks7LPqizvX

# Google Gemini
GEMINI_API_KEY=AIzaSyDIrhhuqLcglLOz6AT9c-aVCxCRWExsCa0
EMBEDDING_MODEL=text-embedding-004
GEN_MODEL=gemini-1.5-pro

PORT=3000
NODE_ENV=development
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3000/api
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
```

## Common Gotchas

1. **Embeddings as JSONB**: Vector embeddings stored as JSONB arrays in PostgreSQL (not pgvector extension). Similarity calculated in-memory after retrieval.

2. **Multer Upload**: Admin upload requires `multipart/form-data` with field name `pdf`. Test with: `curl -F "pdf=@file.pdf" http://localhost:3000/api/admin/upload-pdf`

3. **Auth0 Fallback**: Chat works without Auth0 (uses fallback user ID) - see `Chat.tsx` line 43-44

4. **Build Process**: Backend requires `npm run build` → `tsc` compiles to `dist/`. Frontend uses Vite bundler.

5. **CORS**: Enabled by default in backend - no origin restrictions in development

## Persona System
The system supports 5 AI personas (Default, Mentor, Tech, Creative, Academic) defined in `src/config/personas.ts`. Pass `persona` parameter to `/api/gemini/*` endpoints. Frontend has `PersonaSelector` component.

## Testing Resources
- `RAG_TESTING_GUIDE.md` - comprehensive testing scenarios
- `test-gemini.js` - Node.js script for API testing
- `API_TESTING.md` - cURL examples for all endpoints

## Documentation
Critical docs: `FULLSTACK_SUMMARY.md`, `RAG_IMPLEMENTATION_SUMMARY.md`, `GEMINI_INTEGRATION_COMPLETE.md`, `QUICK_START.md`
