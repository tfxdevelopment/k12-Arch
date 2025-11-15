/**
 * User Entity
 * Represents a user in the system with validation and business logic
 */

class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
    this.isActive = true;
  }

  /**
   * Validate user data
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Valid email is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if email format is valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Deactivate the user
   */
  deactivate() {
    this.isActive = false;
  }

  /**
   * Activate the user
   */
  activate() {
    this.isActive = true;
  }

  /**
   * Update user information
   */
  updateInfo(name, email) {
    if (name) this.name = name;
    if (email && this.isValidEmail(email)) {
      this.email = email;
    }
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      isActive: this.isActive
    };
  }
}

module.exports = User;
