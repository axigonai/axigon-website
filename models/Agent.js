const { ObjectId } = require('mongodb');

class AgentModel {
  constructor(db) {
    this.collection = db.collection('agents');
  }

  /**
   * Create indexes for optimal queries
   */
  async createIndexes() {
    await this.collection.createIndex({ name: 1 });
    await this.collection.createIndex({ domain: 1 });
    await this.collection.createIndex({ isActive: 1 });
  }

  /**
   * Create a new AI agent
   */
  async create({ name, domain, description, features, pricing, capabilities }) {
    const agent = {
      name,
      domain,
      description,
      features: features || [],
      pricing: pricing || { model: 'contact', price: null },
      capabilities: capabilities || [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await this.collection.insertOne(agent);
    return { ...agent, _id: result.insertedId };
  }

  /**
   * Get all active agents
   */
  async getAll(filters = {}) {
    const query = { isActive: true, ...filters };
    return await this.collection.find(query).sort({ createdAt: -1 }).toArray();
  }

  /**
   * Get agent by ID
   */
  async getById(agentId) {
    return await this.collection.findOne({ _id: new ObjectId(agentId) });
  }

  /**
   * Get agents by domain
   */
  async getByDomain(domain) {
    return await this.collection.find({ domain, isActive: true }).toArray();
  }

  /**
   * Update agent
   */
  async update(agentId, updateData) {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(agentId) },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('Agent not found');
    }

    return result;
  }

  /**
   * Delete agent (soft delete)
   */
  async delete(agentId) {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(agentId) },
      { 
        $set: { 
          isActive: false, 
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('Agent not found');
    }

    return { message: 'Agent deleted successfully', agent: result };
  }

  /**
   * Search agents
   */
  async search(searchTerm) {
    return await this.collection.find({
      isActive: true,
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { domain: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    }).toArray();
  }
}

module.exports = AgentModel;
