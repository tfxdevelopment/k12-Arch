Just imagination. Here you are. Welcome. I'm Sean Keyes. Oh, I'm sorry. So where's the helmet? Who made first contact? # K12Arch.Tools

.NET utilities and libraries for implementing enterprise and application architecture patterns.

## Overview

K12Arch.Tools is a comprehensive .NET library that provides:
- 🏗️ **Pattern Implementations**: Ready-to-use implementations of common architecture patterns
- ✅ **Base Classes**: Abstract classes for repositories, handlers, and services
- 🔧 **Utilities**: Helper classes and extension methods
- 📚 **Examples**: Sample implementations and templates

## Installation

```bash
dotnet add package K12Arch.Tools
```

Or via NuGet Package Manager:
```
Install-Package K12Arch.Tools
```

## Quick Start

### Using Pattern Implementations

```csharp
using K12Arch.Tools.Patterns.Repository;
using K12Arch.Tools.Patterns.EventBus;
using K12Arch.Tools.Patterns.CQRS;

// Repository Pattern
public class UserRepository : Repository<User, Guid>
{
    public UserRepository(DbContext context) : base(context) { }
    
    public async Task<User?> FindByEmail(string email)
    {
        return await FindAsync(u => u.Email == email);
    }
}

// Event Bus
var eventBus = new EventBus();
eventBus.Subscribe<UserCreatedEvent>(async (@event) =>
{
    Console.WriteLine($"User created: {@event.UserId}");
});

// CQRS Command Handler
public class CreateUserCommandHandler : ICommandHandler<CreateUserCommand, Guid>
{
    public async Task<Guid> Handle(CreateUserCommand command, CancellationToken cancellationToken)
    {
        var user = new User(command.Email, command.Name);
        await _repository.SaveAsync(user);
        return user.Id;
    }
}
```

## Features

### Pattern Implementations

#### Repository Pattern

```csharp
using K12Arch.Tools.Patterns.Repository;

public class ProductRepository : Repository<Product, Guid>
{
    public ProductRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<Product>> GetByCategory(string category)
    {
        return await FindAllAsync(p => p.Category == category);
    }

    public async Task<Product?> GetWithReviews(Guid id)
    {
        return await Query()
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Id == id);
    }
}
```

#### Event Bus

```csharp
using K12Arch.Tools.Patterns.EventBus;

// Define events
public record OrderPlacedEvent(Guid OrderId, decimal Total);

// Subscribe to events
eventBus.Subscribe<OrderPlacedEvent>(async (@event) =>
{
    await SendOrderConfirmationEmail(@event.OrderId);
});

// Publish events
await eventBus.PublishAsync(new OrderPlacedEvent(orderId, total));
```

#### CQRS

```csharp
using K12Arch.Tools.Patterns.CQRS;

// Commands
public record CreateOrderCommand(string CustomerId, List<OrderItemDto> Items) : ICommand<Guid>;

public class CreateOrderCommandHandler : ICommandHandler<CreateOrderCommand, Guid>
{
    private readonly IOrderRepository _repository;
    private readonly IEventBus _eventBus;

    public async Task<Guid> Handle(CreateOrderCommand command, CancellationToken cancellationToken)
    {
        var order = new Order(command.CustomerId);
        foreach (var item in command.Items)
        {
            order.AddItem(item.ProductId, item.Quantity, item.Price);
        }

        await _repository.SaveAsync(order);
        await _eventBus.PublishAsync(new OrderCreatedEvent(order.Id, order.Total));

        return order.Id;
    }
}

// Queries
public record GetOrdersByCustomerQuery(string CustomerId, int Page, int PageSize) : IQuery<PagedResult<OrderDto>>;

public class GetOrdersByCustomerQueryHandler : IQueryHandler<GetOrdersByCustomerQuery, PagedResult<OrderDto>>
{
    private readonly IReadDbContext _context;

    public async Task<PagedResult<OrderDto>> Handle(GetOrdersByCustomerQuery query, CancellationToken cancellationToken)
    {
        var orders = await _context.Orders
            .Where(o => o.CustomerId == query.CustomerId)
            .OrderByDescending(o => o.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(o => new OrderDto { /* ... */ })
            .ToListAsync(cancellationToken);

        return new PagedResult<OrderDto>(orders, query.Page, query.PageSize);
    }
}
```

