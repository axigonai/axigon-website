const { verifyToken } = require('../../lib/auth');
const { connectToDatabase } = require('../../lib/db');
const { ObjectId } = require('mongodb');

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach((cookie) => {
    const [key, ...val] = cookie.trim().split('=');
    cookies[key.trim()] = val.join('=');
  });
  return cookies;
}

function fmt(n) {
  if (n == null || n === '') return null;
  return `Rs.${Number(n).toLocaleString('en-IN')}`;
}

function buildSystemPrompt(profile) {
  let profileSection;

  if (!profile || !profile.monthlyIncome) {
    profileSection =
      'No financial data on file yet. ' +
      'Encourage the user to upload a bank statement or salary slip ' +
      'via the Life Finance upload feature to receive personalised advice.';
  } else {
    const lines = [
      profile.monthlyIncome  ? `- Monthly Income: ${fmt(profile.monthlyIncome)}`   : null,
      profile.annualIncome   ? `- Annual Income: ${fmt(profile.annualIncome)}`      : null,
      profile.totalExpenses  ? `- Monthly Expenses: ${fmt(profile.totalExpenses)}`  : null,
      profile.currentBalance != null ? `- Current Balance: ${fmt(profile.currentBalance)}` : null,
      profile.documentsCount ? `- Documents uploaded: ${profile.documentsCount}`    : null,
    ].filter(Boolean);

    profileSection = lines.join('\n');
  }

  return `You are Axigon Life Finance, a personal financial advisor AI for Indian users.

User Financial Profile:
${profileSection}

If no financial data is available yet, encourage the user to upload a bank statement or salary slip to get personalised advice.

Always structure responses as:
Summary: one line
Analysis: detailed breakdown
Action Items: specific steps with numbers

Be specific to Indian financial context — mention SIP, PPF, ELSS, GST, ITR where relevant.
Always use Rs. for currency.
Never give generic advice — tie everything to their actual numbers.`;
}

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  const origin = req.headers.origin;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── Auth ──
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  let decoded;
  try { decoded = verifyToken(token); }
  catch { return res.status(401).json({ error: 'Invalid or expired token' }); }

  const userId = decoded.userId;

  const { message, conversationId } = req.body || {};
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

  try {
    const { db } = await connectToDatabase();

    // ── Fetch finance profile for context ──
    const profile = await db.collection('finance_profiles').findOne({ userId });

    // ── Create or reuse conversation ──
    let convId = conversationId;
    if (!convId) {
      const now = new Date();
      const result = await db.collection('finance_conversations').insertOne({
        userId,
        title: message.trim().slice(0, 50),
        createdAt: now,
        updatedAt: now,
      });
      convId = result.insertedId.toString();
    }

    // ── Fetch last 10 messages for context ──
    const history = await db.collection('finance_messages')
      .find({ conversationId: convId })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();
    history.reverse(); // chronological order

    // ── Build Gemini contents array ──
    const contents = [
      ...history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      { role: 'user', parts: [{ text: message.trim() }] },
    ];

    // ── Call Gemini ──
    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildSystemPrompt(profile) }] },
        contents,
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

    // ── Persist messages ──
    const now = new Date();
    await db.collection('finance_messages').insertMany([
      { conversationId: convId, role: 'user',      content: message.trim(), createdAt: now },
      { conversationId: convId, role: 'assistant', content: response,        createdAt: new Date(now.getTime() + 1) },
    ]);

    // ── Update conversation timestamp ──
    await db.collection('finance_conversations').updateOne(
      { _id: new ObjectId(convId) },
      { $set: { updatedAt: new Date() } }
    );

    return res.status(200).json({ response, conversationId: convId });

  } catch (err) {
    console.error('Finance chat error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
