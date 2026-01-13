const { connectToDatabase } = require('../lib/db');
const UserModel = require('../models/User');
const { verifyToken } = require('../lib/auth');

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

  try {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Connect to database
    const { db } = await connectToDatabase();
    const userModel = new UserModel(db);

    if (req.method === 'GET') {
      // Get user profile
      const user = await userModel.getProfile(decoded.userId);
      
      return res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          company: user.company,
          createdAt: user.createdAt
        }
      });

    } else if (req.method === 'PUT' || req.method === 'PATCH') {
      // Update user profile
      const { name, company } = req.body;
      
      const updateData = {};
      if (name) updateData.name = name;
      if (company) updateData.company = company;

      const updatedUser = await userModel.update(decoded.userId, updateData);

      return res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          company: updatedUser.company
        }
      });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Profile error:', error);
    
    if (error.message === 'Invalid or expired token') {
      return res.status(403).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};
