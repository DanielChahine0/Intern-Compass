# Intern Compass - Deployment Guide

## Overview
This guide covers deploying Intern Compass to various platforms. The app consists of:
- **Backend**: Express + TypeScript (Port 3001)
- **Frontend**: React + Vite (Static files)
- **Database**: PostgreSQL with JSONB for embeddings
- **AI**: Google Gemini API

---

## Option 1: Render (Recommended ⭐)

### Why Render?
- ✅ Single platform for frontend, backend, and PostgreSQL
- ✅ Free tier includes 750 hours/month for web services
- ✅ Free PostgreSQL database (90 days, then paid)
- ✅ Easy environment variable management
- ✅ Automatic deploys from GitHub

### Prerequisites
1. GitHub repository with your code
2. Render account: https://render.com
3. Gemini API key
4. Auth0 application (for authentication)

### Deployment Steps

#### 1. Connect Repository
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Select `Intern-Compass` repository
5. Render will detect `render.yaml`

#### 2. Configure Environment Variables
Render will prompt for sensitive variables. Set these:

**Backend Service (`intern-compass-backend`):**
```bash
# Database (use Render's PostgreSQL or external)
PGHOST=your-db-host.render.com
PGDATABASE=intern_compass
PGUSER=intern_compass_user
PGPASSWORD=your-secure-password
PGSSLMODE=require

# AI Service
GEMINI_API_KEY=your-gemini-api-key
GEN_MODEL=gemini-1.5-flash

# CORS (automatically set from frontend URL)
CORS_ORIGIN=https://intern-compass-frontend.onrender.com
```

**Frontend Service (`intern-compass-frontend`):**
```bash
# API URL (automatically set from backend URL)
VITE_API_URL=https://intern-compass-backend.onrender.com/api

# Auth0
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_CALLBACK_URL=https://intern-compass-frontend.onrender.com/auth/callback
```

#### 3. Create PostgreSQL Database
If using Render's database:
1. Click **"New"** → **"PostgreSQL"**
2. Name: `intern-compass-db`
3. Select free tier
4. Copy connection details to backend env vars

#### 4. Run Migrations
After backend deploys:
1. Go to backend service → **"Shell"**
2. Run:
```bash
cd backend
node run-migrations.js
```

#### 5. Update Auth0 Callback URLs
In Auth0 dashboard, add:
- **Allowed Callback URLs**: `https://your-frontend-url.onrender.com/auth/callback`
- **Allowed Logout URLs**: `https://your-frontend-url.onrender.com`
- **Allowed Web Origins**: `https://your-frontend-url.onrender.com`

### Important Notes
- ⚠️ Free tier services sleep after 15 min inactivity (50 sec cold start)
- ⚠️ PostgreSQL free tier expires after 90 days
- Consider upgrading to paid plans for production use

---

## Option 2: Vercel (Frontend) + Render (Backend + DB)

### Why This Combo?
- ✅ Vercel excels at frontend hosting (CDN, edge functions)
- ✅ Keep backend + database on Render
- ✅ Vercel free tier is generous for static sites

### Deployment Steps

#### 1. Deploy Backend to Render
Follow **Option 1** steps for backend and database only.

#### 2. Deploy Frontend to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. From frontend directory:
```bash
cd frontend
vercel
```

3. Configure build settings:
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

4. Set environment variables in Vercel dashboard:
```bash
VITE_API_URL=https://your-backend.onrender.com/api
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_CALLBACK_URL=https://your-app.vercel.app/auth/callback
```

#### 3. Update Backend CORS
In Render backend, update `CORS_ORIGIN`:
```bash
CORS_ORIGIN=https://your-app.vercel.app
```

---

## Option 3: Netlify (Frontend) + Railway (Backend + DB)

### Why Railway?
- ✅ Better database persistence than Render free tier
- ✅ $5 free credit/month
- ✅ One-click PostgreSQL

### Deployment Steps

