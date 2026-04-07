// Merged finance handler — routes via ?action=
// bodyParser disabled globally because upload needs raw stream;
// non-upload routes read JSON body manually via readJsonBody().

const Busboy = require('busboy');
const { verifyToken } = require('../../lib/auth');
const { connectToDatabase } = require('../../lib/db');
const { ObjectId } = require('mongodb');

module.exports.config = { api: { bodyParser: false } };

// ─── Helpers ────────────────────────────────────────────────────────────────

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

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: req.headers });
    let fileBuffer = null;
    let fileName = '';
    let mimeType = 'application/octet-stream';
    busboy.on('file', (fieldname, fileStream, info) => {
      fileName = info.filename || 'upload';
      mimeType = info.mimeType || 'application/octet-stream';
      const chunks = [];
      fileStream.on('data', chunk => chunks.push(chunk));
      fileStream.on('end', () => { fileBuffer = Buffer.concat(chunks); });
    });
    busboy.on('finish', () => {
      if (!fileBuffer) return reject(new Error('No file received'));
      resolve({ fileBuffer, fileName, mimeType });
    });
    busboy.on('error', reject);
    req.pipe(busboy);
  });
}

// ─── Finance chat helpers ────────────────────────────────────────────────────

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

// ─── Upload helpers ──────────────────────────────────────────────────────────

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const EXTRACTION_PROMPT = `Extract all financial information from this document.
Return as JSON with these fields:
{
  "documentType": "salary_slip|bank_statement|other",
  "period": "month/year if visible",
  "income": { "monthly": 0, "annual": 0 },
  "expenses": { "total": 0, "categories": {} },
  "savings": 0,
  "balance": 0,
  "transactions": [{ "date": "", "description": "", "amount": 0, "type": "credit|debit" }],
  "employer": "",
  "accountNumber": "last 4 digits only",
  "otherDetails": {}
}
Return only valid JSON, no explanation.`;

function buildUploadSummary(documentType, extracted) {
  const f = (n) => n ? `Rs.${Number(n).toLocaleString('en-IN')}` : null;
  if (documentType === 'salary_slip') {
    const income = f(extracted.income?.monthly);
    return income ? `Salary slip processed — monthly income of ${income} recorded` : 'Salary slip processed — income details extracted';
  }
  if (documentType === 'bank_statement') {
    const balance = f(extracted.balance);
    return balance ? `Bank statement processed — current balance of ${balance} recorded` : 'Bank statement processed — transaction history extracted';
  }
  const period = extracted.period ? ` for ${extracted.period}` : '';
  return `Financial document processed${period} — data extracted successfully`;
}

// ─── Route handlers ──────────────────────────────────────────────────────────

