# Environment Configuration - Single .env File

## Overview

The Intern Compass project now uses a **single `.env` file** located in the root directory. Both the backend and frontend read from this same file.

## Structure

```
Intern-Compass/
├── .env                    ← Single environment file (shared by backend & frontend)
├── backend/
│   └── src/
│       ├── database.ts     ← Loads from ../../.env
│       └── index.ts        ← Loads from ../../.env
├── frontend/
│   └── vite.config.ts      ← Configured to load from ../.env
└── ...
```

## How It Works

### Backend (Node.js/TypeScript)
- All `.ts` files in `backend/src/` load the root `.env` using:
  ```typescript
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  ```
- All `.js` scripts in `backend/` load using:
  ```javascript
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
  ```

### Frontend (Vite/React)
- `vite.config.ts` is configured with:
  ```typescript
  envDir: path.resolve(__dirname, "..")
  ```
- This tells Vite to load `.env` from the parent directory (root)
- Only variables prefixed with `VITE_` are exposed to the frontend

## Files Modified

### Backend Files
1. `backend/src/database.ts` - Updated dotenv path
2. `backend/src/index.ts` - Updated dotenv path
3. `backend/run-migrations.js` - Updated dotenv path
4. `backend/check-schema.js` - Updated dotenv path
5. `backend/create-view.js` - Updated dotenv path

### Frontend Files
1. `frontend/vite.config.ts` - Added `envDir` configuration

### Files Removed
- `backend/.env` ❌
- `backend/.env.example` ❌
- `frontend/.env` ❌
- `frontend/.env.example` ❌
- `.env.example` (root) ❌

### Files Kept
- `.env` (root) ✅ - The only environment file

## Environment Variables

### Backend Variables
All backend variables are accessible via `process.env`:
- `PORT`
- `NODE_ENV`
- `PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, `PGSSLMODE`, `PGCHANNELBINDING`
- `GEMINI_API_KEY`, `EMBEDDING_MODEL`, `GEN_MODEL`
- `RAG_TOP_K`, `CHUNK_TOKENS`, `CHUNK_OVERLAP_TOKENS`
- `FRONTEND_URL`
- Optional: `REDIS_URL`, `S3_*`, `LOG_LEVEL`

### Frontend Variables
Only variables with `VITE_` prefix are accessible via `import.meta.env`:
- `VITE_API_URL`
- `VITE_AUTH0_DOMAIN`
- `VITE_AUTH0_CLIENT_ID`

## Benefits

1. ✅ **Single source of truth** - One file to manage
2. ✅ **No duplication** - No need to sync multiple .env files
3. ✅ **Simpler setup** - New developers only need to configure one file
4. ✅ **Clear separation** - VITE_ prefix clearly indicates frontend vars
5. ✅ **Version control friendly** - Only one .env file in .gitignore

## Development Workflow

```bash
# 1. Edit the root .env file with your credentials
code .env

# 2. Start backend (will load from root .env)
cd backend
npm run dev

# 3. Start frontend (will load from root .env via vite.config)
cd frontend
npm run dev
```

## Important Notes

⚠️ **Frontend Security**: Never put sensitive backend credentials in `VITE_*` variables! The `VITE_` prefix exposes variables to the client-side code.

✅ **What's Safe for VITE_**:
- API URLs
- Auth0 public client IDs and domains
- Public configuration values

❌ **Never Use VITE_ for**:
- Database credentials
- API keys (unless meant to be public)
- Backend secrets

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend can't find env vars | Check .env is in root directory |
| Frontend can't find VITE_ vars | Restart Vite dev server after .env changes |
| Path errors | Verify path.resolve(__dirname, ...) points correctly |
| Vite not loading .env | Check vite.config.ts has envDir setting |

## Testing

After setup, verify:
```bash
# Backend should connect to database
cd backend
npm run dev
# Should see: ✅ Database connected successfully

# Frontend should connect to API
cd frontend
npm run dev
# Open http://localhost:8080 and check console for errors
```
