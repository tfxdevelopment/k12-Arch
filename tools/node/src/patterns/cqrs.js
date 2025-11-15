/**
 * CQRS Pattern Implementation
 * Command Query Responsibility Segregation
 */

/**
 * Command Bus - Handles commands (write operations)
 */
class CommandBus {
  constructor() {
    this.handlers = new Map();
  }

  /**
   * Register a command handler
   * @param {String} commandName - Name of the command
   * @param {Object} handler - Handler object with handle() method
   */
  register(commandName, handler) {
    if (!commandName) {
      throw new Error('Command name is required');
    }
    if (!handler || typeof handler.handle !== 'function') {
      throw new Error('Handler must have a handle() method');
    }

    if (this.handlers.has(commandName)) {
      throw new Error(`Handler for ${commandName} is already registered`);
    }

    this.handlers.set(commandName, handler);
  }

  /**
   * Execute a command
   * @param {Object} command - Command object with name property
   * @returns {Promise<Object>} Command result
   */
  async execute(command) {
    if (!command || !command.name) {
      throw new Error('Command must have a name property');
    }

    const handler = this.handlers.get(command.name);
    if (!handler) {
      throw new Error(`No handler registered for command: ${command.name}`);
    }

    try {
      const result = await handler.handle(command);
      return result;
    } catch (error) {
      console.error(`Error executing command ${command.name}:`, error);
      throw error;
    }
  }

  /**
   * Check if a handler is registered
   * @param {String} commandName - Name of the command
   * @returns {Boolean} True if registered
   */
  isRegistered(commandName) {
    return this.handlers.has(commandName);
  }

  /**
   * Get all registered command names
   * @returns {Array<String>} Command names
   */
  getCommandNames() {
    return Array.from(this.handlers.keys());
  }
}

/**
 * Query Bus - Handles queries (read operations)
 */
class QueryBus {
  constructor() {
    this.handlers = new Map();
  }

  /**
   * Register a query handler
   * @param {String} queryName - Name of the query
   * @param {Object} handler - Handler object with handle() method
   */
  register(queryName, handler) {
    if (!queryName) {
      throw new Error('Query name is required');
    }
    if (!handler || typeof handler.handle !== 'function') {
      throw new Error('Handler must have a handle() method');
    }

    if (this.handlers.has(queryName)) {
      throw new Error(`Handler for ${queryName} is already registered`);
    }

    this.handlers.set(queryName, handler);
  }

  /**
   * Execute a query
   * @param {Object} query - Query object with name property
   * @returns {Promise<Object>} Query result
   */
  async execute(query) {
    if (!query || !query.name) {
      throw new Error('Query must have a name property');
    }

    const handler = this.handlers.get(query.name);
    if (!handler) {
      throw new Error(`No handler registered for query: ${query.name}`);
    }

    try {
      const result = await handler.handle(query);
      return result;
    } catch (error) {
      console.error(`Error executing query ${query.name}:`, error);
      throw error;
    }
  }

  /**
   * Check if a handler is registered
   * @param {String} queryName - Name of the query
   * @returns {Boolean} True if registered
   */
  isRegistered(queryName) {
    return this.handlers.has(queryName);
  }

  /**
   * Get all registered query names
   * @returns {Array<String>} Query names
   */
  getQueryNames() {
    return Array.from(this.handlers.keys());
  }
}

/**
 * Base Command class
 */
class Command {
  constructor(name, data = {}) {
    this.name = name;
    this.data = data;
    this.id = this.generateId();
    this.timestamp = new Date();
  }

  generateId() {
    return `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Base Query class
 */
class Query {
  constructor(name, parameters = {}) {
    this.name = name;
    this.parameters = parameters;
    this.id = this.generateId();
    this.timestamp = new Date();
  }

  generateId() {
    return `qry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Command Result
 */
class CommandResult {
  constructor(success, data = null, error = null) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.timestamp = new Date();
  }

  static success(data) {
    return new CommandResult(true, data, null);
  }

  static failure(error) {
    return new CommandResult(false, null, error);
  }
}

module.exports = {
  CommandBus,
  QueryBus,
  Command,
  Query,
  CommandResult
};
