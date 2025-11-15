/**
 * UserService
 * Business logic for user management
 * Uses UserRepository for data access
 */

const User = require('../entities/User');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Create a new user
   */
  async createUser(name, email) {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error(`User with email ${email} already exists`);
    }

    // Create new user entity
    const user = new User(null, name, email);

    // Validate
    const validation = user.validate();
    if (!validation.isValid) {
      throw new Error(`Invalid user data: ${validation.errors.join(', ')}`);
    }

    // Save through repository
    return await this.userRepository.save(user);
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    return user;
  }

  /**
   * Get all active users
   */
  async getActiveUsers() {
    return await this.userRepository.findAll({ activeOnly: true });
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const users = await this.userRepository.findAll({
      limit: pageSize,
      offset: offset
    });

    const totalCount = await this.userRepository.count();

    return {
      users,
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize)
    };
  }

  /**
   * Update user information
   */
  async updateUser(id, name, email) {
    const user = await this.getUserById(id);

    // If email is changing, check it's not already taken
    if (email && email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error(`Email ${email} is already taken`);
      }
    }

    // Update through repository
    return await this.userRepository.update(id, { name, email });
  }

  /**
   * Deactivate a user
   */
  async deactivateUser(id) {
    const user = await this.getUserById(id);
    user.deactivate();
    return await this.userRepository.update(id, { isActive: false });
  }

  /**
   * Activate a user
   */
  async activateUser(id) {
    const user = await this.getUserById(id);
    user.activate();
    return await this.userRepository.update(id, { isActive: true });
  }

  /**
   * Delete a user
   */
  async deleteUser(id) {
    const exists = await this.userRepository.exists(id);
    if (!exists) {
      throw new Error(`User with id ${id} not found`);
    }

    return await this.userRepository.delete(id);
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({ isActive: true });
    const inactiveUsers = totalUsers - activeUsers;

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers
    };
  }
}

module.exports = UserService;
