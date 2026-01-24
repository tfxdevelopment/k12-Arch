# K12 Cloud-Native Architecture Overview

## Introduction

This document provides a comprehensive overview of the K12 MyPortal cloud-native architecture, explaining the design decisions, patterns, and technologies used.

## Architecture Principles

### 1. Cloud-Native First

The architecture is designed to run natively in the cloud with:
- **Containerization**: All services are containerized
- **Orchestration**: Managed by container orchestrators (Azure Container Apps, Kubernetes)
- **Distributed**: Microservices-based architecture
- **Scalable**: Horizontal scaling by default
- **Resilient**: Built-in retry, circuit breaker, and health checks

### 2. Domain-Driven Design (DDD)

- **Bounded Contexts**: Each API represents a bounded context (Enrollment, Programs, Admin)
- **Aggregates**: Business entities with clear boundaries
- **Domain Events**: Events represent important business occurrences
- **Ubiquitous Language**: Consistent terminology across code and business

### 3. SOLID Principles

- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Interfaces can be substituted
- **Interface Segregation**: Small, focused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

### 4. Separation of Concerns

- **Presentation**: API endpoints (HTTP concerns)
- **Application**: Business logic (handlers)
- **Domain**: Core business rules (entities, aggregates)
- **Infrastructure**: External services (database, messaging, storage)

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway / APIM                        │
│                   (Authentication, Rate Limiting)                │
└────────────┬──────────────┬──────────────┬───────────────────────┘
             │              │              │
    ┌────────▼────────┐ ┌──▼──────────┐ ┌─▼──────────┐
    │ Enrollment API  │ │ Programs API│ │ Admin API  │
    │  (Port 5001)    │ │ (Port 5002) │ │(Port 5003) │
    └────────┬────────┘ └──┬──────────┘ └─┬──────────┘
             │              │              │
             │   ┌──────────▼───────────┐  │
             │   │   Dapr Sidecars      │  │
             └───┤ (State, Pub/Sub)     ├──┘
                 └──────────┬───────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
    │ Azure   │      │   Azure   │     │   Azure   │
    │   SQL   │      │  Service  │     │   Blob    │
    │Database │      │    Bus    │     │  Storage  │
    └─────────┘      └───────────┘     └───────────┘
