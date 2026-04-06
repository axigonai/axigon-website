const { ObjectId } = require('mongodb');

class LegalMessageModel {
  constructor(db) {
    this.collection = db.collection('legal_messages');
  }

  async createIndexes() {
    await this.collection.createIndex({ conversationId: 1, createdAt: 1 });
  }

  async create({ conversationId, role, content }) {
    const doc = {
      conversationId: conversationId.toString(),
      role,
      content,
      createdAt: new Date(),
    };
    const result = await this.collection.insertOne(doc);
    return { ...doc, _id: result.insertedId };
  }

  async findByConversation(conversationId) {
    return await this.collection
      .find({ conversationId: conversationId.toString() })
      .sort({ createdAt: 1 })
      .toArray();
  }
}

module.exports = LegalMessageModel;
