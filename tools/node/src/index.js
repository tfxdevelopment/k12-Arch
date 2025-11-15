/**
 * @k12-arch/node-tools
 * Main entry point for architecture pattern utilities
 */

const Repository = require('./patterns/repository');
const EventBus = require('./patterns/event-bus');
const CQRS = require('./patterns/cqrs');

module.exports = {
  // Pattern Implementations
  Repository,
  EventBus,
  CQRS,
  
  // Validators
  validators: {
    ArchitectureValidator: require('./validators/architecture-validator'),
    DependencyValidator: require('./validators/dependency-validator')
  },
  
  // Generators
  generators: {
    CleanArchitectureGenerator: require('./generators/clean-architecture-generator'),
    CQRSGenerator: require('./generators/cqrs-generator')
  }
};