async function handleChat(req, res, decoded) {
  const { message, conversationId } = await readJsonBody(req);
  if (!message || !message.trim()) return res.status(400).json({ error: 'message is required' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

  const { db } = await connectToDatabase();
  const userId = decoded.userId;

  const profile = await db.collection('finance_profiles').findOne({ userId });

  let convId = conversationId;
  if (!convId) {
    const now = new Date();
    const result = await db.collection('finance_conversations').insertOne({
      userId, title: message.trim().slice(0, 50), createdAt: now, updatedAt: now,
    });
    convId = result.insertedId.toString();
  }

  const history = await db.collection('finance_messages')
    .find({ conversationId: convId }).sort({ createdAt: -1 }).limit(10).toArray();
  history.reverse();

  const contents = [
    ...history.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
    { role: 'user', parts: [{ text: message.trim() }] },
  ];

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

  const now = new Date();
  await db.collection('finance_messages').insertMany([
    { conversationId: convId, role: 'user',      content: message.trim(), createdAt: now },
    { conversationId: convId, role: 'assistant', content: response,       createdAt: new Date(now.getTime() + 1) },
  ]);
  await db.collection('finance_conversations').updateOne(
    { _id: new ObjectId(convId) }, { $set: { updatedAt: new Date() } }
  );

  return res.status(200).json({ response, conversationId: convId });
}

async function handleUpload(req, res, decoded) {
  let fileBuffer, fileName, mimeType;
  try {
    ({ fileBuffer, fileName, mimeType } = await parseMultipart(req));
  } catch (err) {
    return res.status(400).json({ error: err.message || 'File upload failed' });
  }

  const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  if (!allowed.includes(mimeType)) {
    return res.status(400).json({ error: `Unsupported file type: ${mimeType}. Upload a PDF or image.` });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

  let extracted;
  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [
          { text: EXTRACTION_PROMPT },
          { inlineData: { mimeType, data: fileBuffer.toString('base64') } },
        ]}],
        generationConfig: { maxOutputTokens: 2048, temperature: 0.1 },
      }),
    });
    const geminiData = await geminiRes.json();
    if (!geminiRes.ok) return res.status(502).json({ error: geminiData?.error?.message || 'Gemini API error' });
    const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    extracted = JSON.parse(cleaned);
  } catch (err) {
    return res.status(502).json({ error: `Failed to extract data from document: ${err.message}` });
  }

  const documentType = extracted.documentType || 'other';
  const userId = decoded.userId;

  const { db } = await connectToDatabase();
  await db.collection('finance_documents').insertOne({
    userId, fileName, documentType, extractedData: extracted, uploadedAt: new Date(),
  });

  const profileUpdate = { userId, lastUpdated: new Date() };
  if (extracted.income?.monthly)   profileUpdate.monthlyIncome  = extracted.income.monthly;
  if (extracted.income?.annual)    profileUpdate.annualIncome   = extracted.income.annual;
  if (extracted.expenses?.total)   profileUpdate.totalExpenses  = extracted.expenses.total;
  if (extracted.balance != null)   profileUpdate.currentBalance = extracted.balance;

  await db.collection('finance_profiles').updateOne(
    { userId },
    { $set: profileUpdate, $inc: { documentsCount: 1 }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );

  return res.status(200).json({ success: true, documentType, summary: buildUploadSummary(documentType, extracted) });
}

async function handleConversations(req, res, decoded) {
  const { db } = await connectToDatabase();
  const conversations = await db.collection('finance_conversations')
    .find({ userId: decoded.userId }).sort({ updatedAt: -1 }).toArray();
  return res.status(200).json({ conversations });
}

async function handleMessages(req, res, decoded) {
  const { conversationId } = req.query;
  if (!conversationId) return res.status(400).json({ error: 'conversationId query param is required' });

  const { db } = await connectToDatabase();
  const conv = await db.collection('finance_conversations').findOne({
    _id: new ObjectId(conversationId), userId: decoded.userId,
  });
  if (!conv) return res.status(403).json({ error: 'Forbidden' });

  const messages = await db.collection('finance_messages')
    .find({ conversationId }).sort({ createdAt: 1 }).toArray();
  return res.status(200).json({ messages });
}

async function handleProfile(req, res, decoded) {
  const { db } = await connectToDatabase();
  const profile = await db.collection('finance_profiles').findOne({ userId: decoded.userId });
  return res.status(200).json({ profile: profile || null });
}

async function handleDeleteConversation(req, res, decoded) {
  const { conversationId } = await readJsonBody(req);
  if (!conversationId) return res.status(400).json({ error: 'conversationId is required' });

  const { db } = await connectToDatabase();
  const conv = await db.collection('finance_conversations').findOne({
    _id: new ObjectId(conversationId), userId: decoded.userId,
  });
  if (!conv) return res.status(403).json({ error: 'Forbidden' });

  await db.collection('finance_conversations').deleteOne({ _id: conv._id });
  await db.collection('finance_messages').deleteMany({ conversationId });

  return res.status(200).json({ success: true });
}

