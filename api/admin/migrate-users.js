const { connectToDatabase } = require('../../lib/db');

module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Guard with ADMIN_SECRET
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'ADMIN_SECRET not configured' });
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { db } = await connectToDatabase();
    const users = db.collection('users');

    const result = await users.updateMany(
      { accountType: { $exists: false } },
      { $set: { accountType: 'business' } }
    );

    return res.status(200).json({
      message: 'Migration complete',
      updatedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    });
  } catch (err) {
    console.error('Migration error:', err.message);
    return res.status(500).json({ error: 'Migration failed', detail: err.message });
  }
};
