const { verifyToken } = require('../../lib/auth');
const { connectToDatabase } = require('../../lib/db');
const LegalConversationModel = require('../../models/LegalConversation');
const LegalMessageModel = require('../../models/LegalMessage');

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

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Auth ──
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const { conversationId } = req.query;
  if (!conversationId) {
    return res.status(400).json({ error: 'conversationId query param is required' });
  }

  try {
    const { db } = await connectToDatabase();
    const convModel = new LegalConversationModel(db);
    const msgModel = new LegalMessageModel(db);

    // Verify the conversation belongs to this user
    const conversations = await convModel.findByUser(decoded.userId);
    const owns = conversations.some(c => c._id.toString() === conversationId);
    if (!owns) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const messages = await msgModel.findByConversation(conversationId);
    return res.status(200).json({ messages });
  } catch (err) {
    console.error('Messages fetch error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