async function handleDocuments(req, res, decoded) {
  const { db } = await connectToDatabase();
  const docs = await db.collection('finance_documents')
    .find({ userId: decoded.userId })
    .sort({ uploadedAt: -1 })
    .project({ _id: 1, fileName: 1, documentType: 1, uploadedAt: 1, 'extractedData.period': 1 })
    .toArray();

  // Build a summary string per doc
  const documents = docs.map(d => ({
    _id: d._id,
    fileName: d.fileName,
    documentType: d.documentType,
    uploadedAt: d.uploadedAt,
    summary: d.documentType === 'salary_slip'
      ? `Salary slip${d.extractedData?.period ? ' — ' + d.extractedData.period : ''}`
      : d.documentType === 'bank_statement'
        ? `Bank statement${d.extractedData?.period ? ' — ' + d.extractedData.period : ''}`
        : `Document${d.extractedData?.period ? ' — ' + d.extractedData.period : ''}`,
  }));

  return res.status(200).json({ documents });
}

async function handleDeleteDocument(req, res, decoded) {
  const { documentId } = await readJsonBody(req);
  if (!documentId) return res.status(400).json({ error: 'documentId is required' });

  const { db } = await connectToDatabase();
  const userId = decoded.userId;

  // Verify ownership
  const doc = await db.collection('finance_documents').findOne({
    _id: new ObjectId(documentId), userId,
  });
  if (!doc) return res.status(403).json({ error: 'Forbidden' });

  await db.collection('finance_documents').deleteOne({ _id: doc._id });

  // Recalculate profile from remaining documents
  const remaining = await db.collection('finance_documents')
    .find({ userId })
    .sort({ uploadedAt: -1 })
    .toArray();

  if (remaining.length === 0) {
    await db.collection('finance_profiles').deleteOne({ userId });
    return res.status(200).json({ success: true, profile: null });
  }

  // Aggregate: use most recent values across all remaining docs
  let monthlyIncome = null, annualIncome = null, totalExpenses = null, currentBalance = null;
  for (const d of remaining) {
    const e = d.extractedData || {};
    if (monthlyIncome  == null && e.income?.monthly)   monthlyIncome  = e.income.monthly;
    if (annualIncome   == null && e.income?.annual)    annualIncome   = e.income.annual;
    if (totalExpenses  == null && e.expenses?.total)   totalExpenses  = e.expenses.total;
    if (currentBalance == null && e.balance != null)   currentBalance = e.balance;
  }

  const profileUpdate = {
    userId,
    documentsCount: remaining.length,
    lastUpdated: new Date(),
  };
  if (monthlyIncome  != null) profileUpdate.monthlyIncome  = monthlyIncome;
  if (annualIncome   != null) profileUpdate.annualIncome   = annualIncome;
  if (totalExpenses  != null) profileUpdate.totalExpenses  = totalExpenses;
  if (currentBalance != null) profileUpdate.currentBalance = currentBalance;

  await db.collection('finance_profiles').updateOne(
    { userId },
    { $set: profileUpdate, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );

  const updatedProfile = await db.collection('finance_profiles').findOne({ userId });
  return res.status(200).json({ success: true, profile: updatedProfile });
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
    if (action === 'upload'              && req.method === 'POST')   return await handleUpload(req, res, decoded);
    if (action === 'conversations'       && req.method === 'GET')    return await handleConversations(req, res, decoded);
    if (action === 'messages'            && req.method === 'GET')    return await handleMessages(req, res, decoded);
    if (action === 'profile'             && req.method === 'GET')    return await handleProfile(req, res, decoded);
    if (action === 'delete-conversation' && req.method === 'DELETE') return await handleDeleteConversation(req, res, decoded);
    if (action === 'documents'           && req.method === 'GET')    return await handleDocuments(req, res, decoded);
    if (action === 'delete-document'     && req.method === 'DELETE') return await handleDeleteDocument(req, res, decoded);

    return res.status(400).json({ error: 'Unknown action or method' });
  } catch (err) {
    console.error('Finance handler error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
