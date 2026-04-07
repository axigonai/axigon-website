const Busboy = require('busboy');
const { connectToDatabase } = require('../../lib/db');
const { verifyToken } = require('../../lib/auth');

// Disable Vercel's default body parser so we can handle multipart ourselves
module.exports.config = { api: { bodyParser: false } };

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach((cookie) => {
    const [key, ...val] = cookie.trim().split('=');
    cookies[key.trim()] = val.join('=');
  });
  return cookies;
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
      fileStream.on('data', (chunk) => chunks.push(chunk));
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

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

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

function buildSummary(documentType, extracted) {
  const fmt = (n) => n ? `Rs.${Number(n).toLocaleString('en-IN')}` : null;

  if (documentType === 'salary_slip') {
    const income = fmt(extracted.income?.monthly);
    return income
      ? `Salary slip processed — monthly income of ${income} recorded`
      : 'Salary slip processed — income details extracted';
  }
  if (documentType === 'bank_statement') {
    const balance = fmt(extracted.balance);
    return balance
      ? `Bank statement processed — current balance of ${balance} recorded`
      : 'Bank statement processed — transaction history extracted';
  }
  const period = extracted.period ? ` for ${extracted.period}` : '';
  return `Financial document processed${period} — data extracted successfully`;
}

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

  // Cookie auth
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const userId = decoded.userId;

  // Parse uploaded file
  let fileBuffer, fileName, mimeType;
  try {
    ({ fileBuffer, fileName, mimeType } = await parseMultipart(req));
  } catch (err) {
    return res.status(400).json({ error: err.message || 'File upload failed' });
  }

  // Validate file type
  const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  if (!allowed.includes(mimeType)) {
    return res.status(400).json({ error: `Unsupported file type: ${mimeType}. Upload a PDF or image.` });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

  // Send to Gemini Vision
  let extracted;
  try {
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: EXTRACTION_PROMPT },
            { inlineData: { mimeType, data: fileBuffer.toString('base64') } },
          ],
        }],
        generationConfig: { maxOutputTokens: 2048, temperature: 0.1 },
      }),
    });

    const geminiData = await geminiRes.json();

    if (!geminiRes.ok) {
      const errMsg = geminiData?.error?.message || 'Gemini API error';
      return res.status(502).json({ error: `Gemini error: ${errMsg}` });
    }

    const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Strip markdown code fences if present
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    extracted = JSON.parse(cleaned);
  } catch (err) {
    return res.status(502).json({ error: `Failed to extract data from document: ${err.message}` });
  }

  const documentType = extracted.documentType || 'other';

  // Save to MongoDB
  try {
    const { db } = await connectToDatabase();

    // Save individual document record
    await db.collection('finance_documents').insertOne({
      userId,
      fileName,
      documentType,
      extractedData: extracted,
      uploadedAt: new Date(),
    });

    // Upsert finance profile (one per user)
    const profileUpdate = {
      userId,
      lastUpdated: new Date(),
    };
    if (extracted.income?.monthly) profileUpdate.monthlyIncome = extracted.income.monthly;
    if (extracted.income?.annual) profileUpdate.annualIncome = extracted.income.annual;
    if (extracted.expenses?.total) profileUpdate.totalExpenses = extracted.expenses.total;
    if (extracted.balance != null) profileUpdate.currentBalance = extracted.balance;

    await db.collection('finance_profiles').updateOne(
      { userId },
      {
        $set: profileUpdate,
        $inc: { documentsCount: 1 },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );
  } catch (err) {
    return res.status(500).json({ error: `Database error: ${err.message}` });
  }

  return res.status(200).json({
    success: true,
    documentType,
    summary: buildSummary(documentType, extracted),
  });
};
