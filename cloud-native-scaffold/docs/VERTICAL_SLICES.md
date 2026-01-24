# Vertical Slice Architecture Guide

## What is Vertical Slice Architecture?

Vertical Slice Architecture organizes code by **features** or **use cases** rather than technical layers. Each feature is a self-contained "slice" that includes everything needed to fulfill a specific user request.

### Traditional Layered Architecture

```
Controllers/
├── EnrollmentController.cs
├── ProgramsController.cs
└── AdminController.cs

Services/
├── EnrollmentService.cs
├── ProgramsService.cs
└── AdminService.cs

Repositories/
├── EnrollmentRepository.cs
├── ProgramsRepository.cs
└── AdminRepository.cs

Models/
├── EnrollmentModel.cs
├── ProgramModel.cs
└── AdminModel.cs
```

**Problems:**
- Feature code scattered across multiple folders
- Hard to find all code related to a feature
- Changes ripple across layers
- Tight coupling between layers
- Merge conflicts when multiple developers work on same layer

### Vertical Slice Architecture

```
Features/
├── SubmitEnrollment/
│   ├── SubmitEnrollmentCommand.cs
│   ├── SubmitEnrollmentValidator.cs
│   ├── SubmitEnrollmentHandler.cs
│   ├── SubmitEnrollmentEndpoint.cs
│   └── README.md
├── GetEnrollmentApplication/
│   ├── GetEnrollmentApplicationQuery.cs
│   ├── GetEnrollmentApplicationHandler.cs
│   └── GetEnrollmentApplicationEndpoint.cs
└── ApproveEnrollment/
    ├── ApproveEnrollmentCommand.cs
    ├── ApproveEnrollmentValidator.cs
    ├── ApproveEnrollmentHandler.cs
    └── ApproveEnrollmentEndpoint.cs
```

**Benefits:**
- All code for a feature in one place
- Easy to locate and modify features
- Reduced merge conflicts
- Independent testing
- Clear feature boundaries

## Anatomy of a Vertical Slice

Let's examine the `SubmitEnrollment` feature as an example.

### 1. Command (or Query)

**Purpose**: Represents the intent/request

```csharp
// Features/SubmitEnrollment/SubmitEnrollmentCommand.cs
using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;

public sealed record SubmitEnrollmentCommand : ICommand<Result<Guid>>
{
    public Guid HouseholdId { get; init; }
    public Guid ProgramId { get; init; }
    public Guid StudentId { get; init; }
    public Dictionary<string, object> Responses { get; init; } = [];
}
```

**Key Points:**
- Immutable record type
- Implements `ICommand<TResult>` (CQRS)
- Returns `Result<T>` (no exceptions for expected failures)
- Contains only the data needed for this operation

### 2. Validator

**Purpose**: Ensures request data is valid

```csharp
// Features/SubmitEnrollment/SubmitEnrollmentValidator.cs
using FluentValidation;

public sealed class SubmitEnrollmentValidator : AbstractValidator<SubmitEnrollmentCommand>
{
    public SubmitEnrollmentValidator()
    {
        RuleFor(x => x.HouseholdId)
            .NotEmpty()
            .WithMessage("Household ID is required");

        RuleFor(x => x.ProgramId)
            .NotEmpty()
            .WithMessage("Program ID is required");

        RuleFor(x => x.StudentId)
            .NotEmpty()
            .WithMessage("Student ID is required");

        RuleFor(x => x.Responses)
            .NotNull()
            .Must(r => r.Count > 0)
            .WithMessage("At least one response is required");
    }
}
```

**Key Points:**
- Validates at the feature level
- Clear error messages
- Prevents invalid data from reaching business logic
- Automatically invoked by MediatR pipeline behavior

### 3. Handler

**Purpose**: Contains the business logic

```csharp
// Features/SubmitEnrollment/SubmitEnrollmentHandler.cs
public sealed class SubmitEnrollmentHandler
    : ICommandHandler<SubmitEnrollmentCommand, Result<Guid>>
{
    private readonly ILogger<SubmitEnrollmentHandler> _logger;
    private readonly IEventBus _eventBus;
    private readonly DaprClient _daprClient;

    public async Task<Result<Guid>> Handle(
        SubmitEnrollmentCommand command,
        CancellationToken cancellationToken)
    {
        try
        {
            // 1. Create domain entity
            var applicationId = Guid.NewGuid();

            // 2. Persist to database/state store
            await _daprClient.SaveStateAsync(...);

            // 3. Publish integration event
            await _eventBus.PublishAsync(new EnrollmentApplicationSubmittedEvent
            {
                ApplicationId = applicationId,
                HouseholdId = command.HouseholdId,
                ProgramId = command.ProgramId
            });

            // 4. Return success result
            return Result.Success(applicationId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error submitting enrollment");
            return Result.Failure<Guid>(Error.Failure(...));
        }
    }
}
```

**Key Points:**
- Single Responsibility: only handles this command
- Uses dependency injection for infrastructure
- Returns `Result<T>` instead of throwing exceptions
- Publishes events for async processing
- Structured logging

### 4. Endpoint

