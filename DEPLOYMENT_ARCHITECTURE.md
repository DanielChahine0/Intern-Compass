# Deployment Architecture Diagrams

## Option 1: Render (All-in-One) ⭐ Recommended

```
┌─────────────────────────────────────────────────────────────────┐
│                         RENDER PLATFORM                          │
│                                                                   │
│  ┌─────────────────┐      ┌─────────────────┐                   │
│  │                 │      │                 │                   │
│  │   PostgreSQL    │◄─────┤  Backend API    │                   │
│  │   Database      │      │  (Express)      │                   │
│  │                 │      │  Port: 3001     │                   │
│  │  - Documents    │      │                 │                   │
│  │  - Chunks       │      │  Features:      │                   │
│  │  - Embeddings   │      │  - RAG Service  │                   │
│  │  - Users        │      │  - PDF Upload   │                   │
│  │                 │      │  - Chat API     │                   │
│  └─────────────────┘      │  - Gemini AI    │                   │
│                           └────────┬────────┘                    │
│                                    │                             │
│                                    │ JSON API                    │
│                                    │ /api/*                      │
│                           ┌────────▼────────┐                    │
│                           │                 │                    │
│                           │  Frontend SPA   │                    │
│                           │  (React)        │                    │
│                           │                 │                    │
│                           │  Routes:        │                    │
│                           │  - /            │                    │
│                           │  - /chat        │                    │
│                           │  - /admin       │                    │
│                           │                 │                    │
│                           └─────────────────┘                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    │
                           ┌────────▼────────┐
                           │                 │
                           │   Users/Admins  │
                           │   (Browser)     │
                           │                 │
                           └─────────────────┘
```

**Advantages:**
- ✅ Single platform for everything
- ✅ Auto-connected services
- ✅ Free tier available
- ✅ Easy environment management

---

## Option 2: Vercel + Render (Production Setup)

```
┌──────────────────────────────────────────────────────────────────┐
│                      VERCEL (Frontend)                           │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │              React SPA + Static Assets                     │ │
│  │                                                            │ │
│  │  - Served from Global CDN                                 │ │
│  │  - Edge caching                                           │ │
│  │  - Instant deployments                                    │ │
│  │  - Preview URLs for PRs                                   │ │
│  │                                                            │ │
│  └─────────────────────────┬──────────────────────────────────┘ │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             │ HTTPS API Calls
                             │ (CORS configured)
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                      RENDER (Backend + Database)                 │
│                                                                   │
│  ┌─────────────────┐      ┌─────────────────┐                   │
│  │                 │      │                 │                   │
│  │   PostgreSQL    │◄─────┤  Express API    │                   │
│  │   Database      │      │  + Gemini AI    │                   │
│  │                 │      │                 │                   │
│  └─────────────────┘      └─────────────────┘                   │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                  External Services                             │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │              │    │              │    │              │    │
│  │  Google      │    │   Auth0      │    │   Users      │    │
│  │  Gemini AI   │    │   (OAuth)    │    │  (Browsers)  │    │
│  │              │    │              │    │              │    │
│  └──────────────┘    └──────────────┘    └──────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Advantages:**
- ✅ Best frontend performance (Vercel CDN)
- ✅ Separate scaling for frontend/backend
- ✅ Production-grade infrastructure
- ✅ Great for high-traffic apps

---

## Option 3: Railway + Netlify

```
┌──────────────────────────────────────────────────────────────────┐
│                      NETLIFY (Frontend)                          │
│                                                                   │
│  - Continuous deployment from GitHub                            │
│  - Form handling                                                │
│  - Split testing                                                │
│  - Deploy previews                                              │
│                                                                   │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             │ API Requests
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                      RAILWAY (Backend + DB)                       │
│                                                                   │
│  ┌─────────────────┐      ┌─────────────────┐                   │
│  │                 │      │                 │                   │
│  │   PostgreSQL    │◄─────┤  Express API    │                   │
│  │   (Better       │      │  (Dockerized)   │                   │
│  │   persistence)  │      │                 │                   │
│  │                 │      │                 │                   │
│  └─────────────────┘      └─────────────────┘                   │
│                                                                   │
│  Auto-connected DATABASE_URL                                    │
│  $5/month credit                                                │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

**Advantages:**
- ✅ Better database persistence than Render free tier
- ✅ Netlify's generous free tier
- ✅ $5 Railway credit per month
- ✅ Good for long-term projects