```

## Technology Stack Rationale

### .NET 10 (Preview)

**Why:**
- Latest .NET preview with cutting-edge features
- Modern, high-performance runtime
- Cross-platform (Linux containers)
- Native AOT compilation improvements
- Excellent cloud integration
- Preview of upcoming LTS features

### .NET Aspire 10 (Preview)

**Why:**
- Simplifies local development orchestration
- Service discovery built-in
- Automatic OpenTelemetry configuration
- Azure deployment manifests generation
- Interactive dashboard for debugging

**Alternative**: Tye (deprecated) → Aspire is the modern successor

### Dapr (Distributed Application Runtime)

**Why:**
- Cloud-agnostic building blocks
- Swap implementations without code changes (Redis → Cosmos DB)
- Built-in retry, circuit breaker, timeout
- Simplified service-to-service calls
- mTLS encryption automatic

**Alternatives:**
- **Spring Cloud** (Java ecosystem)
- **Istio/Linkerd** (service mesh, heavier)

### Dapper (Micro-ORM)

**Why:**
- High performance (faster than EF Core)
- Direct SQL control
- Minimal overhead
- Explicit queries (no hidden N+1 problems)

**Alternatives:**
- **Entity Framework Core** (more features, slower)
- **NHibernate** (heavyweight)

### FluentValidation

**Why:**
- Strongly-typed validation rules
- Composable validators
- Clear error messages
- Testable validation logic

**Alternatives:**
- **Data Annotations** (less powerful)
- **Manual validation** (error-prone)

### Mapster

**Why:**
- Fastest object mapper (source generation)
- Simple configuration
- Minimal reflection

**Alternatives:**
- **AutoMapper** (more features, slower)
- **Manual mapping** (verbose)

### MediatR

**Why:**
- Implements CQRS naturally
- Decouples request/response from handlers
- Pipeline behaviors (logging, validation, etc.)
- Clean, testable code

**Alternatives:**
- **Mediator pattern manually** (more boilerplate)
- **Direct service calls** (tight coupling)

## Architectural Patterns

### 1. Vertical Slice Architecture

Each feature contains all its code in one place:

```
Features/SubmitEnrollment/
├── SubmitEnrollmentCommand.cs
├── SubmitEnrollmentValidator.cs
├── SubmitEnrollmentHandler.cs
└── SubmitEnrollmentEndpoint.cs
```

**Benefits:**
- High cohesion
- Easy to locate feature code
- Independent development
- Reduced merge conflicts

See [Vertical Slices Guide](VERTICAL_SLICES.md) for details.

### 2. CQRS (Command Query Responsibility Segregation)

**Commands** (writes):
```csharp
ICommand<Result<Guid>> SubmitEnrollmentCommand
```

**Queries** (reads):
```csharp
IQuery<Result<DTO>> GetEnrollmentApplicationQuery
```

**Benefits:**
- Optimize reads/writes independently
- Different data models
- Simplified logic

### 3. Event-Driven Architecture

**Domain Events** (in-process):
```csharp
public record EnrollmentSubmittedEvent : DomainEventBase { }
```

**Integration Events** (cross-service):
```csharp
public record EnrollmentApplicationSubmittedEvent : IntegrationEventBase { }
```

**Benefits:**
- Loose coupling
- Async processing
- Scalability
- Audit trail

### 4. Result Pattern

Instead of exceptions:

```csharp
public async Task<Result<Guid>> Handle(...)
{
    if (!isValid)
        return Result.Failure<Guid>(Error.Validation(...));

    return Result.Success(applicationId);
}
```

**Benefits:**
- Explicit error handling
- Performance (no stack unwinding)
- Type-safe errors

### 5. Repository Pattern

Abstract data access:

```csharp
public interface IRepository<TAggregate, TId>
{
    Task<TAggregate?> GetByIdAsync(TId id);
    Task AddAsync(TAggregate aggregate);
}
```

**Benefits:**
- Swap implementations (Dapper → EF Core)
- Testable (mock repositories)
- Consistent interface

### 6. Unit of Work Pattern

Manage transactions:

```csharp
public interface IUnitOfWork
{
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
}
```

## Project Structure

```
K12.CloudNative/
├── src/
│   ├── K12.AppHost/                    # Aspire orchestration
│   ├── K12.ServiceDefaults/            # Shared configuration
│   ├── Api/
│   │   ├── K12.Api.Enrollment/         # Enrollment bounded context
│   │   ├── K12.Api.Programs/           # Programs bounded context
│   │   └── K12.Api.Admin/              # Admin bounded context
│   ├── Shared/
│   │   ├── K12.BuildingBlocks/         # CQRS, Domain, Results, Events
│   │   └── K12.Contracts/              # Shared DTOs
│   └── Infrastructure/
│       ├── K12.Infrastructure/         # Core abstractions
│       └── K12.Infrastructure.Azure/   # Azure implementations
└── tests/
    ├── K12.Api.Enrollment.Tests/
    └── K12.IntegrationTests/
```

## Data Flow

### Command Flow (Write)

```
1. HTTP Request → API Endpoint
2. Map DTO → Command
3. Validate Command (FluentValidation)
4. MediatR Dispatch → Handler
5. Handler:
   - Create/Update Aggregate
   - Save to Database (Repository)
   - Publish Domain Events
   - Return Result
6. Map Result → HTTP Response
7. Publish Integration Event (EventBus/Dapr)
```

### Query Flow (Read)

```
1. HTTP Request → API Endpoint
2. Map DTO → Query
3. MediatR Dispatch → Handler
4. Handler:
   - Query Database (Dapper)
   - Map to DTO
   - Return Result
