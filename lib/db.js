const { MongoClient } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Use MONGO_CONNECTION_STRING if MONGODB_URI doesn't exist
  const uri = process.env.MONGO_CONNECTION_STRING || process.env.MONGODB_URI;
  
  if (!uri) {
    throw new Error('MongoDB connection string not found');
  }

  const client = await MongoClient.connect(uri, {
    maxPoolSize: 10,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  });

  const db = client.db('axigon');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

module.exports = { connectToDatabase };