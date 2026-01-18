const { connectToDatabase } = require('../../lib/db');
const UserModel = require('../../models/User');
const { generateToken } = require('../../lib/auth');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

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
    console.log('=== SIGNUP REQUEST START ===');
    console.log('Timestamp:', new Date().toISOString());
    
    // Check environment variables
    console.log('Environment check:');
    console.log('- MONGO_CONNECTION_STRING exists:', !!process.env.MONGO_CONNECTION_STRING);
    console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('- JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('- NODE_ENV:', process.env.NODE_ENV);

    const { name, email, company, password } = req.body;
    console.log('Request body received:', { name, email, company, passwordLength: password?.length });

    // Validation
    if (!name || !email || !company || !password) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ 
        error: 'All fields are required',
        missing: {
          name: !name,
          email: !email,
          company: !company,
          password: !password
        }
      });
    }

    if (password.length < 6) {
      console.log('Validation failed: Password too short');
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: Invalid email format');
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if MongoDB connection string exists
    const mongoUri = process.env.MONGO_CONNECTION_STRING || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('CRITICAL: No MongoDB connection string found in environment variables!');
      return res.status(500).json({ 
        error: 'Database configuration error',
        details: 'MongoDB connection string not configured. Please add MONGO_CONNECTION_STRING or MONGODB_URI in Vercel environment variables.'
      });
    }

    console.log('MongoDB URI found, first 30 chars:', mongoUri.substring(0, 30) + '...');

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET not found!');
      return res.status(500).json({ 
        error: 'Authentication configuration error',
        details: 'JWT_SECRET not configured in environment variables.'
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
        errorType: dbError.name,
        hint: 'Check if MongoDB Atlas Network Access allows Vercel IPs (0.0.0.0/0)'
      });
    }

    // Create user model
    console.log('Creating user model...');
    const userModel = new UserModel(db);
    
    console.log('Creating indexes...');
    try {
      await userModel.createIndexes();
      console.log('✓ Indexes created successfully');
    } catch (indexError) {
      console.error('Index creation failed:', indexError.message);
      // Continue anyway, indexes are not critical for signup
    }

    // Create user
    console.log('Creating user in database...');
    let user;
    try {
      user = await userModel.create({ name, email, company, password });
      console.log('✓ User created successfully, ID:', user._id);
    } catch (userError) {
      console.error('User creation failed:');
      console.error('Error name:', userError.name);
      console.error('Error message:', userError.message);
      
      if (userError.message === 'User with this email already exists') {
        return res.status(409).json({ error: 'User with this email already exists' });
      }
      
      return res.status(500).json({ 
        error: 'Failed to create user',
        details: userError.message
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

    console.log('=== SIGNUP REQUEST SUCCESS ===');

    // Return user data and token
    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company: user.company
      },
      token
    });

  } catch (error) {
    console.error('=== SIGNUP REQUEST FAILED ===');
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