# 📁 Complete Folder Structure Guide

## 🎯 AFTER Installation - Your Complete Project Structure

```
axigon-website/                          # Your project root
│
├── 📱 FRONTEND (Your existing React app)
│   │
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── App.js                       # Your existing React component
│   │   ├── index.js
│   │   ├── index.css
│   │   │
│   │   └── services/                    # ← CREATE THIS
│   │       └── api.js                   # API integration layer
│   │
│   └── package.json (if separate)
│
├── 🔧 BACKEND (From this download)
│   │
│   ├── api/                             # ← Serverless Functions
│   │   │
│   │   ├── auth/
│   │   │   ├── signup.js               # POST /api/auth/signup
│   │   │   └── login.js                # POST /api/auth/login
│   │   │
│   │   ├── users/
│   │   │   └── profile.js              # GET/PUT /api/users/profile
│   │   │
│   │   └── agents/
│   │       ├── index.js                # GET/POST /api/agents
│   │       └── [id].js                 # GET/PUT/DELETE /api/agents/:id
│   │
│   ├── lib/                             # ← Utilities
│   │   ├── db.js                       # MongoDB connection
│   │   └── auth.js                     # JWT utilities
│   │
│   ├── models/                          # ← Database Models
│   │   ├── User.js                     # User schema & operations
│   │   └── Agent.js                    # Agent schema & operations
│   │
│   └── scripts/                         # ← Helper Scripts
│       └── seed.js                     # Database seeding
│
├── 📄 Configuration Files
│   │
│   ├── package.json                     # All dependencies (frontend + backend)
│   ├── package-lock.json
│   │
│   ├── vercel.json                      # ← Vercel deployment config
│   │
│   ├── .env                             # ← CREATE THIS - Your secrets
│   ├── .env.example                     # Template
│   │
│   └── .gitignore                       # Git ignore rules
│
├── 📚 Documentation
│   │
│   ├── README.md                        # Complete documentation
│   ├── INSTALLATION.md                  # This file - Setup instructions
│   ├── QUICKSTART.md                    # Quick reference
│   ├── DEPLOYMENT.md                    # Vercel deployment guide
│   ├── FRONTEND_INTEGRATION.md          # React integration
│   ├── API_TESTING.md                   # API testing examples
│   └── FOLDER_STRUCTURE.md              # This file
│
└── node_modules/                        # Auto-generated dependencies

```

## 📊 File Count by Category

| Category | Files | Description |
|----------|-------|-------------|
| API Endpoints | 5 | Serverless functions |
| Models | 2 | Database schemas |
| Utilities | 2 | Helper functions |
| Config | 4 | Configuration files |
| Documentation | 7 | Setup guides |
| Frontend | Many | Your React app |

## 🎨 Color-Coded Structure

```
axigon-website/
│
├── 🟦 Frontend Files (Keep as is)
│   └── src/
│       └── App.js
│
├── 🟩 Backend Files (New - from download)
│   ├── api/
│   ├── lib/
│   ├── models/
│   └── scripts/
│
├── 🟨 Configuration (New/Update)
│   ├── package.json
│   ├── vercel.json
│   └── .env
│
└── 📘 Documentation (Reference)
    └── *.md files
```

## 🔍 What Each Folder Does

### `/api` - Your Backend Endpoints
```
api/
├── auth/          → User authentication
├── users/         → User management
└── agents/        → AI agents marketplace
```
**URLs:** All accessible at `yoursite.com/api/*`

### `/lib` - Shared Utilities
```
lib/
├── db.js          → MongoDB connection & pooling
└── auth.js        → JWT token handling
```
**Purpose:** Code used across multiple endpoints

### `/models` - Database Schemas
```
models/
├── User.js        → User data structure & operations
└── Agent.js       → Agent data structure & operations
```
**Purpose:** Define how data is stored and accessed

### `/scripts` - Helper Tools
```
scripts/
└── seed.js        → Populate database with initial data
```
**Purpose:** One-time setup and maintenance tasks

### `/src/services` - Frontend API Layer (You create this)
```
src/services/
└── api.js         → Connect React to backend
```
**Purpose:** Make API calls from React components

## 📦 What Gets Deployed

