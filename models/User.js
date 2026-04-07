const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

class UserModel {
  constructor(db) {
    this.collection = db.collection('users');
  }

  /**
   * Create indexes for optimal queries
   */
  async createIndexes() {
    await this.collection.createIndex({ email: 1 }, { unique: true });
  }

  /**
   * Create a new user
   */
  async create({ name, email, company, password, accountType = 'business' }) {
    // Check if user already exists
    const existingUser = await this.collection.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const user = {
      name,
      email,
      company,
      password: hashedPassword,
      accountType,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await this.collection.insertOne(user);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, _id: result.insertedId };
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    return await this.collection.findOne({ email });
  }

  /**
   * Find user by ID
   */
  async findById(userId) {
    return await this.collection.findOne({ _id: new ObjectId(userId) });
  }

  /**
   * Verify user password
   */
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Update user profile
   */
  async update(userId, updateData) {
    const { password, email, ...allowedUpdates } = updateData; // Prevent email/password update via this method
    
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          ...allowedUpdates, 
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('User not found');
    }

    // Return without password
    const { password: _, ...userWithoutPassword } = result;
    return userWithoutPassword;
  }

  /**
   * Get user profile (without password)
   */
  async getProfile(userId) {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = UserModel;
