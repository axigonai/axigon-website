# Deploying Axigon Backend to Vercel

Complete step-by-step guide to deploy your backend to Vercel.

## Prerequisites

- Vercel account (free tier is sufficient)
- MongoDB Atlas account (free tier M0)
- Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Setup MongoDB Atlas

1. **Create Account & Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up or log in
   - Click "Build a Database"
   - Choose "M0 Free" tier
   - Select AWS as cloud provider (for future AWS deployment)
   - Choose region closest to your users
   - Click "Create Cluster"

2. **Create Database User**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and strong password
   - Set permissions to "Read and write to any database"
   - Click "Add User"

3. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add Vercel's IP ranges (or use 0.0.0.0/0)
   - Click "Confirm"

4. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Add `/axigon` before `?retryWrites=true`
   
   Example:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/axigon?retryWrites=true&w=majority
   ```

## Step 2: Prepare Your Repository

1. **Create Git Repository**
   ```bash
   cd axigon-website
   git init
   git add .
   git commit -m "Initial commit with backend"
   ```

2. **Push to GitHub**
   ```bash
   # Create repo on GitHub, then:
   git remote add origin https://github.com/yourusername/axigon-website.git
   git branch -M main
   git push -u origin main
   ```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select "axigon-website" repo

2. **Configure Project**
   - Framework Preset: "Other" or "Create React App"
   - Root Directory: `./` (if backend is in root with frontend)
   - Build Command: Leave default or customize
   - Output Directory: Leave default

3. **Set Environment Variables**
   - Click "Environment Variables"
   - Add the following:
   
   | Name | Value |
   |------|-------|
   | `MONGODB_URI` | Your MongoDB connection string |
   | `JWT_SECRET` | Generate random string (use password generator) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `NODE_ENV` | `production` |

   **How to generate JWT_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your API will be at: `https://your-project.vercel.app/api`

### Option B: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd axigon-website
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add MONGODB_URI production
   # Paste your MongoDB connection string when prompted
   
   vercel env add JWT_SECRET production
   # Paste your JWT secret when prompted
   
   vercel env add JWT_EXPIRES_IN production
   # Enter: 7d
   
   vercel env add NODE_ENV production
   # Enter: production
   ```

5. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

## Step 4: Test Your Deployment

1. **Get Your API URL**
   ```
   https://your-project.vercel.app/api
   ```

2. **Test Signup Endpoint**
   ```bash
   curl -X POST https://your-project.vercel.app/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "company": "Test Corp",
       "password": "password123"
     }'
   ```

3. **Test Get Agents Endpoint**
   ```bash
   curl https://your-project.vercel.app/api/agents
   ```

## Step 5: Seed the Database (Optional)

If you want to populate initial AI agents:

1. **Update seed script with your MongoDB URI**
   ```bash
   # Locally, create .env file
   echo "MONGODB_URI=your_connection_string" > .env
   ```

2. **Run seed script**
   ```bash
   node scripts/seed.js
   ```

## Step 6: Update Frontend to Use Production API

Update your React app to use the deployed API:

```javascript
// In your React app
const API_URL = process.env.REACT_APP_API_URL || 
                'https://your-project.vercel.app/api';

// Or use relative URLs if frontend is on same domain
const API_URL = '/api';
```

## Step 7: Configure Custom Domain (Optional)

1. **Add Custom Domain in Vercel**
   - Go to your project settings
   - Click "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update DNS Records**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or A record to Vercel's IP

## Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution:**
- Verify connection string is correct
- Check MongoDB Atlas network access (IP whitelist)
- Ensure database user has proper permissions
- Wait 1-2 minutes after creating cluster

### Issue: "MongoServerSelectionTimeoutError"

**Solution:**
- Add 0.0.0.0/0 to IP whitelist in MongoDB Atlas
- Verify connection string includes `/axigon` database name
- Check if cluster is active and not paused

### Issue: "JWT token invalid"

**Solution:**
- Ensure JWT_SECRET is set in Vercel environment variables
- Redeploy after adding environment variables
- Clear browser localStorage and generate new token

### Issue: "CORS errors"

**Solution:**
- CORS headers are already configured in API functions
- If using custom domain, update CORS origin in code
- Clear browser cache

### Issue: "Function timeout"

**Solution:**
- Vercel free tier has 10s timeout
- Optimize database queries
- Add indexes to MongoDB collections (already in seed script)
- Use connection pooling (already implemented)

## Monitoring & Logs

1. **View Deployment Logs**
   - Go to Vercel Dashboard
   - Click on your project
   - Click "Deployments"
   - Click on specific deployment to view logs

2. **View Runtime Logs**
   - Go to project in Vercel Dashboard
   - Click "Functions" tab
   - Select function to view logs
   - Real-time logs appear here

3. **Monitor MongoDB**
   - Go to MongoDB Atlas
   - Click "Metrics" tab
   - View connections, operations, etc.

## Best Practices for Production

1. **Security**
   - Use strong JWT_SECRET (32+ characters)
   - Rotate secrets periodically
   - Enable MongoDB Atlas encryption
   - Use environment-specific secrets

2. **Performance**
   - MongoDB connection pooling (already implemented)
   - Add database indexes (already in models)
   - Enable MongoDB Atlas auto-scaling for high traffic
   - Consider Vercel Pro for higher limits

3. **Monitoring**
   - Set up MongoDB Atlas alerts
   - Monitor Vercel function execution time
   - Track error rates
   - Set up uptime monitoring (e.g., UptimeRobot)

4. **Backup**
   - Enable MongoDB Atlas automatic backups
   - Export important data regularly
   - Version control all code changes

## Cost Optimization

**Free Tier Limits:**
- Vercel: 100GB bandwidth/month, 100hrs function execution
- MongoDB Atlas: 512MB storage, shared RAM
- Should handle 10,000+ requests/month easily

**When to Upgrade:**
- Vercel Pro: $20/month (more bandwidth, faster functions)
- MongoDB M10: $57/month (dedicated cluster, 2GB RAM)

## Next Steps

1. Set up CI/CD pipeline
2. Add rate limiting
3. Implement refresh tokens
4. Add email verification
5. Set up monitoring alerts
6. Configure custom domain
7. Add API documentation (Swagger)
8. Implement caching strategy

## Support

For issues:
- Check Vercel docs: https://vercel.com/docs
- Check MongoDB docs: https://docs.mongodb.com/
- Open issue on GitHub repository