5. Map Result → HTTP Response
```

### Event Flow

```
1. Handler Publishes Integration Event
2. Dapr Pub/Sub → Azure Service Bus / Redis
3. Subscribing Services Receive Event
4. Event Handler Processes Event
5. May trigger additional commands/queries
```

## Deployment Architecture

### Local Development

```
Docker Compose
├── SQL Server (port 1433)
├── Redis (port 6379)
├── Azurite (ports 10000-10002)
├── Zipkin (port 9411)
└── Dapr Placement (port 50006)

.NET Aspire AppHost
├── Enrollment API (port 5001)
│   └── Dapr Sidecar (3501, 50001)
├── Programs API (port 5002)
│   └── Dapr Sidecar (3502, 50002)
└── Admin API (port 5003)
    └── Dapr Sidecar (3503, 50003)
```

### Azure Production

```
Azure Resources
├── Azure Container Apps
│   ├── Enrollment API (scaled 1-10 instances)
│   ├── Programs API (scaled 1-10 instances)
│   └── Admin API (scaled 1-10 instances)
├── Azure SQL Database (Standard/Premium)
├── Azure Service Bus (Standard/Premium)
├── Azure Cosmos DB (for Dapr state)
├── Azure Blob Storage (for documents)
├── Azure Key Vault (for secrets)
├── Azure Application Insights (observability)
└── Azure API Management (gateway)
```

## Observability

### Distributed Tracing

- **OpenTelemetry**: Traces across services
- **Jaeger/Zipkin**: Local visualization
- **Azure Application Insights**: Production

### Metrics

- **Prometheus**: Metrics collection
- **Azure Monitor**: Production metrics
- Custom business metrics

### Logging

- **Structured Logging**: Serilog/Microsoft.Extensions.Logging
- **Correlation IDs**: Trace requests across services
- **Azure Log Analytics**: Centralized logging

## Security

### Authentication

- **Azure Entra ID B2C**: External users (families, schools, providers)
- **Azure Entra ID**: Internal users (SEAA staff)
- **JWT Tokens**: API authentication

### Authorization

- **Role-Based Access Control (RBAC)**: K12.Admin, School.Admin, etc.
- **Custom Security Attributes**: Fine-grained access (parentReadWrite, etc.)
- **Row-Level Security (RLS)**: Database-level authorization

### Secrets Management

- **Local**: Dapr file-based secrets
- **Production**: Azure Key Vault

### Network Security

- **TLS 1.2+**: All traffic encrypted
- **mTLS**: Dapr service-to-service
- **Private Endpoints**: Azure resources not publicly exposed

## Scalability

### Horizontal Scaling

- **Azure Container Apps**: Auto-scale based on HTTP requests, CPU, memory
- **Stateless Services**: Any instance can handle any request
- **Distributed State**: Dapr state store (Cosmos DB)

### Database Scaling

- **Read Replicas**: Scale reads independently
- **Sharding**: Partition data by tenant (if needed)
- **Caching**: Redis for frequently accessed data

### Message Processing

- **Competing Consumers**: Multiple instances process messages
- **Partitioned Topics**: Service Bus partitions for parallel processing

## Testing Strategy

### Unit Tests

- **Handler Tests**: Test business logic in isolation
- **Validator Tests**: Test validation rules
- **Repository Tests**: Test data access (in-memory DB)

### Integration Tests

- **API Tests**: Test full request/response flow
- **Testcontainers**: Spin up real SQL Server, Redis
- **Dapr Tests**: Test Dapr component integration

### Load Tests

- **k6 / Artillery**: Simulate high load
- **Azure Load Testing**: Production-like testing

## Next Steps

1. **Authentication**: Add Azure Entra ID integration
2. **Authorization**: Implement custom security attributes
3. **Database**: Create SQL migrations
4. **Additional Features**: Implement more vertical slices
5. **Testing**: Add comprehensive test coverage
6. **CI/CD**: Set up Azure DevOps pipelines
7. **Monitoring**: Configure Application Insights

## Resources

- [Vertical Slice Architecture](VERTICAL_SLICES.md)
- [Azure Well-Architected Framework Alignment](AZURE_WELL_ARCHITECTED.md)
- [Dapr Documentation](https://docs.dapr.io/)
- [.NET Aspire Documentation](https://learn.microsoft.com/en-us/dotnet/aspire/)
