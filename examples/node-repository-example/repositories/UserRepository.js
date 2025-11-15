/**
 * UserRepository
 * Handles data access for User entities
 * Extends the base Repository pattern from k12-arch tools
 */

const User = require('../entities/User');

class UserRepository {
  constructor() {
    // In-memory storage for demo purposes
    // In production, this would be a database connection
    this.users = new Map();
    this.currentId = 1;
  }

  /**
   * Save a new user
   */
  async save(user) {
    if (!user.id) {
      user.id = this.generateId();
    }
    
    const validation = user.validate();
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    this.users.set(user.id, user);
    return user;
  }

  /**
   * Find user by ID
   */
  async findById(id) {
    return this.users.get(id) || null;
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  /**
   * Find all users
   */
  async findAll(options = {}) {
    const users = Array.from(this.users.values());
    
    // Filter by active status if specified
    let filtered = users;
    if (options.activeOnly) {
      filtered = users.filter(u => u.isActive);
    }

    // Apply pagination
    const limit = options.limit || 100;
    const offset = options.offset || 0;
    
    return filtered.slice(offset, offset + limit);
  }

  /**
   * Find users matching criteria
   */
  async findWhere(criteria) {
    const users = Array.from(this.users.values());
    return users.filter(user => {
      return Object.keys(criteria).every(key => {
        return user[key] === criteria[key];
      });
    });
  }

  /**
   * Update a user
   */
  async update(id, data) {
    const user = await this.findById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    // Update fields
    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.isActive !== undefined) user.isActive = data.isActive;

    // Validate after update
    const validation = user.validate();
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    this.users.set(id, user);
    return user;
  }

  /**
   * Delete a user
   */
  async delete(id) {
    const exists = this.users.has(id);
    if (exists) {
      this.users.delete(id);
    }
    return exists;
  }

  /**
   * Count total users
   */
  async count(criteria = {}) {
    if (Object.keys(criteria).length === 0) {
      return this.users.size;
    }
    
    const matching = await this.findWhere(criteria);
    return matching.length;
  }

  /**
   * Check if user exists
   */
  async exists(id) {
    return this.users.has(id);
  }

  /**
   * Generate a unique ID
   */
  generateId() {
    return `user_${this.currentId++}`;
  }

  /**
   * Clear all users (for testing)
   */
  clear() {
    this.users.clear();
    this.currentId = 1;
  }
}

module.exports = UserRepository;
