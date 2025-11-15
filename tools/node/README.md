# @k12-arch/node-tools

Node.js utilities and tools for implementing enterprise and application architecture patterns.

## Overview

This package provides:
- 🏗️ **Pattern Implementations**: Ready-to-use implementations of common architecture patterns
- ✅ **Validators**: Validate your architecture against best practices
- 🔧 **Generators**: CLI tools to scaffold pattern implementations
- 📚 **Examples**: Sample implementations and templates

## Installation

```bash
npm install @k12-arch/node-tools
```

## Quick Start

### Using Pattern Implementations

```javascript
const { Repository, EventBus, CQRS } = require('@k12-arch/node-tools');

// Repository Pattern
class UserRepository extends Repository {
  constructor(database) {
    super(database, 'users');
  }
}

// Event Bus
const eventBus = new EventBus();
eventBus.subscribe('UserCreated', (event) => {
  console.log('User created:', event.data);
});

// CQRS Command Handler
const { CommandBus } = CQRS;
const commandBus = new CommandBus();
commandBus.register('CreateUser', new CreateUserHandler());
```

### CLI Tools

```bash
# Generate a clean architecture project structure
k12-arch generate clean-architecture my-project

# Generate a microservice
k12-arch generate microservice user-service

# Validate architecture
k12-arch validate ./src

# List available patterns
k12-arch list-patterns
```

## Features

### Pattern Implementations

#### Repository Pattern
```javascript
const { Repository } = require('@k12-arch/node-tools/patterns');

class ProductRepository extends Repository {
  async findByCategory(category) {
    return this.findWhere({ category });
  }
}
```

#### Event Bus
```javascript
const { EventBus } = require('@k12-arch/node-tools/patterns');

const bus = new EventBus();
bus.subscribe('OrderPlaced', async (event) => {
  // Handle event
});
bus.publish('OrderPlaced', { orderId: '123' });
```

#### CQRS
```javascript
const { CommandBus, QueryBus } = require('@k12-arch/node-tools/patterns/cqrs');

// Commands
commandBus.register('CreateOrder', new CreateOrderHandler());
await commandBus.execute(new CreateOrderCommand(data));

// Queries
queryBus.register('GetOrders', new GetOrdersHandler());
const orders = await queryBus.execute(new GetOrdersQuery());
```

### Validators

```javascript
const { ArchitectureValidator } = require('@k12-arch/node-tools/validators');

const validator = new ArchitectureValidator();
const results = await validator.validate('./src', {
  checkDependencies: true,
  checkLayerViolations: true,
  checkCircularDependencies: true
});

console.log(results.violations);
```

### Generators

```bash
# Generate Clean Architecture structure
k12-arch generate clean-architecture my-app

# Generate CQRS boilerplate
k12-arch generate cqrs-module orders

# Generate Repository
k12-arch generate repository User --database mongodb

# Generate Event Handler
k12-arch generate event-handler OrderPlaced
```

## Architecture Patterns

### Clean Architecture
- Domain entities
- Use cases
- Interface adapters
- Dependency injection setup

### CQRS
- Command handlers
- Query handlers
- Command/Query buses
- Event handlers

### Event-Driven
- Event bus
- Event store
- Saga pattern support
- Event sourcing utilities

### Repository Pattern
- Base repository
- Specification pattern
- Unit of work
- Query builder

## API Reference

### Repository Class

```javascript
class Repository {
  async save(entity)
  async findById(id)
  async findAll()
  async findWhere(criteria)
  async update(id, data)
  async delete(id)
}
```

### EventBus Class

```javascript
class EventBus {
  subscribe(eventType, handler)
  unsubscribe(eventType, handler)
  publish(eventType, data)
  publishAsync(eventType, data)
}
```

### CommandBus Class

```javascript
class CommandBus {
  register(commandName, handler)
  execute(command)
}
```

## Examples

See the [examples](./examples/) directory for complete implementations:
- [Clean Architecture API](./examples/clean-architecture-api/)
- [CQRS E-commerce](./examples/cqrs-ecommerce/)
- [Event-Driven Microservices](./examples/event-driven-microservices/)
- [Repository Pattern Demo](./examples/repository-demo/)

## Configuration

Create a `.k12-arch.json` file in your project root:

```json
{
  "architecture": "clean-architecture",
  "patterns": ["cqrs", "repository", "event-driven"],
  "validation": {
    "checkDependencies": true,
    "checkLayerViolations": true,
    "allowedDependencies": {
      "domain": [],
      "application": ["domain"],
      "infrastructure": ["domain", "application"],
      "presentation": ["application"]
    }
  }
}
```

## Contributing

See the main repository [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](../../LICENSE) for details.

## Related

- [Wiki Documentation](../../wiki/)
- [.NET Tools](../dotnet/)
- [Examples](../../examples/)