## Dependency Injection Setup

```csharp
// Program.cs or Startup.cs
services.AddK12ArchTools(options =>
{
    options.UseEventBus();
    options.UseCQRS();
    options.UseRepositories();
});

// Register repositories
services.AddScoped<IUserRepository, UserRepository>();
services.AddScoped<IOrderRepository, OrderRepository>();

// Register command handlers
services.AddScoped<ICommandHandler<CreateUserCommand, Guid>, CreateUserCommandHandler>();
services.AddScoped<ICommandHandler<CreateOrderCommand, Guid>, CreateOrderCommandHandler>();

// Register query handlers
services.AddScoped<IQueryHandler<GetOrdersByCustomerQuery, PagedResult<OrderDto>>, GetOrdersByCustomerQueryHandler>();
```

## Architecture Patterns

### Clean Architecture Support
- Domain entities with encapsulation
- Use case handlers
- Repository abstractions
- Dependency injection integration

### CQRS Support
- Command handlers
- Query handlers
- Command/Query buses via MediatR integration
- Event handlers

### Event-Driven Support
- Event bus implementation
- Event sourcing utilities
- Domain events
- Integration events

### Repository Pattern
- Generic repository base class
- Specification pattern support
- Unit of work pattern
- Query builder helpers

## API Reference

### IRepository<TEntity, TKey>

```csharp
public interface IRepository<TEntity, TKey> where TEntity : class
{
    Task<TEntity?> GetByIdAsync(TKey id, CancellationToken cancellationToken = default);
    Task<IEnumerable<TEntity>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<TEntity?> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);
    Task<IEnumerable<TEntity>> FindAllAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);
    Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default);
    Task UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);
    Task DeleteAsync(TKey id, CancellationToken cancellationToken = default);
    Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null, CancellationToken cancellationToken = default);
}
```

### IEventBus

```csharp
public interface IEventBus
{
    void Subscribe<TEvent>(Func<TEvent, Task> handler) where TEvent : class;
    void Unsubscribe<TEvent>(Func<TEvent, Task> handler) where TEvent : class;
    Task PublishAsync<TEvent>(TEvent @event, CancellationToken cancellationToken = default) where TEvent : class;
}
```

### ICommandHandler<TCommand, TResult>

```csharp
public interface ICommandHandler<in TCommand, TResult> where TCommand : ICommand<TResult>
{
    Task<TResult> Handle(TCommand command, CancellationToken cancellationToken);
}
```

### IQueryHandler<TQuery, TResult>

```csharp
public interface IQueryHandler<in TQuery, TResult> where TQuery : IQuery<TResult>
{
    Task<TResult> Handle(TQuery query, CancellationToken cancellationToken);
}
```

## Examples

See the examples directory for complete implementations:
- Clean Architecture API
- CQRS E-commerce System
- Event-Driven Microservices
- Repository Pattern Demo

## Testing

```csharp
// Example unit test
public class CreateUserCommandHandlerTests
{
    [Fact]
    public async Task Handle_ValidCommand_CreatesUser()
    {
        // Arrange
        var mockRepository = new Mock<IUserRepository>();
        var mockEventBus = new Mock<IEventBus>();
        var handler = new CreateUserCommandHandler(mockRepository.Object, mockEventBus.Object);
        var command = new CreateUserCommand("test@example.com", "Test User");

        // Act
        var userId = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotEqual(Guid.Empty, userId);
        mockRepository.Verify(r => r.AddAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()), Times.Once);
    }
}
```

## Contributing

See the main repository [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](../../LICENSE) for details.

## Related

- [Wiki Documentation](../wiki)
- [Examples](../../examples/)

## Supported Frameworks

- .NET 8.0+
- Entity Framework Core 8.0+
- ASP.NET Core 8.0+
