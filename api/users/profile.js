const { connectToDatabase } = require('../../lib/db');
const UserModel = require('../../models/User');
const { verifyToken } = require('../../lib/auth');

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach((cookie) => {
    const [key, ...val] = cookie.trim().split('=');
    cookies[key.trim()] = val.join('=');
  });
  return cookies;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  const origin = req.headers.origin;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { db } = await connectToDatabase();
    const userModel = new UserModel(db);

    if (req.method === 'GET') {
      const user = await userModel.getProfile(decoded.userId);
      return res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          company: user.company,
          accountType: user.accountType || 'business',
          phone: user.phone || '',
          dateOfBirth: user.dateOfBirth || '',
          city: user.city || '',
          occupation: user.occupation || '',
          annualIncome: user.annualIncome || '',
        },
      });
    }

    // PUT
    const { name, phone, dateOfBirth, city, occupation, annualIncome } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (city !== undefined) updateData.city = city;
    if (occupation !== undefined) updateData.occupation = occupation;
    if (annualIncome !== undefined) updateData.annualIncome = annualIncome;

    const updatedUser = await userModel.update(decoded.userId, updateData);

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        company: updatedUser.company,
        accountType: updatedUser.accountType || 'business',
        phone: updatedUser.phone || '',
        dateOfBirth: updatedUser.dateOfBirth || '',
        city: updatedUser.city || '',
        occupation: updatedUser.occupation || '',
        annualIncome: updatedUser.annualIncome || '',
      },
    });

  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
