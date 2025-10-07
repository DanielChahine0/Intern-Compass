# Intern Compass - AI Agent Instructions

## Architecture Overview

**Intern Compass** is a RAG-powered onboarding chatbot with TypeScript fullstack architecture:
- **Backend**: Express + TypeScript + PostgreSQL, serving at `:3001`
- **Frontend**: React + Vite + shadcn/ui, serving at `:8080`
- **AI Integration**: Google Gemini API for embeddings (text-embedding-004) and chat (gemini-1.5-flash)
- **Storage**: PostgreSQL with vector embeddings stored as JSONB

### Core Data Flow
1. PDFs uploaded via `/api/admin/documents/upload` → processed by `pdfProcessor`
2. Text chunked semantically (512 tokens, 50 overlap) → `chunkingService`
3. Chunks embedded via Gemini → stored in `document_chunks` table with JSONB vectors
4. User queries → embedded → cosine similarity search → top-K retrieval → RAG response

## Critical Development Workflows

### Environment Setup
Root `.env` required with:
```bash
# Database (PostgreSQL with SSL)
PGHOST=<host>
PGDATABASE=<db>
PGUSER=<user>
PGPASSWORD=<pass>
PGSSLMODE=require

# Gemini AI
GEMINI_API_KEY=<key>
GEN_MODEL=gemini-1.5-flash

# Frontend (Vite loads from root via envDir: "../")
VITE_API_URL=http://localhost:3001/api
```

### Running the App (PowerShell)
```powershell
# Backend (from /backend)
npm run dev  # Uses nodemon + ts-node

# Frontend (from /frontend) - uses Bun
npm run dev  # Vite dev server
```

**Note**: Frontend uses Bun (see `bun.lockb`), backend uses npm. Vite config loads env from root: `envDir: path.resolve(__dirname, "..")`.

### Database Migrations
Run SQL from `backend/src/db/migrations/001_enhanced_rag_schema.sql` manually:
- Creates `documents` table (documentid, documenttitle, tagid, author, metadata)
- Creates `document_chunks` table (chunkid, documentid, chunk_text, embedding JSONB)
- Sets up full-text search indexes and `documents_with_stats` view

## Project-Specific Conventions

### Rate Limiting Pattern
Gemini API has strict limits (10 RPM free tier). **Two-layer defense**:
1. **Express middleware** (`rateLimiter.ts`): 8 req/min per IP, returns 429 with `Retry-After` header
2. **Request queue** (`requestQueue.ts`): 6.5s intervals (~9 RPM), priority-based queue with timeouts

```typescript
// Always use queue for Gemini calls in services
return geminiQueue.enqueue(async () => {
  // Your Gemini API call here
}, priority);
```

### Error Handling in RAG Pipeline
Services (`ragService`, `embeddingService`, `geminiService`) use **retry with exponential backoff** via `lib/retry.ts`:
```typescript
retryWithBackoff(async () => { /* operation */ }, {
  maxRetries: 2,
  baseDelay: 1000,
  retryCondition: (error) => error.status >= 500
});
```

Frontend catches rate limit errors specifically:
```typescript
if (error.status === 429) {
  toast.error(`Rate limit hit. Retry in ${error.retryAfter}s`);
}
```

### Singleton Pattern for Services
Database (`database.ts`) and configs (`config/gemini.ts`) use **singleton pattern**:
```typescript
export const db = Database.getInstance();
export const geminiConfig = new GeminiConfig(); // initialized once
```

Import these singletons, never instantiate manually.

### Chunking Strategy
`chunkingService.ts` uses **semantic-aware chunking**:
- Splits by paragraphs first (preserves context boundaries)
- ~512 tokens/chunk with 50-token overlap (4 chars/token estimate)
- Metadata includes `startChar`, `endChar`, section info

**Don't** use naive character-based splitting for RAG documents.

### Auth0 Integration
Frontend uses `@auth0/auth0-react` for authentication. `App.tsx` wraps routes with `<ProtectedRoute>` checking `isAuthenticated`. Backend currently **does not validate Auth0 tokens** (future enhancement area).

User data stored in `users` table via `/api/users/upsert`, linked to `chathistory` by `userid`.

## Key Files Reference

- **RAG orchestration**: `backend/src/services/ragService.ts` (processDocument, retrieveRelevantChunks)
- **API routes**: `backend/src/routes/admin.ts` (document upload/CRUD), `backend/src/routes/chat.ts` (chat interface)
- **Database connection**: `backend/src/database.ts` (connection pooling, query helper)
- **Frontend API client**: `frontend/src/lib/api.ts` (typed wrappers for all endpoints)
- **Chat UI**: `frontend/src/pages/Chat.tsx` (manages message state, citation display)

## Testing Utilities

Backend includes test scripts in `backend/`:
- `test-gemini.js`: Validates Gemini API connection
- `test-admin-endpoint.js`: Tests document upload flow
- `check-schema.js`: Verifies database schema
- `run-migrations.js`: Applies SQL migrations programmatically

Run with: `node <script-name>.js` from backend directory.

## Common Gotchas

1. **Vite env loading**: Frontend env vars must be in **root** `.env`, prefixed with `VITE_`
2. **JSONB embeddings**: Vectors stored as JSON arrays, not pgvector extension. Use `JSON.parse()` for similarity calculations
3. **PowerShell paths**: Workspace has spaces ("Intern Compass"), quote paths in terminal commands
4. **Rate limit queue**: Never bypass queue for Gemini calls—causes cascading 429 errors
5. **Auth0 callback**: Route `/auth/callback` required in `App.tsx` for OAuth flow

## Component Library (shadcn/ui)

Frontend uses shadcn/ui components in `frontend/src/components/ui/`. These are **copied, not imported**, so modifications persist. Configuration in `components.json` with Tailwind theme in `tailwind.config.ts`.