**Purpose**: Maps HTTP requests to commands/queries

```csharp
// Features/SubmitEnrollment/SubmitEnrollmentEndpoint.cs
public static class SubmitEnrollmentEndpoint
{
    public static IEndpointRouteBuilder MapSubmitEnrollmentEndpoint(
        this IEndpointRouteBuilder builder)
    {
        builder.MapPost("/api/enrollment/applications", async (
            [FromBody] SubmitEnrollmentRequest request,
            [FromServices] ISender sender,
            CancellationToken cancellationToken) =>
        {
            var command = request.Adapt<SubmitEnrollmentCommand>();
            var result = await sender.Send(command, cancellationToken);

            return result.IsSuccess
                ? Results.Ok(new { ApplicationId = result.Value })
                : Results.BadRequest(new { Error = result.Error.Message });
        })
        .WithName("SubmitEnrollment")
        .WithTags("Enrollment")
        .WithOpenApi()
        .Produces<object>(StatusCodes.Status200OK)
        .Produces<object>(StatusCodes.Status400BadRequest);

        return builder;
    }
}
```

**Key Points:**
- Minimal API style (clean, concise)
- Extension method pattern
- OpenAPI metadata for documentation
- Maps DTO to command
- Uses MediatR `ISender` to dispatch command

### 5. Registration

Register the endpoint in `Program.cs`:

```csharp
// Program.cs
app.MapSubmitEnrollmentEndpoint();
```

**That's it!** The feature is complete and self-contained.

## CQRS in Vertical Slices

### Commands (Write Operations)

Commands modify state:

```csharp
// Command
public record CreateProgramCommand : ICommand<Result<Guid>>
{
    public string ProgramName { get; init; }
    public decimal FundingAmount { get; init; }
}

// Handler
public class CreateProgramHandler : ICommandHandler<CreateProgramCommand, Result<Guid>>
{
    public async Task<Result<Guid>> Handle(...)
    {
        // Create program
        // Save to database
        // Publish event
        return Result.Success(programId);
    }
}
```

### Queries (Read Operations)

Queries retrieve data without side effects:

```csharp
// Query
public record GetEnrollmentApplicationQuery(Guid ApplicationId)
    : IQuery<Result<EnrollmentApplicationDto>>;

// Handler
public class GetEnrollmentApplicationHandler
    : IQueryHandler<GetEnrollmentApplicationQuery, Result<EnrollmentApplicationDto>>
{
    public async Task<Result<EnrollmentApplicationDto>> Handle(...)
    {
        // Retrieve from read model (optimized for queries)
        // Map to DTO
        return Result.Success(dto);
    }
}
```

**Benefits of CQRS in Slices:**
- Optimize reads and writes independently
- Different data models for read/write
- Simpler code (no shared logic between reads/writes)
- Better scalability (scale reads and writes separately)

## Adding a New Feature

### Step 1: Create Feature Folder

```bash
mkdir -p src/Api/K12.Api.Enrollment/Features/CancelEnrollment
```

### Step 2: Create Command

```csharp
// CancelEnrollmentCommand.cs
public record CancelEnrollmentCommand : ICommand<Result>
{
    public Guid ApplicationId { get; init; }
    public string CancellationReason { get; init; } = string.Empty;
}
```

### Step 3: Create Validator

```csharp
// CancelEnrollmentValidator.cs
public class CancelEnrollmentValidator : AbstractValidator<CancelEnrollmentCommand>
{
    public CancelEnrollmentValidator()
    {
        RuleFor(x => x.ApplicationId).NotEmpty();
        RuleFor(x => x.CancellationReason)
            .NotEmpty()
            .MaximumLength(500);
    }
}
```

### Step 4: Create Handler

```csharp
// CancelEnrollmentHandler.cs
public class CancelEnrollmentHandler : ICommandHandler<CancelEnrollmentCommand, Result>
{
    public async Task<Result> Handle(
        CancelEnrollmentCommand command,
        CancellationToken cancellationToken)
    {
        // Load application
        // Validate can be cancelled
        // Update status
        // Publish event
        return Result.Success();
    }
}
```

### Step 5: Create Endpoint

```csharp
// CancelEnrollmentEndpoint.cs
public static class CancelEnrollmentEndpoint
{
    public static IEndpointRouteBuilder MapCancelEnrollmentEndpoint(
        this IEndpointRouteBuilder builder)
    {
        builder.MapDelete("/api/enrollment/applications/{id:guid}", async (
            Guid id,
            [FromBody] CancelEnrollmentRequest request,
            ISender sender,
            CancellationToken ct) =>
        {
            var command = new CancelEnrollmentCommand
            {
                ApplicationId = id,
                CancellationReason = request.Reason
            };

            var result = await sender.Send(command, ct);

            return result.IsSuccess
                ? Results.NoContent()
                : Results.BadRequest(result.Error);
        })
        .WithName("CancelEnrollment")
        .WithTags("Enrollment");

        return builder;
    }
}
```

### Step 6: Register Endpoint

```csharp
// Program.cs
app.MapCancelEnrollmentEndpoint();
```

