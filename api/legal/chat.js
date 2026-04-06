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

const SYSTEM_PROMPT =
  'You are Axigon Legal GPT, a specialized AI legal assistant for Indian businesses. ' +
  'Provide structured responses with: Summary, Detail, and Action Items. ' +
  'Always add: "This is AI-generated guidance. Consult a qualified lawyer for formal legal advice."';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  const origin = req.headers.origin;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
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

  // ── Validate body ──
  const { message, conversationId } = req.body || {};
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  // ── Check env ──
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY not set');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { db } = await connectToDatabase();
    const convModel = new LegalConversationModel(db);
    const msgModel = new LegalMessageModel(db);
    await convModel.createIndexes();
    await msgModel.createIndexes();

    // ── Create or reuse conversation ──
    let convId = conversationId;
    if (!convId) {
      const conv = await convModel.create({
        userId: decoded.userId,
        title: message.trim(),
      });
      convId = conv._id.toString();
    }

    // ── Save user message ──
    await msgModel.create({ conversationId: convId, role: 'user', content: message.trim() });

    // ── Call Gemini ──
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: message.trim() }] }],
          generationConfig: { maxOutputTokens: 1024 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, err);
      return res.status(502).json({ error: 'LLM request failed', detail: err });
    }

    const data = await geminiRes.json();
    const response = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!response) {
      return res.status(502).json({ error: 'Empty response from LLM' });
    }

    // ── Save assistant message & update conversation timestamp ──
    await msgModel.create({ conversationId: convId, role: 'assistant', content: response });
    await convModel.touch(convId);

    return res.status(200).json({ response, conversationId: convId });

  } catch (err) {
    console.error('Legal chat error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
