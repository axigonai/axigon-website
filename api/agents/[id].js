const { connectToDatabase } = require('../../lib/db');
const AgentModel = require('../../models/Agent');
const { verifyToken } = require('../../lib/auth');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Extract agent ID from query or path
    const agentId = req.query.id || req.url.split('/').pop();

    if (!agentId || agentId.length !== 24) {
      return res.status(400).json({ error: 'Valid agent ID is required' });
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const agentModel = new AgentModel(db);

    // GET - Retrieve single agent
    if (req.method === 'GET') {
      const agent = await agentModel.getById(agentId);

      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      return res.status(200).json({ agent });
    }

    // Authentication required for UPDATE and DELETE
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    verifyToken(token); // Will throw if invalid

    // PUT/PATCH - Update agent
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

      return res.status(200).json({
        message: 'Agent updated successfully',
        agent: updatedAgent
      });
    }

    // DELETE - Delete agent (soft delete)
    if (req.method === 'DELETE') {
      const result = await agentModel.delete(agentId);

      return res.status(200).json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Agent API error:', error);
    
    if (error.message === 'Invalid or expired token') {
      return res.status(403).json({ error: error.message });
    }

    if (error.message === 'Agent not found') {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};
