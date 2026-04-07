const { connectToDatabase } = require('../../lib/db');
const AgentModel = require('../../models/Agent');
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const agentModel = new AgentModel(db);
    await agentModel.createIndexes();

    // GET - public, no auth required
    if (req.method === 'GET') {
      const { domain, search } = req.query;

      let agents;
      if (search) {
        agents = await agentModel.search(search);
      } else if (domain) {
        agents = await agentModel.getByDomain(domain);
      } else {
        agents = await agentModel.getAll();
      }

      return res.status(200).json({ agents, count: agents.length });
    }

    // POST - requires cookie auth
    if (req.method === 'POST') {
      const cookies = parseCookies(req.headers.cookie);
      const token = cookies.token;

      if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      try {
        verifyToken(token);
      } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const { name, domain, description, features, pricing, capabilities } = req.body;

      if (!name || !domain || !description) {
        return res.status(400).json({ error: 'Name, domain, and description are required' });
      }

      const agent = await agentModel.create({ name, domain, description, features, pricing, capabilities });

      return res.status(201).json({ message: 'Agent created successfully', agent });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Agents API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
