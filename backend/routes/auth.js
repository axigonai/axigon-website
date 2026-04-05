const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/auth');

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, company, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, company: company || '', password: hashed });

    res.status(201).json({ message: 'Account created successfully' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, company: user.company },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, COOKIE_OPTS);
    res.json({ user: { id: user._id, name: user.name, email: user.email, company: user.company } });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', { ...COOKIE_OPTS, maxAge: 0 });
  res.json({ message: 'Logged out' });
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