#### 1. Deploy Backend to Railway
1. Visit [Railway](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select repository
4. Add PostgreSQL service:
   - Click **"New"** → **"Database"** → **"PostgreSQL"**
   - Railway auto-connects to backend

5. Configure backend service:
```bash
# Railway provides DATABASE_URL automatically
# Add these manually:
GEMINI_API_KEY=your-key
GEN_MODEL=gemini-1.5-flash
CORS_ORIGIN=https://your-app.netlify.app
PORT=3001
```

6. Set build settings:
```
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
```

#### 2. Deploy Frontend to Netlify
1. Visit [Netlify](https://netlify.com)
2. **"Add new site"** → **"Import from Git"**
3. Select repository
4. Configure:
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

5. Set environment variables:
```bash
VITE_API_URL=https://your-backend.up.railway.app/api
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_CALLBACK_URL=https://your-app.netlify.app/auth/callback
```

6. Add redirect rules (create `frontend/public/_redirects`):
```
/*    /index.html   200
```

---

## Option 4: All-in-One with Railway

### Deployment Steps
1. Deploy backend + database (as above)
2. Add frontend as static service:
   - **"New Service"** → **"GitHub Repo"**
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve dist -p $PORT`

---

## Environment Variables Reference

### Backend Required Variables
```bash
# Database
PGHOST=<host>
PGDATABASE=<database>
PGUSER=<user>
PGPASSWORD=<password>
PGSSLMODE=require

# AI
GEMINI_API_KEY=<your-key>
GEN_MODEL=gemini-1.5-flash

# Server
PORT=3001
NODE_ENV=production
CORS_ORIGIN=<frontend-url>
```

### Frontend Required Variables
```bash
VITE_API_URL=<backend-url>/api
VITE_AUTH0_DOMAIN=<domain>.auth0.com
VITE_AUTH0_CLIENT_ID=<client-id>
VITE_AUTH0_CALLBACK_URL=<frontend-url>/auth/callback
```

---

## Database Setup

### Running Migrations
After backend deploys, run migrations via platform shell:

**Render/Railway Shell:**
```bash
cd backend
node run-migrations.js
```

Or manually execute `backend/src/db/migrations/001_enhanced_rag_schema.sql` via psql.

### Connection Pooling
PostgreSQL on Render/Railway has connection limits. Consider:
- Using PgBouncer (connection pooler)
- Reducing pool size in `database.ts` for production

---

## Post-Deployment Checklist

- [ ] Backend health check responds: `GET /api/health`
- [ ] Frontend loads correctly
- [ ] Auth0 login works
- [ ] Test document upload: `/admin`
- [ ] Test chat functionality: `/chat`
- [ ] Verify rate limiting doesn't block legit requests
- [ ] Check logs for errors
- [ ] Set up monitoring (Sentry, LogRocket, etc.)
- [ ] Configure custom domain (optional)

---

## Monitoring & Logs

### Render
- View logs: Service → **"Logs"** tab
- Metrics: Service → **"Metrics"** tab

### Vercel
- Logs: Project → **"Deployments"** → click deployment → **"Functions"**
- Analytics: Enable in project settings

### Railway
- Logs: Service → **"Logs"** tab
- Metrics: Service → **"Metrics"** tab

---

## Troubleshooting

### Backend won't start
- Check `PGHOST` and database connection
- Verify `GEMINI_API_KEY` is set
- Check build logs for TypeScript errors

### Frontend shows API errors
- Verify `VITE_API_URL` points to deployed backend
- Check CORS_ORIGIN in backend matches frontend URL
- Open browser console for detailed errors

### Database connection issues
- Ensure `PGSSLMODE=require` for cloud databases
- Check firewall/IP allowlists
- Verify credentials are correct

### Rate limiting too aggressive
- Adjust limits in `backend/src/middleware/rateLimiter.ts`
- Consider Redis-backed rate limiting for production

---

## Cost Estimates

### Free Tier (Development)
- **Render**: Free backend + database (90 days) + frontend
- **Vercel**: Free frontend (100GB bandwidth)
- **Railway**: $5 credit/month

### Production (Estimated Monthly)
- **Render**: $7 (web) + $7 (PostgreSQL) = **$14/month**
- **Railway**: ~$10-15/month with database
- **Vercel Pro**: $20/month (if needed)

---

## Next Steps

1. Choose your deployment platform
2. Follow the relevant section above
3. Set up continuous deployment (auto-deploy on push)
4. Configure monitoring and alerts
5. Set up backups for PostgreSQL
6. Consider CDN for assets (Cloudflare)

For questions, check the main README or open an issue.
