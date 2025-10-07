# 🚀 Quick Deployment Guide for Intern Compass

## Choose Your Platform

### 1. Render (Easiest - All-in-One) ⭐ RECOMMENDED

**One Blueprint deploys everything!**

#### Step-by-Step:
1. **Push to GitHub**
   ```powershell
   git add .
   git commit -m "Add deployment configs"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to: https://dashboard.render.com
   - Click **"New"** → **"Blueprint"**
   - Connect GitHub → Select `Intern-Compass` repo
   - Render detects `render.yaml` automatically

3. **Set Environment Variables** (Render will prompt):
   
   **Backend:**
   ```
   GEMINI_API_KEY=<your-gemini-key>
   ```
   
   **Frontend:**
   ```
   VITE_AUTH0_DOMAIN=<domain>.auth0.com
   VITE_AUTH0_CLIENT_ID=<client-id>
   ```
   
   *Database and URL connections are auto-configured!*

4. **Create Database** (if not using external):
   - Click **"New"** → **"PostgreSQL"**
   - Free tier: 90 days
   - Copy credentials to backend env vars

5. **Run Database Migrations**:
   - Go to backend service → **"Shell"** tab
   - Run: `cd backend && node run-migrations.js`

6. **Update Auth0**:
   - Add callback URL: `https://your-app.onrender.com/auth/callback`

✅ **Done! Your app is live!**

---

### 2. Vercel (Frontend) + Render (Backend)

**Best for production-grade frontend with CDN**

#### Backend on Render:
Follow Render steps above for backend only.

#### Frontend on Vercel:
```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Follow prompts:
# - Build Command: npm run build
# - Output Directory: dist
```

**Set Vercel Environment Variables:**
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_AUTH0_DOMAIN=<domain>.auth0.com
VITE_AUTH0_CLIENT_ID=<client-id>
VITE_AUTH0_CALLBACK_URL=https://your-app.vercel.app/auth/callback
```

**Update Backend CORS:**
In Render backend, add env var:
```
CORS_ORIGIN=https://your-app.vercel.app
```

---

### 3. Railway (Backend + DB) + Netlify (Frontend)

**Best database persistence**

#### Backend on Railway:
1. Go to: https://railway.app
2. **"New Project"** → **"Deploy from GitHub"**
3. Add PostgreSQL: **"New"** → **"Database"** → **"PostgreSQL"**
4. Configure backend:
   ```
   Root Directory: backend
   Build Command: npm install && npm run build
   Start Command: npm start
   ```
5. Add env vars:
   ```
   GEMINI_API_KEY=<key>
   CORS_ORIGIN=https://your-app.netlify.app
   ```

#### Frontend on Netlify:
1. Go to: https://netlify.com
2. **"Add new site"** → **"Import from Git"**
3. Configure:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```
4. Add env vars in Netlify dashboard

---

## 🔑 Required Environment Variables

### Backend
```bash
PGHOST=<database-host>
PGDATABASE=intern_compass
PGUSER=<db-user>
PGPASSWORD=<db-password>
PGSSLMODE=require
GEMINI_API_KEY=<your-gemini-api-key>
GEN_MODEL=gemini-1.5-flash
CORS_ORIGIN=<frontend-url>
PORT=3001
NODE_ENV=production
```

### Frontend
```bash
VITE_API_URL=<backend-url>/api
VITE_AUTH0_DOMAIN=<your-domain>.auth0.com
VITE_AUTH0_CLIENT_ID=<your-client-id>
VITE_AUTH0_CALLBACK_URL=<frontend-url>/auth/callback
```

---

## 📋 Pre-Deployment Checklist

- [ ] GitHub repository is up to date
- [ ] `.env` has all required variables (for local testing)
- [ ] Gemini API key is valid and has quota
- [ ] Auth0 application is created and configured
- [ ] PostgreSQL database is ready (or will be created)
- [ ] Reviewed `DEPLOYMENT.md` for detailed instructions

---

## 🧪 Testing After Deployment

1. **Backend Health Check**:
   ```
   GET https://your-backend-url/api/health
   Expected: {"status":"healthy",...}
   ```

2. **Frontend Loads**:
   - Visit your frontend URL
   - Should see login page

3. **Auth0 Login**:
   - Click login
   - Should redirect to Auth0
   - Should redirect back after login

4. **Upload Document**:
   - Go to `/admin`
   - Upload a PDF
   - Should process successfully

5. **Chat Query**:
   - Go to `/chat`
   - Ask a question about uploaded document
   - Should get AI response with citations

---

## 🆘 Troubleshooting

### Backend won't start:
```powershell
# Check logs in platform dashboard
# Common issues:
# - Missing GEMINI_API_KEY
# - Database connection failed (check PGHOST, PGPASSWORD)
# - TypeScript build errors (check build logs)
```

### Frontend shows API errors:
```powershell
# Open browser console (F12)
# Common issues:
# - VITE_API_URL not set or wrong
# - CORS error (update backend CORS_ORIGIN)
# - Auth0 config wrong
```

### Database won't connect:
```powershell
# Check these:
# - PGSSLMODE=require (for cloud databases)
# - Correct credentials
# - Database is running
# - Migrations completed
```

### Rate limiting too strict:
```typescript
// Edit: backend/src/middleware/rateLimiter.ts
// Increase windowMs or max requests
```

---

## 💰 Cost Summary

### Free Tier (Perfect for testing):
- **Render**: Free backend + frontend (sleeps after 15min)
- **Railway**: $5 credit/month
- **Vercel**: Free frontend (100GB bandwidth)
- **Netlify**: Free frontend (100GB bandwidth)

### Production (~$15-25/month):
- Render: $7 web + $7 PostgreSQL = $14
- Railway: ~$10-15 with database
- Vercel Pro: $20 (if needed for more bandwidth)

---

## 📚 Next Steps

1. Deploy using method above
2. Set up custom domain (optional)
3. Configure monitoring (Sentry, LogRocket)
4. Set up database backups
5. Enable auto-deploy on push to GitHub
6. Review security settings

For detailed instructions, see **`DEPLOYMENT.md`**

---

## 🎉 You're Ready!

Choose a platform above and follow the steps. Most deployments take 5-10 minutes.

**Recommended for first deployment**: Start with **Render Blueprint** (Option 1) - it's the easiest!
