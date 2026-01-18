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
    // Connect to database
    const { db } = await connectToDatabase();
    const agentModel = new AgentModel(db);
    await agentModel.createIndexes();

    // GET - Retrieve all agents or search
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

      return res.status(200).json({
        agents,
        count: agents.length
      });
    }

    // POST - Create new agent (requires authentication)
    if (req.method === 'POST') {
      // Verify authentication
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Access token required' });
      }

      verifyToken(token); // Will throw if invalid

      const { name, domain, description, features, pricing, capabilities } = req.body;

      // Validation
      if (!name || !domain || !description) {
        return res.status(400).json({ error: 'Name, domain, and description are required' });
      }

      const agent = await agentModel.create({
        name,
        domain,
        description,
        features,
        pricing,
        capabilities
      });

      return res.status(201).json({
        message: 'Agent created successfully',
        agent
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Agents API error:', error);
    
    if (error.message === 'Invalid or expired token') {
      return res.status(403).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};