### To Vercel:
```
✅ api/          → Becomes serverless functions
✅ lib/          → Used by api/
✅ models/       → Used by api/
✅ src/          → Built into static files
✅ public/       → Served as static assets
✅ vercel.json   → Deployment configuration

❌ scripts/      → Only for local use
❌ .env          → Never deployed (secrets!)
❌ *.md files    → Documentation only
```

## 🚫 What NOT to Commit to Git

Update your `.gitignore`:
```
# Dependencies
node_modules/
package-lock.json

# Environment variables
.env
.env.local
.env.production

# Build output
build/
dist/
.next/

# Vercel
.vercel/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
```

## 📍 Important File Locations

| File | Location | Why |
|------|----------|-----|
| `vercel.json` | Root | Tells Vercel how to deploy |
| `.env` | Root | Your secrets (local only) |
| `package.json` | Root | All dependencies |
| API endpoints | `/api/*` | Auto-mapped to URLs |
| React app | `/src/App.js` | Your frontend |
| API service | `/src/services/api.js` | Connect frontend to backend |

## 🔄 Request Flow

```
1. User visits website
   ↓
2. React app loads (from /src)
   ↓
3. User clicks "Login"
   ↓
4. React calls api.login() (from /src/services/api.js)
   ↓
5. Fetches POST /api/auth/login
   ↓
6. Vercel routes to /api/auth/login.js
   ↓
7. Backend connects to MongoDB (via /lib/db.js)
   ↓
8. Validates credentials (via /models/User.js)
   ↓
9. Generates JWT token (via /lib/auth.js)
   ↓
10. Returns token to React
    ↓
11. React stores token in localStorage
    ↓
12. User is logged in!
```

## ✅ Verification Checklist

After installation, verify these exist:

```bash
# Check folders exist
ls -la api/
ls -la lib/
ls -la models/
ls -la scripts/

# Check key files exist
ls vercel.json
ls .env
ls package.json

# Check React files are intact
ls src/App.js
ls public/index.html
```

## 🎯 Quick Reference

### API Endpoints URLs (after deployment)
- Signup: `POST /api/auth/signup`
- Login: `POST /api/auth/login`
- Profile: `GET /api/users/profile`
- Agents: `GET /api/agents`
- Single Agent: `GET /api/agents/:id`

### Key Environment Variables
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Common Commands
```bash
# Install dependencies
npm install

# Run locally
vercel dev

# Deploy
vercel --prod

# Seed database
node scripts/seed.js
```

## 🎓 Understanding the Architecture

```
┌─────────────────────────────────────────┐
│          USER'S BROWSER                 │
│  (React App from /src)                  │
└──────────────┬──────────────────────────┘
               │
               │ HTTP Requests
               │
┌──────────────▼──────────────────────────┐
│      VERCEL SERVERLESS PLATFORM         │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  /api/*  (from /api folder)        │ │
│  │  ├── Authentication endpoints       │ │
│  │  ├── User management endpoints      │ │
│  │  └── Agents CRUD endpoints          │ │
│  └─────────────┬──────────────────────┘ │
│                │                         │
│  ┌─────────────▼──────────────────────┐ │
│  │  Utilities (from /lib)              │ │
│  │  ├── Database connection            │ │
│  │  └── JWT authentication             │ │
│  └─────────────┬──────────────────────┘ │
│                │                         │
│  ┌─────────────▼──────────────────────┐ │
│  │  Models (from /models)              │ │
│  │  ├── User schema & operations       │ │
│  │  └── Agent schema & operations      │ │
│  └─────────────┬──────────────────────┘ │
└────────────────┼──────────────────────────┘
                 │
                 │ MongoDB Driver
                 │
┌────────────────▼──────────────────────────┐
│         MONGODB ATLAS                     │
│  ┌────────────────────────────────────┐  │
│  │  axigon (database)                 │  │
│  │  ├── users (collection)            │  │
│  │  └── agents (collection)           │  │
│  └────────────────────────────────────┘  │
└───────────────────────────────────────────┘
```

## 🎉 You're All Set!

Your folder structure is complete and ready for:
- ✅ Local development
- ✅ Vercel deployment
- ✅ Production use

Check `INSTALLATION.md` for detailed setup steps!
