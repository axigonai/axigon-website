const { connectToDatabase } = require('../lib/db');
const UserModel = require('../models/User');
const { generateToken } = require('../lib/auth');

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
    const { name, email, company, password } = req.body;

    // Validation
    if (!name || !email || !company || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const userModel = new UserModel(db);
    await userModel.createIndexes();

    // Create user
    const user = await userModel.create({ name, email, company, password });

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    // Return user data and token
    res.status(201).json({
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
    console.error('Signup error:', error);
    
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};