---

## Data Flow: User Query to AI Response

```
┌──────────┐
│  User    │
│ (Browser)│
└────┬─────┘
     │ 1. User types question
     │    "What's the vacation policy?"
     │
     ▼
┌────────────────┐
│   Frontend     │
│   (React)      │
└────┬───────────┘
     │ 2. POST /api/chat/query
     │    { query: "...", userId: "..." }
     │
     ▼
┌────────────────────────┐
│   Backend API          │
│   (Express)            │
│                        │
│   Rate Limiter  ─────► Check: 8 req/min
│                        │
│   Request Queue ─────► Queue Gemini calls
│                        │
└────┬───────────────────┘
     │ 3. Embed query
     │    using Gemini
     │
     ▼
┌─────────────────────────┐
│   Gemini API            │
│   (text-embedding-004)  │
└────┬────────────────────┘
     │ 4. Returns embedding vector
     │    [0.12, -0.45, 0.78, ...]
     │
     ▼
┌─────────────────────────┐
│   PostgreSQL            │
│   (Cosine Similarity)   │
│                         │
│   - Calculate similarity│
│   - Retrieve top-K      │
│   - chunks (K=5)        │
└────┬────────────────────┘
     │ 5. Returns relevant chunks
     │    ["Policy text...", ...]
     │
     ▼
┌────────────────────────┐
│   Backend              │
│   (RAG Service)        │
│                        │
│   - Build context      │
│   - Create prompt      │
└────┬───────────────────┘
     │ 6. Generate response
     │    Context + Query
     │
     ▼
┌─────────────────────────┐
│   Gemini API            │
│   (gemini-1.5-flash)    │
└────┬────────────────────┘
     │ 7. AI-generated response
     │    with citations
     │
     ▼
┌────────────────────────┐
│   Frontend             │
│   (Chat UI)            │
│                        │
│   - Display response   │
│   - Show citations     │
│   - Link to sources    │
└────┬───────────────────┘
     │
     ▼
┌──────────┐
│  User    │
│  sees    │
│  answer  │
└──────────┘
```

---

## File Structure for Deployment

```
Intern-Compass/
│
├── render.yaml                    # Render Blueprint config
├── vercel.json                    # Vercel frontend config
├── netlify.toml                   # Netlify frontend config
├── .dockerignore                  # Docker ignore patterns
├── .env.template                  # Environment variables template
│
├── .github/
│   └── workflows/
│       └── deploy.yml             # CI/CD pipeline
│
├── backend/
│   ├── Dockerfile                 # Backend containerization
│   ├── src/
│   │   └── index.ts              # Enhanced CORS config
│   └── scripts/
│       └── pre-deploy-check.js   # Pre-deployment validation
│
└── frontend/
    ├── public/
    │   └── _redirects            # Netlify SPA routing
    └── package.json              # Added 'serve' dependency

```

---

## Deployment Checklist

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for a complete step-by-step checklist.

---

## Cost Comparison

### Free Tier (Development/Testing)

| Platform | Frontend | Backend | Database | Bandwidth | Limitations |
|----------|----------|---------|----------|-----------|-------------|
| **Render** | Free | Free | Free 90d | 100GB | Sleeps 15min idle |
| **Vercel + Render** | Free | Free | Free 90d | 100GB | Backend sleeps |
| **Railway** | - | $5 credit | Included | - | Credit-based |

### Paid Tier (Production)

| Platform | Monthly Cost | Features |
|----------|-------------|----------|
| **Render** | $14 | No sleep, 512MB RAM, 10GB DB |
| **Vercel Pro + Render** | $34 | Vercel Pro $20 + Render $14 |
| **Railway** | $10-15 | Based on usage, no sleep |

---

## Environment Variables Flow

```
.env.template
     │
     ├──► Copy to .env (local development)
     │
     ├──► Platform Dashboard (production)
     │    │
     │    ├──► Render: Service → Environment
     │    ├──► Vercel: Project → Settings → Environment Variables
     │    ├──► Railway: Service → Variables
     │    └──► Netlify: Site → Environment Variables
     │
     └──► GitHub Secrets (CI/CD)
          Repository → Settings → Secrets
```

---

For deployment instructions, see:
- [QUICKSTART_DEPLOY.md](./QUICKSTART_DEPLOY.md) - Quick 5-minute guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Comprehensive instructions
- [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) - What's been configured
