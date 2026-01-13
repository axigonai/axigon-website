# 🚀 Axigon Backend - Installation Instructions

## 📦 What You Downloaded

This folder contains your complete backend with everything needed:
- API endpoints (authentication, users, agents)
- Database models and utilities
- Configuration files
- Documentation

## 📁 Current Folder Contents

```
axigon-backend-complete/
├── api/
│   ├── auth/
│   │   ├── signup.js
│   │   └── login.js
│   ├── users/
│   │   └── profile.js
│   └── agents/
│       ├── index.js
│       └── [id].js
├── lib/
│   ├── db.js
│   └── auth.js
├── models/
│   ├── User.js
│   └── Agent.js
├── scripts/
│   └── seed.js
├── package.json
├── vercel.json
├── .env.example
├── .gitignore
└── Documentation (*.md files)
```

## 🎯 Installation Steps

### Step 1: Extract and Move Files

**Option A: If using the downloaded folder directly**
```bash
# Navigate to your Axigon-website folder
cd path/to/axigon-website

# Copy/move all files from axigon-backend-complete INTO your project
# Your structure should look like:
axigon-website/
├── public/           # Your existing React files
├── src/              # Your existing React files
│   └── App.js
├── api/              # ← NEW (from this download)
├── lib/              # ← NEW (from this download)
├── models/           # ← NEW (from this download)
├── scripts/          # ← NEW (from this download)
├── package.json      # Update this (see Step 2)
└── vercel.json       # ← NEW (from this download)
```

**Option B: Manual copy**
1. Unzip/extract `axigon-backend-complete`
2. Copy these folders into your `axigon-website` root:
   - `api/` → `axigon-website/api/`
   - `lib/` → `axigon-website/lib/`
   - `models/` → `axigon-website/models/`
   - `scripts/` → `axigon-website/scripts/`
3. Copy these files:
   - `vercel.json` → `axigon-website/vercel.json`
   - `.env.example` → `axigon-website/.env.example`
   - `.gitignore` → merge with your existing `.gitignore`

### Step 2: Install Backend Dependencies

```bash
cd axigon-website

# Install backend dependencies
npm install bcryptjs jsonwebtoken mongodb cors dotenv
```

**Or update your package.json manually:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.3.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

Then run:
```bash
npm install
```

### Step 3: Setup MongoDB Atlas

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "M0 Free" tier
   - Select AWS as provider
   - Choose closest region
   - Name your cluster
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `axigon` (or your choice)
   - Auto-generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
   - Wait 1-2 minutes for changes to apply

5. **Get Connection String**
   - Go to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<username>` and `<password>` with your actual credentials
   - Add `/axigon` after `.net/` and before the `?`
   - Final format: `mongodb+srv://axigon:yourpassword@cluster0.xxxxx.mongodb.net/axigon?retryWrites=true&w=majority`

### Step 4: Create .env File

```bash
cd axigon-website

# Copy the example file
cp .env.example .env

# Open .env and fill in your values
```

**Edit `.env` file:**
```env
# Replace with your MongoDB connection string from Step 3
MONGODB_URI=mongodb+srv://axigon:yourpassword@cluster0.xxxxx.mongodb.net/axigon?retryWrites=true&w=majority

# Generate a secure random string (see below)
JWT_SECRET=your_generated_secret_key_here

# Token expiration
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development
```

**Generate JWT_SECRET:**
```bash
# Run this command to generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your JWT_SECRET value.

### Step 5: Test Locally

```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Start local development server
vercel dev

# Your backend API will be available at:
# http://localhost:3000/api
```

**Test with curl:**
```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","company":"Test Corp","password":"password123"}'

# Test get agents
curl http://localhost:3000/api/agents
```

### Step 6: Seed Database (Optional)

Populate your database with initial AI agents:

```bash
node scripts/seed.js
```

This will create 6 AI agents in your database.

### Step 7: Update Your React App

Create `src/services/api.js` (see FRONTEND_INTEGRATION.md for complete code):

```javascript
const API_URL = process.env.REACT_APP_API_URL || '/api';

class ApiService {
  async signup(userData) {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  }
  
  async login(credentials) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  }
  
  // Add more methods as needed
}

export default new ApiService();
```

Then in your App.js, replace the fake login/signup with real API calls:
```javascript
import api from './services/api';

const handleSignup = async (e) => {
  e.preventDefault();
  try {
    const data = await api.signup(signupData);
    setUser(data.user);
    setIsLoggedIn(true);
  } catch (error) {
    setError(error.message);
  }
};
```

## 🚀 Deploy to Vercel

### Quick Deploy via CLI

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables for production
vercel env add MONGODB_URI production
# (paste your MongoDB URI when prompted)

vercel env add JWT_SECRET production
# (paste your JWT secret when prompted)

# Deploy to production
vercel --prod
```

### Deploy via Dashboard

1. Push your code to GitHub
2. Go to https://vercel.com/dashboard
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. In "Environment Variables" section, add:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `NODE_ENV`
6. Click "Deploy"

## ✅ Final Checklist

- [ ] Backend files copied to project root
- [ ] Dependencies installed (`npm install`)
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] `.env` file created with MongoDB URI
- [ ] JWT_SECRET generated and added to `.env`
- [ ] Tested locally with `vercel dev`
- [ ] Database seeded (optional)
- [ ] Frontend updated to use API
- [ ] Deployed to Vercel
- [ ] Environment variables set in Vercel

## 🆘 Troubleshooting

### Can't connect to MongoDB
- ✅ Check connection string format
- ✅ Verify username/password are correct
- ✅ Confirm 0.0.0.0/0 is in Network Access
- ✅ Wait 2-3 minutes after creating cluster

### "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Vercel deployment fails
- ✅ Check environment variables are set
- ✅ Verify vercel.json is in root
- ✅ Check build logs in Vercel dashboard

### API returns 500 errors
- ✅ Check Vercel function logs
- ✅ Verify MongoDB URI is correct
- ✅ Check JWT_SECRET is set

## 📚 Documentation

- `README.md` - Complete documentation
- `QUICKSTART.md` - Quick setup guide
- `DEPLOYMENT.md` - Detailed Vercel deployment
- `FRONTEND_INTEGRATION.md` - React integration
- `API_TESTING.md` - API endpoint testing

## 🎉 You're Done!

Your backend is now integrated and ready to use. Your final structure should be:

```
axigon-website/
├── public/
├── src/
│   ├── App.js
│   └── services/
│       └── api.js
├── api/              ✅ Backend
├── lib/              ✅ Backend
├── models/           ✅ Backend
├── scripts/          ✅ Backend
├── package.json      ✅ Updated
├── vercel.json       ✅ New
└── .env              ✅ Created
```

Need help? Check the documentation files or test the API endpoints using the examples in API_TESTING.md!

Happy coding! 🚀
