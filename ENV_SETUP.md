# Environment Variables Setup Guide

This guide explains how to set up environment variables for both the backend and frontend of the Intern Compass application.

## Overview

The application uses environment variables for configuration. Sensitive information like API keys and database credentials should **never** be committed to version control.

## Backend Environment Variables

### Location
Create a `.env` file in the `backend/` directory.

### Required Variables

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration (Neon PostgreSQL)
PGHOST=your-neon-host.neon.tech
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=your-password-here
PGSSLMODE=require
PGCHANNELBINDING=require

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key-here
EMBEDDING_MODEL=text-embedding-004
GEN_MODEL=gemini-2.5-flash

# RAG Configuration
RAG_TOP_K=8
CHUNK_TOKENS=900
CHUNK_OVERLAP_TOKENS=180

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Optional Variables

```bash
# PostgreSQL Connection String (alternative to individual vars)
POSTGRES_URL=postgres://user:password@host:5432/database
POSTGRES_SSL=false

# Redis (for caching and rate limiting)
REDIS_URL=redis://localhost:6379

# AWS S3 or MinIO (for document storage)
S3_BUCKET=interncompass
S3_REGION=us-east-1
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_FORCE_PATH_STYLE=true

# Logging
LOG_LEVEL=info
```

## Frontend Environment Variables

### Location
Create a `.env` file in the `frontend/` directory.

### Important Notes
- All frontend environment variables **MUST** be prefixed with `VITE_`
- Vite only exposes variables starting with `VITE_` to the client-side code
- Never expose sensitive backend credentials in frontend env vars

### Required Variables

```bash
# API Configuration
VITE_API_URL=http://localhost:3001/api

# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
```

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env and fill in your actual values
```

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Edit .env and fill in your actual values
```

### 3. Get Required Credentials

#### Neon PostgreSQL Database
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection details (host, database, user, password)

#### Google Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Copy the API key to `GEMINI_API_KEY`

#### Auth0
1. Sign up at [auth0.com](https://auth0.com)
2. Create a new application (Single Page Application)
3. Copy the Domain and Client ID
4. Configure callback URLs in Auth0 dashboard:
   - Allowed Callback URLs: `http://localhost:8080/auth/callback`
   - Allowed Logout URLs: `http://localhost:8080`
   - Allowed Web Origins: `http://localhost:8080`

## Environment Variable Reference

### Backend Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PORT` | number | 3001 | Backend server port |
| `NODE_ENV` | string | development | Environment mode |
| `PGHOST` | string | **required** | PostgreSQL host |
| `PGDATABASE` | string | **required** | PostgreSQL database name |
| `PGUSER` | string | **required** | PostgreSQL username |
| `PGPASSWORD` | string | **required** | PostgreSQL password |
| `PGSSLMODE` | string | require | PostgreSQL SSL mode |
| `GEMINI_API_KEY` | string | **required** | Google Gemini API key |
| `EMBEDDING_MODEL` | string | text-embedding-004 | Embedding model name |
| `GEN_MODEL` | string | gemini-2.5-flash | Generation model name |
| `RAG_TOP_K` | number | 8 | Number of document chunks to retrieve |
| `CHUNK_TOKENS` | number | 900 | Token size for text chunks |
| `CHUNK_OVERLAP_TOKENS` | number | 180 | Overlap tokens between chunks |
| `FRONTEND_URL` | string | http://localhost:5173 | Frontend URL for CORS |

### Frontend Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_API_URL` | string | http://localhost:3001/api | Backend API URL |
| `VITE_AUTH0_DOMAIN` | string | **required** | Auth0 domain |
| `VITE_AUTH0_CLIENT_ID` | string | **required** | Auth0 client ID |

## Security Best Practices

1. **Never commit `.env` files** - They are in `.gitignore`
2. **Use different credentials for each environment** (dev, staging, prod)
3. **Rotate API keys regularly**
4. **Use strong passwords for database credentials**
5. **Keep `.env.example` files updated** but without real values
6. **Don't expose backend environment variables in frontend code**

## Troubleshooting

### Backend won't start
- Check that all required environment variables are set
- Verify database credentials are correct
- Test database connection: `psql "postgresql://user:password@host/database"`

### Frontend can't connect to API
- Verify `VITE_API_URL` matches your backend URL
- Check that backend is running on the correct port
- Open browser console to see actual API errors

### Auth0 login fails
- Verify Auth0 domain and client ID are correct
- Check Auth0 dashboard for correct callback URLs
- Ensure Auth0 application type is "Single Page Application"

### RAG/Embedding errors
- Verify `GEMINI_API_KEY` is valid
- Check Gemini API quota limits
- Test API key at [Google AI Studio](https://makersuite.google.com)

## Production Deployment

For production, use environment-specific variables:

1. **Never use development credentials in production**
2. **Enable SSL/TLS for database connections**
3. **Use secure HTTPS URLs**
4. **Set `NODE_ENV=production`**
5. **Consider using a secret management service** (AWS Secrets Manager, Azure Key Vault, etc.)

### Example Production Backend `.env`

```bash
PORT=3001
NODE_ENV=production
PGHOST=prod-db.example.com
PGSSLMODE=require
FRONTEND_URL=https://interncompass.example.com
LOG_LEVEL=warn
```

### Example Production Frontend `.env`

```bash
VITE_API_URL=https://api.interncompass.example.com/api
VITE_AUTH0_DOMAIN=prod.auth0.com
VITE_AUTH0_CLIENT_ID=prod_client_id
```
