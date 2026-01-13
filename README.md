# Axigon AI Backend

Node.js serverless backend for Axigon AI platform, optimized for Vercel deployment with MongoDB Atlas.

## 🚀 Features

- ✅ **Authentication API** - JWT-based user authentication (signup, login)
- ✅ **User Management** - User profiles and account management
- ✅ **AI Agents Marketplace** - Full CRUD operations for AI agents
- ✅ **MongoDB Integration** - Optimized for serverless with connection pooling
- ✅ **Vercel-Ready** - Serverless functions with zero configuration
- ✅ **AWS-Compatible** - MongoDB can be hosted on AWS or Atlas

## 📁 Project Structure

```
axigon-backend/
├── api/                        # Vercel serverless functions
│   ├── auth/
│   │   ├── signup.js          # POST /api/auth/signup
│   │   └── login.js           # POST /api/auth/login
│   ├── users/
│   │   └── profile.js         # GET/PUT /api/users/profile
│   └── agents/
│       ├── index.js           # GET/POST /api/agents
│       └── [id].js            # GET/PUT/DELETE /api/agents/:id
├── lib/
│   ├── db.js                  # Database connection with pooling
│   └── auth.js                # JWT utilities and middleware
├── models/
│   ├── User.js                # User model and operations
│   └── Agent.js               # Agent model and operations
├── scripts/
│   └── seed.js                # Database seeding script
├── package.json
├── vercel.json                # Vercel configuration
└── .env.example               # Environment variables template
```

## 🛠️ Setup Instructions

### 1. MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M0 Free tier is fine for development)
3. Create a database user with password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### 2. Local Development Setup

1. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/axigon?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Seed the database (optional):**
   ```bash
   node scripts/seed.js
   ```

5. **Run locally with Vercel CLI:**
   ```bash
   npm install -g vercel
   vercel dev
   ```

Your API will be available at `http://localhost:3000/api`

## 🚢 Deployment to Vercel

### Option 1: Vercel CLI

1. **Login to Vercel:**
   ```bash
   vercel login
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables:**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   ```

### Option 2: Vercel Dashboard

1. Import your Git repository in Vercel
2. Add environment variables in Settings → Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
3. Deploy!

## 📡 API Endpoints

### Authentication

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@company.com",
  "company": "Acme Corp",
  "password": "password123"
}

Response:
{
  "message": "User created successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@company.com",
    "company": "Acme Corp"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@company.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Management

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>

Response:
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@company.com",
    "company": "Acme Corp",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "company": "New Company"
}
```

### AI Agents Marketplace

#### Get All Agents
```http
GET /api/agents

Response:
{
  "agents": [
    {
      "_id": "...",
      "name": "ContractAI",
      "domain": "Legal Analysis",
      "description": "Extract obligations, risks...",
      "features": [...],
      "pricing": { "model": "subscription", "price": 499 }
    }
  ],
  "count": 6
}
```

#### Search Agents
```http
GET /api/agents?search=legal
GET /api/agents?domain=Legal Analysis
```

#### Get Single Agent
```http
GET /api/agents/[id]
```

#### Create Agent (Auth Required)
```http
POST /api/agents
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "NewAgent",
  "domain": "Custom Domain",
  "description": "Agent description",
  "features": ["feature1", "feature2"],
  "pricing": { "model": "subscription", "price": 399 }
}
```

#### Update Agent (Auth Required)
```http
PUT /api/agents/[id]
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "pricing": { "model": "enterprise", "price": 999 }
}
```

#### Delete Agent (Auth Required)
```http
DELETE /api/agents/[id]
Authorization: Bearer <token>
```

## 🔗 Integrating with React Frontend

Update your React app to use the backend:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Signup
const handleSignup = async (signupData) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signupData)
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

// Login
const handleLogin = async (loginData) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData)
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

// Get agents
const fetchAgents = async () => {
  const response = await fetch(`${API_URL}/agents`);
  return await response.json();
};

// Authenticated request
const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/users/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};
```

## 🏗️ Folder Structure for Full-Stack Project

```
axigon-website/
├── frontend/              # Your React app
│   ├── public/
│   ├── src/
│   │   └── App.js
│   └── package.json
│
├── api/                   # Backend (from this repo)
│   ├── auth/
│   ├── users/
│   └── agents/
│
├── lib/
├── models/
├── scripts/
├── vercel.json
└── package.json
```

## 🔒 Security Best Practices

1. **JWT Secret**: Use a strong random string in production
2. **Environment Variables**: Never commit `.env` files
3. **CORS**: Update CORS settings for production domain
4. **Rate Limiting**: Add rate limiting for authentication endpoints
5. **Input Validation**: Already implemented basic validation
6. **Password Hashing**: Using bcrypt with 10 rounds
7. **MongoDB**: Use IP whitelist and strong passwords

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  company: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Agents Collection
```javascript
{
  _id: ObjectId,
  name: String,
  domain: String,
  description: String,
  features: [String],
  pricing: {
    model: String,
    price: Number
  },
  capabilities: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment Checklist

- [ ] Set up MongoDB Atlas cluster
- [ ] Create database user with password
- [ ] Whitelist Vercel IPs or use 0.0.0.0/0
- [ ] Set environment variables in Vercel
- [ ] Deploy to Vercel
- [ ] Test all endpoints
- [ ] Update frontend API_URL to Vercel domain
- [ ] Run seed script if needed
- [ ] Configure custom domain (optional)

## 🛟 Troubleshooting

### Connection Timeout
- Check MongoDB Atlas IP whitelist
- Verify connection string is correct
- Ensure database user has proper permissions

### Authentication Errors
- Verify JWT_SECRET is set correctly
- Check token expiration time
- Ensure Authorization header format: `Bearer <token>`

### CORS Issues
- Update CORS headers in API functions
- Check Vercel domain is correctly set

## 📝 License

MIT

## 👥 Support

For issues or questions, contact: support@axigon.ai
