const { verifyToken } = require('../../lib/auth');
const { connectToDatabase } = require('../../lib/db');

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  let decoded;
  try { decoded = verifyToken(token); }
  catch { return res.status(401).json({ error: 'Invalid or expired token' }); }

  try {
    const { db } = await connectToDatabase();
    const conversations = await db.collection('finance_conversations')
      .find({ userId: decoded.userId })
      .sort({ updatedAt: -1 })
      .toArray();
    return res.status(200).json({ conversations });
  } catch (err) {
    console.error('Finance conversations error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
