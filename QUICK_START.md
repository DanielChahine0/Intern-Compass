# Quick Start Guide - InternCompass Full-Stack

## 🚀 Quick Setup (5 Minutes)

### 1. Backend Setup
```powershell
cd Inter-Compass-Service
npm install
npm run init-db
npm run dev
```
✅ Backend running at: http://localhost:3000

### 2. Frontend Setup
```powershell
cd HTV-X
npm install
npm run dev
```
✅ Frontend running at: http://localhost:5173

---

## 📡 API Quick Reference

### Base URL
```
http://localhost:3000/api
```

### Users
- `POST /api/users` - Create/update user
- `GET /api/users/auth0/:auth0_id` - Get user

### Documents
- `POST /api/documents` - Upload document
- `GET /api/documents` - List all documents
- `DELETE /api/documents/:id` - Delete document

### Chat
- `POST /api/chat` - Send message
- `GET /api/chat/user/:userId` - Get chat history

---

## 🧪 Test Commands

```powershell
# Test backend health
curl http://localhost:3000/health

# Test API root
curl http://localhost:3000

# Get all documents
curl http://localhost:3000/api/documents

# Get all users
curl http://localhost:3000/api/users
```

---

## 📁 Project Structure

```
Inter-Compass-Service/
├── src/
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── db/              # Database schema
│   ├── database.ts      # DB connection
│   └── index.ts         # Server entry

HTV-X/
├── src/
│   ├── pages/           # React pages
│   ├── components/      # UI components
│   ├── lib/
│   │   └── api.ts       # API client
│   └── App.tsx
```

---

## ⚡ Common Commands

### Backend
```powershell
npm run dev      # Start development server
npm run build    # Build TypeScript
npm start        # Start production server
npm run init-db  # Initialize database
```

### Frontend
```powershell
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🐛 Common Issues

### Backend won't start
- Check if port 3000 is available
- Verify database credentials
- Run `npm run init-db`

### Frontend can't connect
- Ensure backend is running
- Check `.env` has `VITE_API_URL=http://localhost:3000/api`
- Restart frontend after changing `.env`

### Database errors
- Run `npm run init-db` in backend
- Verify internet connection (Neon DB is cloud-based)

---

## 🔗 Important URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health
- **Admin Panel:** http://localhost:5173/admin
- **Chat:** http://localhost:5173/chat

---

## 📝 Quick Test Workflow

1. ✅ Start backend (`npm run dev` in Inter-Compass-Service)
2. ✅ Start frontend (`npm run dev` in HTV-X)
3. ✅ Open http://localhost:5173
4. ✅ Go to Admin panel and upload a document
5. ✅ Go to Chat and send a message
6. ✅ Check database: `curl http://localhost:3000/api/documents`

---

## 💡 Pro Tips

- Use VS Code's split terminal to run both servers
- Install REST Client extension to test APIs in VS Code
- Use React DevTools for debugging frontend
- Check browser console for API errors
- Backend auto-restarts on file changes (nodemon)
- Frontend has hot module reload (Vite HMR)

---

For detailed instructions, see [FULLSTACK_SETUP.md](./FULLSTACK_SETUP.md)
