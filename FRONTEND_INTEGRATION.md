# Integrating Backend with React Frontend

Guide to connect your Axigon React app with the Node.js backend.

## Step 1: Create API Service Layer

Create a new file: `frontend/src/services/api.js`

```javascript
const API_URL = process.env.REACT_APP_API_URL || '/api';

class ApiService {
  // Helper method for API calls
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('axigon_token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async signup(userData) {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.token) {
      localStorage.setItem('axigon_token', data.token);
      localStorage.setItem('axigon_user', JSON.stringify(data.user));
    }
    
    return data;
  }

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.token) {
      localStorage.setItem('axigon_token', data.token);
      localStorage.setItem('axigon_user', JSON.stringify(data.user));
    }
    
    return data;
  }

  logout() {
    localStorage.removeItem('axigon_token');
    localStorage.removeItem('axigon_user');
  }

  isAuthenticated() {
    return !!localStorage.getItem('axigon_token');
  }

  getCurrentUser() {
    const user = localStorage.getItem('axigon_user');
    return user ? JSON.parse(user) : null;
  }

  // User Management
  async getProfile() {
    return await this.request('/users/profile');
  }

  async updateProfile(userData) {
    return await this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // AI Agents
  async getAgents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/agents?${queryString}` : '/agents';
    return await this.request(endpoint);
  }

  async getAgent(agentId) {
    return await this.request(`/agents/${agentId}`);
  }

  async createAgent(agentData) {
    return await this.request('/agents', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  }

  async updateAgent(agentId, agentData) {
    return await this.request(`/agents/${agentId}`, {
      method: 'PUT',
      body: JSON.stringify(agentData),
    });
  }

  async deleteAgent(agentId) {
    return await this.request(`/agents/${agentId}`, {
      method: 'DELETE',
    });
  }

  async searchAgents(searchTerm) {
    return await this.getAgents({ search: searchTerm });
  }

  async getAgentsByDomain(domain) {
    return await this.getAgents({ domain });
  }
}

export default new ApiService();
```

## Step 2: Update Your React App.js

Replace the authentication logic in your `App.js`:

```javascript
import React, { useState, useEffect } from 'react';
import { Play, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react';
import api from './services/api';

const AxigonWebsite = () => {
  const [currentPage, setCurrentPage] = useState('company');
  const [activeTab, setActiveTab] = useState('consulting');
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', company: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);

  // Check if user is logged in on mount
  useEffect(() => {
    if (api.isAuthenticated()) {
      const currentUser = api.getCurrentUser();
      setUser(currentUser);
      setIsLoggedIn(true);
    }
  }, []);

  // Load agents when marketplace page is opened
  useEffect(() => {
    if (currentPage === 'marketplace') {
      loadAgents();
    }
  }, [currentPage]);

  const loadAgents = async () => {
    try {
      const data = await api.getAgents();
      setAgents(data.agents);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const data = await api.login(loginData);
      setUser(data.user);
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
      setLoginData({ email: '', password: '' });
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!signupData.name || !signupData.email || !signupData.company || !signupData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const data = await api.signup(signupData);
      setUser(data.user);
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
      setSignupData({ name: '', email: '', company: '', password: '' });
    } catch (error) {
      setError(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('logout-success');
  };

  // Rest of your component code remains the same...
  // Just replace the hardcoded agents array with the agents state

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Your existing JSX */}
    </div>
  );
};

export default AxigonWebsite;
```

## Step 3: Add Environment Variable

Create `.env` file in your React app root:

```env
# For development (local backend)
REACT_APP_API_URL=http://localhost:3000/api

# For production (Vercel)
# REACT_APP_API_URL=https://your-app.vercel.app/api
# Or use relative path if frontend and backend are on same domain
# REACT_APP_API_URL=/api
```

## Step 4: Update package.json

Add proxy for local development in `frontend/package.json`:

```json
{
  "name": "axigon-frontend",
  "version": "1.0.0",
  "proxy": "http://localhost:3000",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

## Step 5: Enhanced Error Handling

Create a custom hook for better error handling: `frontend/src/hooks/useApi.js`

```javascript
import { useState } from 'react';
import api from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiCall) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
};
```

Usage example:

```javascript
import { useApi } from './hooks/useApi';

const MyComponent = () => {
  const { loading, error, execute } = useApi();

  const handleSubmit = async () => {
    try {
      const result = await execute(() => api.signup(signupData));
      console.log('Success:', result);
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};
```

## Step 6: Protected Route Component

Create protected route wrapper: `frontend/src/components/ProtectedRoute.js`

```javascript
import React from 'react';
import api from '../services/api';

const ProtectedRoute = ({ children, redirectTo = 'login' }) => {
  if (!api.isAuthenticated()) {
    // Redirect to login or show login prompt
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Please log in to access this page</h2>
        <button onClick={() => window.location.href = '/login'}>
          Go to Login
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
```

## Step 7: Testing the Integration

1. **Start Backend Locally**
   ```bash
   cd axigon-website
   vercel dev
   # Backend will run on http://localhost:3000
   ```

2. **Start React Frontend**
   ```bash
   cd frontend
   npm start
   # Frontend will run on http://localhost:3001
   ```

3. **Test Signup**
   - Navigate to signup page
   - Fill in form
   - Check browser console for API calls
   - Verify token in localStorage

4. **Test Login**
   - Use same credentials
   - Verify you're redirected to dashboard

5. **Test Agents**
   - Navigate to marketplace
   - Verify agents load from API

## Step 8: Production Deployment

1. **Update Environment Variable**
   ```env
   REACT_APP_API_URL=/api
   ```

2. **Build React App**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel**
   - Backend and frontend deploy together
   - API available at `/api/*`
   - Frontend at root `/`

## Common Issues & Solutions

### Issue: CORS errors in development

**Solution:** Use proxy in package.json (already added above)

### Issue: Token expires

**Solution:** Implement token refresh logic:

```javascript
// In api.js
async refreshToken() {
  // Implement refresh token endpoint in backend
  // For now, just redirect to login
  this.logout();
  window.location.href = '/login';
}
```

### Issue: Network errors

**Solution:** Add retry logic:

```javascript
async requestWithRetry(endpoint, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await this.request(endpoint, options);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## Next Steps

1. Add loading states and spinners
2. Implement toast notifications for success/error
3. Add form validation library (e.g., Formik, React Hook Form)
4. Implement state management (Redux, Zustand)
5. Add offline support with service workers
6. Implement real-time updates with WebSockets
7. Add analytics tracking

## Security Checklist

- ✅ Never store passwords in state
- ✅ Use HTTPS in production
- ✅ Clear tokens on logout
- ✅ Validate all inputs
- ✅ Handle expired tokens gracefully
- ✅ Use environment variables for API URLs
- ✅ Implement CSRF protection if needed
