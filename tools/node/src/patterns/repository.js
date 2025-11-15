/**
 * Repository Pattern Implementation
 * Base class for data access repositories
 */

class Repository {
  /**
   * Create a new Repository
   * @param {Object} database - Database connection/client
   * @param {String} collectionName - Name of the collection/table
   */
  constructor(database, collectionName) {
    if (!database) {
      throw new Error('Database connection is required');
    }
    if (!collectionName) {
      throw new Error('Collection name is required');
    }
    
    this.database = database;
    this.collectionName = collectionName;
  }

  /**
   * Save an entity
   * @param {Object} entity - Entity to save
   * @returns {Promise<Object>} Saved entity
   */
  async save(entity) {
    if (!entity) {
      throw new Error('Entity is required');
    }
    
    // Default implementation - override in subclasses
    throw new Error('save() must be implemented by subclass');
  }

  /**
   * Find entity by ID
   * @param {String} id - Entity ID
   * @returns {Promise<Object|null>} Found entity or null
   */
  async findById(id) {
    if (!id) {
      throw new Error('ID is required');
    }
    
    throw new Error('findById() must be implemented by subclass');
  }

  /**
   * Find all entities
   * @param {Object} options - Query options (limit, offset, sort)
   * @returns {Promise<Array>} Array of entities
   */
  async findAll(options = {}) {
    throw new Error('findAll() must be implemented by subclass');
  }

  /**
   * Find entities matching criteria
   * @param {Object} criteria - Search criteria
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of matching entities
   */
  async findWhere(criteria, options = {}) {
    if (!criteria) {
      throw new Error('Criteria is required');
    }
    
    throw new Error('findWhere() must be implemented by subclass');
  }

  /**
   * Update an entity
   * @param {String} id - Entity ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Updated entity
   */
  async update(id, data) {
    if (!id) {
      throw new Error('ID is required');
    }
    if (!data) {
      throw new Error('Update data is required');
    }
    
    throw new Error('update() must be implemented by subclass');
  }

  /**
   * Delete an entity
   * @param {String} id - Entity ID
   * @returns {Promise<Boolean>} True if deleted
   */
  async delete(id) {
    if (!id) {
      throw new Error('ID is required');
    }
    
    throw new Error('delete() must be implemented by subclass');
  }

  /**
   * Count entities matching criteria
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Number>} Count of matching entities
   */
  async count(criteria = {}) {
    throw new Error('count() must be implemented by subclass');
  }

  /**
   * Check if entity exists
   * @param {String} id - Entity ID
   * @returns {Promise<Boolean>} True if exists
   */
  async exists(id) {
    if (!id) {
      throw new Error('ID is required');
    }
    
    const entity = await this.findById(id);
    return entity !== null;
  }
}

module.exports = Repository;
