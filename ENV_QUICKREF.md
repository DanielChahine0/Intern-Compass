# Environment Variables Quick Reference

## Single .env File (Root Directory)

All environment variables are in **one file**: `.env` in the root directory.

### Backend Variables

```bash
# Required
PORT=3001
PGHOST=your-host.neon.tech
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=your-password
GEMINI_API_KEY=your-api-key

# Optional (with defaults)
NODE_ENV=development
PGSSLMODE=require
EMBEDDING_MODEL=text-embedding-004
GEN_MODEL=gemini-2.5-flash
RAG_TOP_K=8
CHUNK_TOKENS=900
CHUNK_OVERLAP_TOKENS=180
FRONTEND_URL=http://localhost:5173
```

### Frontend Variables (VITE_ prefix)

```bash
# Required
VITE_API_URL=http://localhost:3001/api
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
```

## Quick Setup

```bash
# Edit the root .env file
code .env

# Add your credentials
# Backend will load from: ../env (from backend/src/)
# Frontend will load from: ../.env (from frontend/)
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Backend won't start | Check all required env vars are set |
| Frontend can't connect | Verify VITE_API_URL matches backend port |
| Auth0 fails | Check domain and client ID, verify callback URLs |
| Database error | Verify credentials, check SSL settings |
| Gemini errors | Verify API key, check quota limits |

See `ENV_SETUP.md` for detailed documentation.
