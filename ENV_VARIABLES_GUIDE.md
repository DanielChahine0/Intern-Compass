# 🔐 Environment Variables Guide

## Quick Answer: What Should I Commit to Git?

| File | Commit to Git? | Contains Real Secrets? | Purpose |
|------|----------------|------------------------|---------|
| **`.env.template`** | ✅ **YES** | ❌ NO | Template with placeholders |
| **`.env.example`** | ✅ **YES** | ❌ NO | Example with format hints |
| **`.env`** | ❌ **NEVER** | ✅ YES | Your actual secrets |
| **`.env.local`** | ❌ **NEVER** | ✅ YES | Local overrides |
| **`.env.production`** | ❌ **NEVER** | ✅ YES | Production secrets |

---

## 📁 Files in Your Project

### 1. `.env.template` (✅ Already created - Safe to commit)

**Purpose**: Shows everyone what variables are needed  
**Contains**: Placeholder values only  
**Example**:
```bash
GEMINI_API_KEY=your-gemini-api-key-here
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
```

**Status**: ✅ **Already set up correctly!** This file is safe to commit.

---

### 2. `.env.example` (✅ Just created - Safe to commit)

**Purpose**: Same as `.env.template` but with more helpful examples  
**Contains**: Placeholder values with hints  
**Status**: ✅ Created for you with local development defaults

---

### 3. `.env` (❌ Create this - NEVER commit)

**Purpose**: Your actual secrets for local development  
**Contains**: Real API keys, passwords, etc.  
**Status**: ⚠️ **You need to create this manually**

**How to create**:
```powershell
# Copy the example
Copy-Item .env.example .env

# OR copy the template
Copy-Item .env.template .env

# Then edit .env with your real values
code .env
```

---

## 🔒 Security Verification

### Check your `.gitignore` includes:
```ignore
.env
.env.local
.env.development
.env.test
.env.production
.env*.local
```

✅ **Already configured correctly in your project!**

---

## 🎯 Step-by-Step: Setting Up Your Local Environment

### Step 1: Copy the template
```powershell
Copy-Item .env.template .env
```

### Step 2: Get your API keys

#### **Gemini API Key**
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Paste in `.env`: `GEMINI_API_KEY=AIzaSy...`

#### **Auth0 Credentials**
1. Go to https://manage.auth0.com
2. Create or select an application
3. Copy "Domain" → `VITE_AUTH0_DOMAIN=dev-xxx.auth0.com`
4. Copy "Client ID" → `VITE_AUTH0_CLIENT_ID=abc123...`
5. Add callback URL: `http://localhost:8080/auth/callback`

#### **PostgreSQL Database**
1. Use your existing database or create one:
   - **Render**: https://dashboard.render.com
   - **Neon**: https://neon.tech
   - **Supabase**: https://supabase.com
2. Copy connection details:
   - `PGHOST=your-host.com`
   - `PGDATABASE=intern_compass`
   - `PGUSER=your-username`
   - `PGPASSWORD=your-password`

### Step 3: Update your `.env` file

Open `.env` and replace all placeholders with real values.

### Step 4: Test your setup
```powershell
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev
```

---

## 🚨 Common Mistakes to Avoid

### ❌ **DON'T DO THIS:**
```bash
# Bad - committing real secrets
git add .env
git commit -m "Add environment variables"
```

### ✅ **DO THIS:**
```bash
# Good - only commit the template
git add .env.template .env.example
git commit -m "Add environment variable templates"
```

---

## 🔍 How to Check if You're Safe

### Run this to see what will be committed:
```powershell
git status
```

**Should see**:
- ✅ `.env.template` or `.env.example` (safe)

**Should NOT see**:
- ❌ `.env` (contains secrets)

### If you accidentally see `.env`:
```powershell
# Remove from staging
git reset .env

# Make sure .gitignore has .env
# (Already configured in your project!)
```

---

## 🌐 For Production/Deployment

**NEVER** commit production secrets to git!

Instead, set environment variables in your platform's dashboard:

### **Render**
Dashboard → Service → Environment → Add Environment Variable

### **Vercel**
Dashboard → Project → Settings → Environment Variables

### **Railway**
Dashboard → Service → Variables

### **Netlify**
Dashboard → Site → Environment Variables

---

## 📋 Your Environment Variables Checklist

### Local Development (in `.env` file):
- [ ] `GEMINI_API_KEY` - From Google AI Studio
- [ ] `PGHOST` - Your database host
- [ ] `PGDATABASE` - Database name (intern_compass)
- [ ] `PGUSER` - Database username
- [ ] `PGPASSWORD` - Database password
- [ ] `VITE_AUTH0_DOMAIN` - From Auth0 dashboard
- [ ] `VITE_AUTH0_CLIENT_ID` - From Auth0 dashboard
- [ ] `CORS_ORIGIN` - http://localhost:8080 (for local)

### Optional but recommended:
- [ ] `GEN_MODEL` - gemini-1.5-flash (default)
- [ ] `PORT` - 3001 (default)
- [ ] `NODE_ENV` - development
- [ ] `PGSSLMODE` - require (for production)

---

## 💡 Best Practices Summary

1. ✅ **`.env.template`** - Commit with placeholders
2. ✅ **`.env.example`** - Commit with example formats
3. ❌ **`.env`** - NEVER commit (already in .gitignore)
4. ✅ Use platform dashboards for production secrets
5. ✅ Different Auth0 apps for dev/staging/prod
6. ✅ Rotate API keys regularly
7. ✅ Enable 2FA on all platforms

---

## 🎓 Why This Approach?

### **Committing `.env.template`**:
- ✓ Team knows what variables are needed
- ✓ Easy onboarding for new developers
- ✓ Documentation stays in sync with code
- ✓ No secrets exposed

### **Never committing `.env`**:
- ✓ Secrets stay private
- ✓ Different values per environment
- ✓ No accidental exposure
- ✓ Security best practice

---

## 🆘 What If I Already Committed `.env`?

If you accidentally committed your `.env` file with secrets:

### **1. Remove from git immediately:**
```powershell
# Remove from git but keep local file
git rm --cached .env

# Commit the removal
git commit -m "Remove .env from git"

# Push to remote
git push
```

### **2. Rotate ALL exposed secrets:**
- 🔄 Generate new Gemini API key
- 🔄 Change database password
- 🔄 Rotate Auth0 application secrets

### **3. Verify .gitignore:**
```powershell
# Make sure .env is listed
cat .gitignore | Select-String ".env"
```

---

## ✅ Your Current Status

Based on your project:

- ✅ `.env.template` created with safe placeholders
- ✅ `.env.example` created with local dev defaults
- ✅ `.gitignore` properly configured to ignore `.env`
- ⚠️ You need to create `.env` with your real secrets (don't commit it!)

---

## 🚀 Next Steps

1. **Create your `.env` file**:
   ```powershell
   Copy-Item .env.example .env
   ```

2. **Fill in your real values** (see checklist above)

3. **Test locally**:
   ```powershell
   cd backend; npm run dev
   cd frontend; npm run dev
   ```

4. **Commit only safe files**:
   ```powershell
   git add .env.template .env.example
   git commit -m "Add environment variable templates"
   ```

5. **For production**: Set variables in platform dashboards (not in git!)

---

**You're all set!** Your `.env.template` is safe to commit, and your `.gitignore` will protect your real secrets. 🎉