Done! The feature is complete.

## Best Practices

### 1. Keep Slices Independent

❌ **Bad**: Sharing logic between slices
```csharp
// DON'T: Shared service used by multiple slices
public class EnrollmentService
{
    public void SubmitEnrollment() { }
    public void CancelEnrollment() { }
    public void ApproveEnrollment() { }
}
```

✅ **Good**: Each slice is self-contained
```csharp
// DO: Each handler contains its own logic
public class SubmitEnrollmentHandler { }
public class CancelEnrollmentHandler { }
public class ApproveEnrollmentHandler { }
```

**Exception**: Shared infrastructure (IEventBus, IRepository) is fine

### 2. Use CQRS

Separate commands (writes) from queries (reads):

```csharp
// Commands modify state
public record SubmitEnrollmentCommand : ICommand<Result<Guid>> { }

// Queries retrieve data
public record GetEnrollmentApplicationQuery : IQuery<Result<DTO>> { }
```

### 3. Return Results, Not Exceptions

❌ **Bad**: Using exceptions for control flow
```csharp
public async Task<Guid> Handle(...)
{
    if (!isValid)
        throw new ValidationException("Invalid data");

    return applicationId;
}
```

✅ **Good**: Using Result pattern
```csharp
public async Task<Result<Guid>> Handle(...)
{
    if (!isValid)
        return Result.Failure<Guid>(Error.Validation(...));

    return Result.Success(applicationId);
}
```

### 4. Validate Early

Use FluentValidation to catch invalid requests:

```csharp
public class SubmitEnrollmentValidator : AbstractValidator<SubmitEnrollmentCommand>
{
    public SubmitEnrollmentValidator()
    {
        RuleFor(x => x.HouseholdId).NotEmpty();
        // Validation runs BEFORE handler
    }
}
```

### 5. Keep DTOs Separate

Don't reuse domain models as DTOs:

```csharp
// Domain model (internal)
public class EnrollmentApplication : AggregateRoot<Guid>
{
    // Rich domain logic
}

// DTO (external contract)
public record EnrollmentApplicationDto
{
    // Simple data structure
}
```

### 6. Use Events for Decoupling

Publish events for side effects:

```csharp
public async Task<Result<Guid>> Handle(...)
{
    // Primary operation
    await _repository.AddAsync(application);

    // Side effects via events
    await _eventBus.PublishAsync(new EnrollmentSubmittedEvent
    {
        ApplicationId = applicationId
    });
}
```

## When to Use Vertical Slices

### ✅ Use Vertical Slices When:

- Building microservices or modular monoliths
- Features have distinct business logic
- Team works on multiple features in parallel
- You want clear feature boundaries
- CQRS is beneficial

### ❌ Consider Traditional Layers When:

- Very simple CRUD applications
- Heavy code reuse across features
- Small team working on single feature at a time

## Comparison: Vertical Slices vs. Layered Architecture

| Aspect | Vertical Slices | Layered Architecture |
|--------|-----------------|----------------------|
| **Organization** | By feature | By technical layer |
| **Coupling** | Low (features independent) | High (layers depend on each other) |
| **Cohesion** | High (feature code together) | Low (feature code scattered) |
| **Testability** | High (test feature in isolation) | Medium (need to mock layers) |
| **Scalability** | High (scale features independently) | Medium (scale entire layer) |
| **Learning Curve** | Medium (new pattern for some) | Low (familiar to most) |
| **CQRS** | Natural fit | Awkward fit |
| **Merge Conflicts** | Low | High |

## Advanced Patterns

### Shared Kernel

For truly shared logic, create a shared kernel:

```
Shared/
└── K12.BuildingBlocks/
    ├── CQRS/
    ├── Domain/
    ├── Results/
    └── Events/
```

### Feature Modules

Group related features:

```
Features/
├── Enrollment/
│   ├── SubmitEnrollment/
│   ├── CancelEnrollment/
│   └── ApproveEnrollment/
└── Programs/
    ├── CreateProgram/
    ├── UpdateProgram/
    └── DeleteProgram/
```

### Cross-Cutting Concerns

Use MediatR behaviors:

```csharp
// Validation behavior (runs before all handlers)
public class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
{
    public async Task<TResponse> Handle(...)
    {
        // Validate
        // Call next
        return await next();
    }
}

// Logging behavior
public class LoggingBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
{
    public async Task<TResponse> Handle(...)
    {
        _logger.LogInformation("Handling {Request}", typeof(TRequest).Name);
        var response = await next();
        _logger.LogInformation("Handled {Request}", typeof(TRequest).Name);
        return response;
    }
}
```

## Resources

- [Vertical Slice Architecture (Jimmy Bogard)](https://www.jimmybogard.com/vertical-slice-architecture/)
- [CQRS Pattern (Martin Fowler)](https://martinfowler.com/bliki/CQRS.html)
- [MediatR Documentation](https://github.com/jbogard/MediatR)
- [FluentValidation](https://docs.fluentvalidation.net/)

---

**Next**: Explore [Azure Well-Architected Framework Alignment](AZURE_WELL_ARCHITECTED.md)
