# Submit Enrollment Feature

This feature demonstrates **Vertical Slice Architecture** where all code related to a single feature is organized together.

## Structure

```
SubmitEnrollment/
├── SubmitEnrollmentCommand.cs      # Command (CQRS Write)
├── SubmitEnrollmentValidator.cs    # FluentValidation validator
├── SubmitEnrollmentHandler.cs      # Command handler (business logic)
├── SubmitEnrollmentEndpoint.cs     # API endpoint (Minimal API)
└── README.md                       # Feature documentation
```

## Flow

1. **HTTP Request** → `SubmitEnrollmentEndpoint`
2. **Validation** → `SubmitEnrollmentValidator` (FluentValidation)
3. **Command** → `SubmitEnrollmentCommand` (MediatR)
4. **Handler** → `SubmitEnrollmentHandler`
   - Validates business rules
   - Saves to database (or Dapr state store)
   - Publishes integration event
5. **Response** → Result pattern with success/failure

## SOLID Principles

- **Single Responsibility**: Each class has one reason to change
  - Validator only validates
  - Handler only handles business logic
  - Endpoint only handles HTTP concerns

- **Open/Closed**: Extensible via MediatR behaviors (logging, validation, etc.)

- **Liskov Substitution**: Uses interfaces (`ICommand`, `ICommandHandler`)

- **Interface Segregation**: Small, focused interfaces

- **Dependency Inversion**: Depends on abstractions (`IEventBus`, `ILogger`)

## Cloud-Native Features

- **Dapr State Management**: Stores application state
- **Dapr Pub/Sub**: Publishes integration events
- **OpenTelemetry**: Automatic tracing and metrics
- **Health Checks**: Endpoint health monitoring
- **Resilience**: Built-in retry, circuit breaker (via Aspire)

## Azure Well-Architected Framework

- **Reliability**: Retry logic, health checks
- **Security**: JWT authentication, authorization (to be added)
- **Cost Optimization**: Serverless scaling with Dapr
- **Operational Excellence**: Structured logging, distributed tracing
- **Performance Efficiency**: Minimal allocations, async/await
