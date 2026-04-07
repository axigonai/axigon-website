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
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const agentId = req.query.id || req.url.split('/').pop();

    if (!agentId || agentId.length !== 24) {
      return res.status(400).json({ error: 'Valid agent ID is required' });
    }

    const { db } = await connectToDatabase();
    const agentModel = new AgentModel(db);

    // GET - public, no auth required
    if (req.method === 'GET') {
      const agent = await agentModel.getById(agentId);

      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      return res.status(200).json({ agent });
    }

    // PUT, PATCH, DELETE - require cookie auth
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

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const { name, domain, description, features, pricing, capabilities } = req.body;

      const updateData = {};
      if (name) updateData.name = name;
      if (domain) updateData.domain = domain;
      if (description) updateData.description = description;
      if (features) updateData.features = features;
      if (pricing) updateData.pricing = pricing;
      if (capabilities) updateData.capabilities = capabilities;

      const updatedAgent = await agentModel.update(agentId, updateData);

      return res.status(200).json({ message: 'Agent updated successfully', agent: updatedAgent });
    }

    if (req.method === 'DELETE') {
      const result = await agentModel.delete(agentId);
      return res.status(200).json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Agent API error:', error);

    if (error.message === 'Agent not found') {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};
