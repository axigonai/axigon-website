// Merged legal handler — routes via ?action=

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

function authenticate(req, res) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.token;
  if (!token) { res.status(401).json({ error: 'Not authenticated' }); return null; }
  try {
    return verifyToken(token);
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }
}

const SYSTEM_PROMPT =
  'You are Axigon Legal GPT, a specialized AI legal assistant for Indian businesses. ' +
  'Provide structured responses with: Summary, Detail, and Action Items. ' +
  'Always add: "This is AI-generated guidance. Consult a qualified lawyer for formal legal advice."';

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// ─── Route handlers ──────────────────────────────────────────────────────────

async function handleChat(req, res, decoded) {
  const { message, conversationId } = req.body || {};
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const { db } = await connectToDatabase();
  const convModel = new LegalConversationModel(db);
  const msgModel = new LegalMessageModel(db);
  await convModel.createIndexes();
  await msgModel.createIndexes();

  let convId = conversationId;
  if (!convId) {
    const conv = await convModel.create({ userId: decoded.userId, title: message.trim() });
    convId = conv._id.toString();
  }

  await msgModel.create({ conversationId: convId, role: 'user', content: message.trim() });

  const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: message.trim() }] }],
      generationConfig: { maxOutputTokens: 1024 },
    }),
  });

  if (!geminiRes.ok) {
    const err = await geminiRes.text();
    return res.status(502).json({ error: 'LLM request failed', detail: err });
  }

  const data = await geminiRes.json();
  const response = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!response) return res.status(502).json({ error: 'Empty response from LLM' });

  await msgModel.create({ conversationId: convId, role: 'assistant', content: response });
  await convModel.touch(convId);

  return res.status(200).json({ response, conversationId: convId });
}

async function handleConversations(req, res, decoded) {
  const { db } = await connectToDatabase();
  const convModel = new LegalConversationModel(db);
  const conversations = await convModel.findByUser(decoded.userId);
  return res.status(200).json({ conversations });
}

async function handleMessages(req, res, decoded) {
  const { conversationId } = req.query;
  if (!conversationId) return res.status(400).json({ error: 'conversationId query param is required' });

  const { db } = await connectToDatabase();
  const convModel = new LegalConversationModel(db);
  const msgModel = new LegalMessageModel(db);

  const conversations = await convModel.findByUser(decoded.userId);
  const owns = conversations.some(c => c._id.toString() === conversationId);
  if (!owns) return res.status(403).json({ error: 'Forbidden' });

  const messages = await msgModel.findByConversation(conversationId);
  return res.status(200).json({ messages });
}

async function handleDeleteConversation(req, res, decoded) {
  const { conversationId } = req.body || {};
  if (!conversationId) return res.status(400).json({ error: 'conversationId is required' });

  const { db } = await connectToDatabase();
  const convModel = new LegalConversationModel(db);
  const msgModel = new LegalMessageModel(db);

  // Verify ownership
  const conv = await convModel.collection.findOne({
    _id: new (require('mongodb').ObjectId)(conversationId),
    userId: decoded.userId,
  });
  if (!conv) return res.status(403).json({ error: 'Forbidden' });

  await convModel.collection.deleteOne({ _id: conv._id });
  await msgModel.collection.deleteMany({ conversationId });

  return res.status(200).json({ success: true });
}

// ─── Main handler ────────────────────────────────────────────────────────────

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  const origin = req.headers.origin;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const decoded = authenticate(req, res);
  if (!decoded) return;

  const { action } = req.query;

  try {
    if (action === 'chat'                && req.method === 'POST')   return await handleChat(req, res, decoded);
    if (action === 'conversations'       && req.method === 'GET')    return await handleConversations(req, res, decoded);
    if (action === 'messages'            && req.method === 'GET')    return await handleMessages(req, res, decoded);
    if (action === 'delete-conversation' && req.method === 'DELETE') return await handleDeleteConversation(req, res, decoded);

    return res.status(400).json({ error: 'Unknown action or method' });
  } catch (err) {
    console.error('Legal handler error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
