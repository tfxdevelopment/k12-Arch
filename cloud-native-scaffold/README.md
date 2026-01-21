# K12 MyPortal - Cloud-Native Architecture Scaffold

A modern, cloud-native microservices architecture for the K12 MyPortal system using .NET 9, .NET Aspire, Dapr, and Azure services.

## Overview

This project demonstrates a production-ready cloud-native architecture following enterprise best practices:

- **Vertical Slice Architecture** - Feature-focused code organization
- **CQRS Pattern** - Command Query Responsibility Segregation
- **Event-Driven Architecture** - Asynchronous communication via events
- **Clean Architecture** - Clear separation of concerns
- **SOLID Principles** - Maintainable, testable, extensible code
- **Cloud-Native First** - Built for Azure with local development support

## Architecture Highlights

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Runtime** | .NET 9 | Modern, high-performance platform |
| **Orchestration** | .NET Aspire | Local development & service orchestration |
| **Cloud Platform** | Dapr | Cloud-native building blocks (portable) |
| **Database** | Azure SQL / SQL Server | Relational data storage |
| **Caching/State** | Redis | Distributed cache & Dapr state store |
| **Messaging** | Azure Service Bus / Redis | Event-driven communication |
| **Storage** | Azure Blob Storage / Azurite | Document storage |
| **ORM** | Dapper | High-performance data access |
| **Validation** | FluentValidation | Request validation |
| **Mapping** | Mapster | Object-to-object mapping |
| **Observability** | OpenTelemetry | Distributed tracing & metrics |

### Project Structure

```
cloud-native-scaffold/
├── src/
│   ├── K12.AppHost/                    # .NET Aspire orchestration
│   ├── K12.ServiceDefaults/            # Shared Aspire configuration
│   ├── Api/
│   │   ├── K12.Api.Enrollment/         # Enrollment API (Vertical Slices)
│   │   ├── K12.Api.Programs/           # Programs API
│   │   └── K12.Api.Admin/              # Admin API
│   ├── Shared/
│   │   ├── K12.BuildingBlocks/         # Core abstractions (CQRS, Domain, Events)
│   │   └── K12.Contracts/              # Shared DTOs and contracts
│   └── Infrastructure/
│       ├── K12.Infrastructure/         # Core infrastructure (Dapr, messaging)
│       └── K12.Infrastructure.Azure/   # Azure-specific implementations
├── tests/
│   ├── K12.Api.Enrollment.Tests/
│   ├── K12.Api.Programs.Tests/
│   └── K12.IntegrationTests/
├── dapr/
│   ├── components/                     # Dapr component configurations
│   ├── config.yaml                     # Dapr runtime config
│   └── secrets/                        # Local secrets (gitignored)
├── docker-compose.yml                  # Infrastructure dependencies
└── docs/
    ├── ARCHITECTURE.md
    ├── AZURE_WELL_ARCHITECTED.md
    └── VERTICAL_SLICES.md
```

## Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Dapr CLI](https://docs.dapr.io/getting-started/install-dapr-cli/)
- [Make](https://www.gnu.org/software/make/) (optional, for Makefile commands)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cloud-native-scaffold
   ```

2. **Start infrastructure**
   ```bash
   make infra
   # Or manually:
   docker-compose up -d
   ```

3. **Initialize Dapr**
   ```bash
   dapr init
   ```

4. **Run with .NET Aspire** (Recommended)
   ```bash
   make aspire
   # Or:
   dotnet run --project src/K12.AppHost/K12.AppHost.csproj
   ```

5. **Access the applications**
   - **Aspire Dashboard**: https://localhost:17153
   - **Enrollment API**: https://localhost:5001/swagger
   - **Programs API**: https://localhost:5002/swagger
   - **Admin API**: https://localhost:5003/swagger
   - **Redis Commander**: http://localhost:8081
   - **Zipkin**: http://localhost:9411

### Alternative: Run with Dapr CLI

```bash
# Terminal 1 - Enrollment API
dapr run --app-id enrollment-api \
         --app-port 5001 \
         --dapr-http-port 3501 \
         --config ./dapr/config.yaml \
         --components-path ./dapr/components \
         -- dotnet run --project src/Api/K12.Api.Enrollment

# Terminal 2 - Programs API
dapr run --app-id programs-api \
         --app-port 5002 \
         --dapr-http-port 3502 \
         --config ./dapr/config.yaml \
         --components-path ./dapr/components \
         -- dotnet run --project src/Api/K12.Api.Programs
```

## Key Architectural Patterns

### 1. Vertical Slice Architecture

Each feature is self-contained with all its dependencies:

```
Features/SubmitEnrollment/
├── SubmitEnrollmentCommand.cs      # Command (CQRS Write)
├── SubmitEnrollmentValidator.cs    # Validation
├── SubmitEnrollmentHandler.cs      # Business logic
└── SubmitEnrollmentEndpoint.cs     # API endpoint
```

**Benefits:**
- High cohesion (related code together)
- Easy to find and modify features
- Reduced merge conflicts
- Clear feature boundaries

### 2. CQRS (Command Query Responsibility Segregation)

**Commands** (Write operations):
```csharp
public record SubmitEnrollmentCommand : ICommand<Result<Guid>>
{
    public Guid HouseholdId { get; init; }
    public Guid ProgramId { get; init; }
}
```

**Queries** (Read operations):
```csharp
public record GetEnrollmentApplicationQuery(Guid ApplicationId)
    : IQuery<Result<EnrollmentApplicationDto>>;
```

**Benefits:**
- Optimize reads and writes independently
- Clearer intent (command vs query)
- Better scalability
- Simpler models

### 3. Event-Driven Architecture

**Domain Events** (within service):
```csharp
public record EnrollmentSubmittedEvent : DomainEventBase
{
    public Guid ApplicationId { get; init; }
}
```

**Integration Events** (between services):
```csharp
public record EnrollmentApplicationSubmittedEvent : IntegrationEventBase
{
    public Guid ApplicationId { get; init; }
    public Guid HouseholdId { get; init; }
}
```

**Benefits:**
- Loose coupling between services
- Asynchronous processing
- Event sourcing capability
- Audit trail

### 4. Clean Architecture & SOLID

**Dependency Inversion**:
```csharp
// Abstraction
public interface IEventBus
{
    Task PublishAsync<TEvent>(TEvent @event, CancellationToken ct);
}

// Implementation
public class DaprEventBus : IEventBus
{
    // Dapr-specific implementation
}
```

**Single Responsibility**:
- Commands only represent intent
- Handlers only contain business logic
- Validators only validate
- Endpoints only handle HTTP

## Cloud-Native Features

### Dapr Building Blocks

1. **State Management**
   - Stores application state in Redis (local) or Cosmos DB (Azure)
   - Pluggable backends

2. **Pub/Sub**
   - Publishes integration events
   - Redis (local) or Azure Service Bus (production)

3. **Service Invocation**
   - Service-to-service communication with retry, timeout
   - mTLS encryption

4. **Secrets Management**
   - Local file (development)
   - Azure Key Vault (production)

5. **Observability**
   - Distributed tracing with OpenTelemetry
   - Metrics exportable to Azure Monitor

### .NET Aspire Benefits

1. **Service Orchestration**
   - Automatic service discovery
   - Dependency injection of connection strings
   - Built-in health checks

2. **Local Development**
   - Single `dotnet run` starts everything
   - Interactive dashboard
   - Live logs and metrics

3. **Deployment**
   - Generates deployment manifests
   - Container-ready
   - Azure-optimized

## Development Guide

### Adding a New Feature (Vertical Slice)

1. Create feature folder:
   ```bash
   mkdir -p src/Api/K12.Api.Enrollment/Features/MyFeature
   ```

2. Create command/query:
   ```csharp
   public record MyFeatureCommand : ICommand<Result<MyResult>>
   {
       public string Data { get; init; }
   }
   ```

3. Create validator:
   ```csharp
   public class MyFeatureValidator : AbstractValidator<MyFeatureCommand>
   {
       public MyFeatureValidator()
       {
           RuleFor(x => x.Data).NotEmpty();
       }
   }
   ```

4. Create handler:
   ```csharp
   public class MyFeatureHandler : ICommandHandler<MyFeatureCommand, Result<MyResult>>
   {
       public async Task<Result<MyResult>> Handle(...)
       {
           // Business logic here
       }
   }
   ```

5. Create endpoint:
   ```csharp
   public static class MyFeatureEndpoint
   {
       public static IEndpointRouteBuilder MapMyFeatureEndpoint(this IEndpointRouteBuilder builder)
       {
           builder.MapPost("/api/my-feature", async (...) => { ... });
           return builder;
       }
   }
   ```

6. Register in `Program.cs`:
   ```csharp
   app.MapMyFeatureEndpoint();
   ```

### Running Tests

```bash
# All tests
make test
# Or:
dotnet test

# Specific project
dotnet test tests/K12.Api.Enrollment.Tests

# With coverage
dotnet test --collect:"XPlat Code Coverage"
```

### Database Migrations

```bash
# Run migrations (example using DbUp or EF Core)
dotnet run --project src/Database.Migrations
```

## Deployment

### Azure Deployment

The project is designed for Azure deployment using:

1. **Azure Container Apps** - For API services
2. **Azure SQL Database** - Managed database
3. **Azure Service Bus** - Event messaging
4. **Azure Cosmos DB** - Dapr state store
5. **Azure Key Vault** - Secrets management
6. **Azure Monitor** - Observability

Deploy using:
```bash
# Using Aspire deployment manifest
azd init
azd up
```

Or using container registry:
```bash
docker build -t myregistry.azurecr.io/k12-enrollment-api:latest -f src/Api/K12.Api.Enrollment/Dockerfile .
docker push myregistry.azurecr.io/k12-enrollment-api:latest
```

## Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Azure Well-Architected Framework Alignment](docs/AZURE_WELL_ARCHITECTED.md)
- [Vertical Slice Architecture Guide](docs/VERTICAL_SLICES.md)
- [Dapr Configuration](dapr/README.md)

## Best Practices

### Security
- Use Azure Key Vault for production secrets
- Enable Managed Identity for Azure resources
- Implement authentication with Azure Entra ID
- Use HTTPS everywhere
- Validate all inputs with FluentValidation

### Performance
- Use Dapper for high-performance data access
- Implement caching with Redis
- Use async/await throughout
- Optimize database queries
- Use pagination for large datasets

### Reliability
- Implement retry policies (built into Aspire)
- Use circuit breakers
- Health checks on all services
- Graceful degradation
- Comprehensive logging

### Observability
- Structured logging with OpenTelemetry
- Distributed tracing across services
- Custom metrics for business events
- Azure Application Insights integration

## Contributing

1. Follow vertical slice architecture
2. Write tests for new features
3. Use FluentValidation for input validation
4. Follow SOLID principles
5. Document public APIs
6. Update README for architectural changes

## License

[Your License Here]

## Resources

- [.NET Aspire Documentation](https://learn.microsoft.com/en-us/dotnet/aspire/)
- [Dapr Documentation](https://docs.dapr.io/)
- [Azure Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/)
- [Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
