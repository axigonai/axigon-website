const { ObjectId } = require('mongodb');

class LegalConversationModel {
  constructor(db) {
    this.collection = db.collection('legal_conversations');
  }

  async createIndexes() {
    await this.collection.createIndex({ userId: 1, updatedAt: -1 });
  }

  async create({ userId, title }) {
    const now = new Date();
    const doc = {
      userId,
      title: title.slice(0, 50),
      createdAt: now,
      updatedAt: now,
    };
    const result = await this.collection.insertOne(doc);
    return { ...doc, _id: result.insertedId };
  }

  async findByUser(userId) {
    return await this.collection
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();
  }

  async touch(conversationId) {
    await this.collection.updateOne(
      { _id: new ObjectId(conversationId) },
      { $set: { updatedAt: new Date() } }
    );
  }
}

module.exports = LegalConversationModel;
