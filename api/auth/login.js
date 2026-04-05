const { connectToDatabase } = require('../../lib/db');
const UserModel = require('../../models/User');
const { generateToken } = require('../../lib/auth');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  const origin = req.headers.origin;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== LOGIN REQUEST START ===');
    console.log('Timestamp:', new Date().toISOString());
    
    // Check environment variables
    console.log('Environment check:');
    console.log('- MONGO_CONNECTION_STRING exists:', !!process.env.MONGO_CONNECTION_STRING);
    console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('- JWT_SECRET exists:', !!process.env.JWT_SECRET);

    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Validation
    if (!email || !password) {
      console.log('Validation failed: Missing credentials');
      return res.status(400).json({ 
        error: 'Email and password are required',
        missing: {
          email: !email,
          password: !password
        }
      });
    }

    // Check if MongoDB connection string exists
    const mongoUri = process.env.MONGO_CONNECTION_STRING || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('CRITICAL: No MongoDB connection string found!');
      return res.status(500).json({ 
        error: 'Database configuration error',
        details: 'MongoDB connection string not configured.'
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET not found!');
      return res.status(500).json({ 
        error: 'Authentication configuration error',
        details: 'JWT_SECRET not configured.'
      });
    }

    // Connect to database
    console.log('Attempting to connect to MongoDB...');
    let db;
    try {
      const connection = await connectToDatabase();
      db = connection.db;
      console.log('✓ MongoDB connection successful');
    } catch (dbError) {
      console.error('MongoDB connection failed:');
      console.error('Error name:', dbError.name);
      console.error('Error message:', dbError.message);
      console.error('Error stack:', dbError.stack);
      
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: dbError.message,
        errorType: dbError.name
      });
    }

    const userModel = new UserModel(db);

    // Find user
    console.log('Searching for user in database...');
    let user;
    try {
      user = await userModel.findByEmail(email);
      if (!user) {
        console.log('User not found for email:', email);
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      console.log('✓ User found, ID:', user._id);
    } catch (findError) {
      console.error('User lookup failed:', findError.message);
      return res.status(500).json({ 
        error: 'User lookup failed',
        details: findError.message
      });
    }

    // Verify password
    console.log('Verifying password...');
    let isValidPassword;
    try {
      isValidPassword = await userModel.verifyPassword(password, user.password);
      if (!isValidPassword) {
        console.log('Password verification failed for email:', email);
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      console.log('✓ Password verified successfully');
    } catch (verifyError) {
      console.error('Password verification error:', verifyError.message);
      return res.status(500).json({ 
        error: 'Password verification failed',
        details: verifyError.message
      });
    }

    // Generate JWT token
    console.log('Generating JWT token...');
    let token;
    try {
      token = generateToken(user._id.toString(), user.email);
      console.log('✓ JWT token generated successfully');
    } catch (tokenError) {
      console.error('Token generation failed:', tokenError.message);
      return res.status(500).json({ 
        error: 'Authentication token generation failed',
        details: tokenError.message
      });
    }

    console.log('=== LOGIN REQUEST SUCCESS ===');

    // Set httpOnly cookie
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`);

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company: user.company
      },
    });

  } catch (error) {
    console.error('=== LOGIN REQUEST FAILED ===');
    console.error('Unexpected error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      type: error.name,
      timestamp: new Date().toISOString()
    });
  }
};