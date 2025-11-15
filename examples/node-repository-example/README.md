# Node.js Repository Pattern Example

This example demonstrates how to use the Repository pattern from @k12-arch/node-tools.

## Overview

A simple user management system using the Repository pattern to abstract data access.

## Structure

```
.
├── entities/
│   └── User.js          # Domain entity
├── repositories/
│   └── UserRepository.js # User repository implementation
├── services/
│   └── UserService.js   # Business logic
└── index.js             # Application entry point
```

## Running the Example

```bash
# Install dependencies
npm install

# Run the example
node index.js
```

## Features Demonstrated

- Repository pattern implementation
- Domain entity encapsulation
- Service layer using repositories
- In-memory data storage (for demo purposes)

## Code Structure

### Entity (User.js)
Domain object with business logic and validation.

### Repository (UserRepository.js)
Data access abstraction extending the base Repository class.

### Service (UserService.js)
Business logic that uses the repository.

### Application (index.js)
Wires everything together and demonstrates usage.

## Learning Points

1. **Separation of Concerns**: Business logic (service) is separate from data access (repository)
2. **Testability**: Easy to mock the repository for testing services
3. **Flexibility**: Can swap in-memory storage for a real database without changing service code
4. **Encapsulation**: Entity handles its own validation and business rules
