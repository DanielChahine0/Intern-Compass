# 📋 Complete Deployment Checklist

Use this checklist to ensure a smooth deployment of Intern Compass.

---

## 🔧 Pre-Deployment Preparation

### Step 1: Code Preparation
- [ ] All code committed to git
- [ ] `.gitignore` includes `.env`, `node_modules`, `dist`
- [ ] No sensitive data in repository
- [ ] All TypeScript files compile without errors
- [ ] Frontend builds successfully locally

### Step 2: Environment Setup
- [ ] Created `.env` from `.env.template`
- [ ] All required environment variables documented
- [ ] Tested app locally with environment variables
- [ ] Verified database connection locally

### Step 3: External Services Setup
- [ ] **Gemini API Key** obtained from Google AI Studio
  - [ ] Free tier or paid plan selected
  - [ ] API key tested and working
  - [ ] Rate limits understood (10 RPM free, 360 RPM paid)

- [ ] **Auth0 Application** created
  - [ ] Application type: Single Page Application
  - [ ] Callback URLs configured for localhost
  - [ ] Domain and Client ID saved
  - [ ] Test login flow working locally

- [ ] **PostgreSQL Database** ready
  - [ ] Will use platform database OR
  - [ ] External database configured (Neon, Supabase, etc.)
  - [ ] Connection tested with SSL

### Step 4: Run Pre-Deployment Check
```powershell
cd backend
npm run predeploy
```
- [ ] All checks passed (no ❌ errors)
- [ ] Warnings reviewed and acceptable
- [ ] Build successful

---

## 🚀 Platform Selection

Choose ONE deployment strategy:

### Option A: Render (All-in-One) ⭐ RECOMMENDED FOR BEGINNERS
- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] Go to [Platform Setup - Render](#platform-setup---render)

### Option B: Vercel (Frontend) + Render (Backend)
- [ ] Vercel account created
- [ ] Render account created
- [ ] Go to [Platform Setup - Vercel + Render](#platform-setup---vercel--render)

### Option C: Railway (Backend) + Netlify (Frontend)
- [ ] Railway account created
- [ ] Netlify account created
- [ ] Go to [Platform Setup - Railway + Netlify](#platform-setup---railway--netlify)

---

## 📦 Platform Setup - Render

### Backend + Database Setup
1. [ ] Login to Render Dashboard
2. [ ] Click **"New"** → **"Blueprint"**
3. [ ] Connect GitHub account
4. [ ] Select `Intern-Compass` repository
5. [ ] Render detects `render.yaml`
6. [ ] Review detected services:
   - [ ] `intern-compass-backend` (web service)
   - [ ] `intern-compass-frontend` (web service)
   - [ ] `intern-compass-db` (PostgreSQL)

### Environment Variables - Backend
7. [ ] Set environment variables when prompted:
   ```
   GEMINI_API_KEY=<your-key>
   PGHOST=<auto-filled by Render if using their DB>
   PGDATABASE=<auto-filled>
   PGUSER=<auto-filled>
   PGPASSWORD=<auto-filled>
   ```

### Environment Variables - Frontend
8. [ ] Set frontend environment variables:
   ```
   VITE_AUTH0_DOMAIN=<your-domain>.auth0.com
   VITE_AUTH0_CLIENT_ID=<your-client-id>
   VITE_API_URL=<auto-filled from backend service>
   VITE_AUTH0_CALLBACK_URL=<auto-filled from frontend URL>
   ```

### Deploy
9. [ ] Click **"Apply"** to deploy
10. [ ] Wait for build (5-10 minutes)
11. [ ] Check build logs for errors
12. [ ] Note your service URLs:
    - Backend: `https://intern-compass-backend-xxxx.onrender.com`
    - Frontend: `https://intern-compass-frontend-xxxx.onrender.com`

### Database Setup
13. [ ] Go to backend service → **"Shell"**
14. [ ] Run migrations:
    ```bash
    cd backend
    node run-migrations.js
    ```
15. [ ] Verify tables created:
    ```bash
    node check-schema.js
    ```

---

## 📦 Platform Setup - Vercel + Render

### Backend on Render
1. [ ] Login to Render
2. [ ] Click **"New"** → **"Web Service"**
3. [ ] Connect GitHub → Select repo
4. [ ] Configure:
   - **Name**: `intern-compass-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. [ ] Add PostgreSQL database (New → PostgreSQL)
6. [ ] Set environment variables:
   ```
   GEMINI_API_KEY=<your-key>
   CORS_ORIGIN=<will-add-after-frontend-deploy>
   ```
7. [ ] Deploy and note backend URL

### Frontend on Vercel
8. [ ] Install Vercel CLI: `npm i -g vercel`
9. [ ] From frontend directory:
   ```powershell
   cd frontend
   vercel
   ```
10. [ ] Follow prompts:
    - **Project name**: `intern-compass`
    - **Directory**: `./` (current)
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
11. [ ] Add environment variables in Vercel dashboard:
    ```
    VITE_API_URL=<backend-url>/api
    VITE_AUTH0_DOMAIN=<domain>.auth0.com
    VITE_AUTH0_CLIENT_ID=<client-id>
    VITE_AUTH0_CALLBACK_URL=<vercel-url>/auth/callback
    ```
12. [ ] Redeploy: `vercel --prod`

### Update Backend CORS
13. [ ] Go to Render backend → Environment
14. [ ] Update `CORS_ORIGIN` with Vercel URL
15. [ ] Trigger redeploy

---

## 📦 Platform Setup - Railway + Netlify

### Backend on Railway
1. [ ] Login to Railway
2. [ ] **"New Project"** → **"Deploy from GitHub repo"**
3. [ ] Select repository
4. [ ] Add PostgreSQL: **"New"** → **"Database"** → **"PostgreSQL"**
5. [ ] Configure backend service:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. [ ] Add environment variables:
   ```
   GEMINI_API_KEY=<your-key>
   CORS_ORIGIN=<will-add-after-frontend>
   ```
7. [ ] Deploy and note backend URL

### Frontend on Netlify
8. [ ] Login to Netlify
9. [ ] **"Add new site"** → **"Import from Git"**
10. [ ] Select repository
11. [ ] Configure:
    - **Base directory**: `frontend`
    - **Build command**: `npm run build`
    - **Publish directory**: `frontend/dist`
12. [ ] Set environment variables:
    ```
    VITE_API_URL=<railway-backend-url>/api
    VITE_AUTH0_DOMAIN=<domain>.auth0.com
    VITE_AUTH0_CLIENT_ID=<client-id>
    VITE_AUTH0_CALLBACK_URL=<netlify-url>/auth/callback
    ```
13. [ ] Deploy

### Update Backend CORS
14. [ ] Go to Railway backend → Variables
15. [ ] Update `CORS_ORIGIN` with Netlify URL
16. [ ] Service auto-redeploys

---

## 🔐 Post-Deployment: Auth0 Configuration

1. [ ] Login to Auth0 Dashboard
2. [ ] Go to Applications → Your App
3. [ ] Update URLs with production values:
   
   **Allowed Callback URLs**:
   ```
   https://your-frontend-url.com/auth/callback
   ```
   
   **Allowed Logout URLs**:
   ```
   https://your-frontend-url.com
   ```
   
   **Allowed Web Origins**:
   ```
   https://your-frontend-url.com
   ```
   
4. [ ] Save changes
5. [ ] Test login flow on production

---

## ✅ Verification & Testing

### Backend Health Check
1. [ ] Visit: `https://your-backend-url.com/api/health`
2. [ ] Should return: `{"status":"healthy",...}`
3. [ ] Check response time (< 2 seconds)

### Frontend Access
4. [ ] Visit your frontend URL
5. [ ] Page loads without errors
6. [ ] No console errors (F12)
7. [ ] Assets load (images, fonts)

### Authentication Flow
8. [ ] Click **"Login"** button
9. [ ] Redirects to Auth0 login page
10. [ ] Login with test account
11. [ ] Redirects back to app
12. [ ] User is authenticated
13. [ ] Can access protected routes

### Admin Functionality
14. [ ] Go to `/admin` route
15. [ ] Upload a test PDF document
16. [ ] Document processes successfully
17. [ ] Check backend logs for errors
18. [ ] Verify document appears in list

### Chat Functionality
19. [ ] Go to `/chat` route
20. [ ] Type a test question
21. [ ] AI responds within 10 seconds
22. [ ] Response includes citations
23. [ ] Citations link to source documents
24. [ ] No rate limit errors

### Database Verification
25. [ ] Connect to database via platform shell
26. [ ] Run: `SELECT COUNT(*) FROM documents;`
27. [ ] Should show uploaded document count
28. [ ] Run: `SELECT COUNT(*) FROM document_chunks;`
29. [ ] Should show chunk count

---

## 🔄 Continuous Deployment Setup

### GitHub Actions (Optional but Recommended)
1. [ ] Verify `.github/workflows/deploy.yml` exists
2. [ ] Go to GitHub repo → **Settings** → **Secrets**
3. [ ] Add secrets (if needed for actions):
   - `VITE_API_URL`
   - `VITE_AUTH0_DOMAIN`
   - `VITE_AUTH0_CLIENT_ID`
   - `VITE_AUTH0_CALLBACK_URL`
4. [ ] Push to main branch
5. [ ] Check Actions tab for build status

### Auto-Deploy from Git
- [ ] **Render**: Auto-enabled when using Blueprint
- [ ] **Vercel**: Auto-enabled via GitHub integration
- [ ] **Railway**: Auto-enabled via GitHub integration
- [ ] **Netlify**: Auto-enabled via GitHub integration

---

## 📊 Monitoring Setup (Optional)

### Platform Monitoring
- [ ] **Render**: Enable email alerts for service failures
- [ ] **Vercel**: Review deployment logs regularly
- [ ] **Railway**: Set up usage alerts
- [ ] **Netlify**: Enable build notifications

### Error Tracking (Recommended)
- [ ] Sign up for [Sentry](https://sentry.io) (optional)
- [ ] Install Sentry SDK in frontend and backend
- [ ] Configure DSN in environment variables
- [ ] Test error reporting

### Uptime Monitoring (Recommended)
- [ ] Sign up for [UptimeRobot](https://uptimerobot.com) (free)
- [ ] Add monitor for frontend URL
- [ ] Add monitor for backend `/api/health`
- [ ] Set alert email

---

## 🔒 Security Checklist

- [ ] All `.env` files in `.gitignore`
- [ ] No API keys in code
- [ ] HTTPS enabled (automatic on all platforms)
- [ ] CORS properly configured
- [ ] Auth0 production tenant used (not dev)
- [ ] Database uses SSL (`PGSSLMODE=require`)
- [ ] Rate limiting enabled (default: 8 req/min)
- [ ] Admin routes protected by authentication

---

## 💰 Cost Tracking

### Free Tier Limits Understood
- [ ] **Render**: 750 hours/month, sleeps after 15min
- [ ] **Vercel**: 100GB bandwidth/month
- [ ] **Railway**: $5 credit/month
- [ ] **Netlify**: 100GB bandwidth/month

### Monitoring Costs
- [ ] Set up billing alerts on platforms
- [ ] Understand upgrade paths
- [ ] Database backup strategy decided

---

## 📝 Documentation

- [ ] Update main `README.md` with production URLs
- [ ] Document any custom configurations
- [ ] Create runbook for common issues
- [ ] Document admin user creation process
- [ ] Share credentials securely with team

---

## 🎉 Launch!

### Final Checks
- [ ] All above items completed
- [ ] Team members can access app
- [ ] Admin panel accessible
- [ ] Chat works end-to-end
- [ ] No errors in logs

### Communication
- [ ] Announce launch to stakeholders
- [ ] Share app URL and credentials
- [ ] Provide user guide/demo
- [ ] Set up feedback collection

### Next Steps
- [ ] Monitor for first 24 hours
- [ ] Collect user feedback
- [ ] Plan feature roadmap
- [ ] Schedule regular backups

---

## 🆘 Troubleshooting Reference

If something goes wrong, see:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed troubleshooting section
- [QUICKSTART_DEPLOY.md](./QUICKSTART_DEPLOY.md) - Common issues
- Backend logs on platform dashboard
- Browser console (F12) for frontend errors

---

## ✅ Completion

Date deployed: _______________

Deployed by: _______________

Platform(s) used: _______________

Production URLs:
- Frontend: _______________
- Backend: _______________
- Database: _______________

Notes:
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________

**Congratulations! Your Intern Compass is now live! 🚀**
