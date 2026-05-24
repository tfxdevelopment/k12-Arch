# Clean Architecture

**Category**: Application Architecture Pattern  
**Complexity**: Medium  
**Use Case**: Maintainable, testable applications with clear boundaries  

## Overview

Clean Architecture, introduced by Robert C. Martin (Uncle Bob), is an architectural pattern that emphasizes separation of concerns, independence of frameworks, testability, and independence of UI and database. The key principle is that business logic should be isolated from external concerns.

## Core Principles

### The Dependency Rule
**Dependencies point inward**. Source code dependencies must point only inward, toward higher-level policies. Nothing in an inner circle can know anything about something in an outer circle.

### Layers

```
┌─────────────────────────────────────────┐
│         Frameworks & Drivers            │  ← Outermost
│  (Web, DB, UI, External Interfaces)    │
├─────────────────────────────────────────┤
│       Interface Adapters                │
│  (Controllers, Presenters, Gateways)    │
├─────────────────────────────────────────┤
│        Application Business Rules       │
│         (Use Cases)                     │
├─────────────────────────────────────────┤
│      Enterprise Business Rules          │  ← Innermost
│         (Entities)                      │
└─────────────────────────────────────────┘
```

## Layer Descriptions

### 1. Entities (Enterprise Business Rules)
Core business objects that encapsulate enterprise-wide critical business rules.

```javascript
// Node.js Example
class User {
  constructor(id, email, name) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.createdAt = new Date();
  }

  isValid() {
    return this.email && this.email.includes('@') && this.name;
  }

  changeEmail(newEmail) {
    if (!newEmail.includes('@')) {
      throw new Error('Invalid email format');
    }
    this.email = newEmail;
  }
}
```

```csharp
// .NET Example
public class Order
{
    public Guid Id { get; private set; }
    public string CustomerId { get; private set; }
    private List<OrderItem> _items = new List<OrderItem>();
    public IReadOnlyList<OrderItem> Items => _items.AsReadOnly();
    
    public Order(string customerId)
    {
        Id = Guid.NewGuid();
        CustomerId = customerId;
    }

    public void AddItem(string productId, int quantity, decimal price)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive");
            
        _items.Add(new OrderItem(productId, quantity, price));
    }

    public decimal GetTotal()
    {
        return _items.Sum(item => item.Quantity * item.Price);
    }
}
```

### 2. Use Cases (Application Business Rules)
Application-specific business rules that orchestrate the flow of data to and from entities.

```javascript
// Node.js Use Case
class CreateUserUseCase {
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  async execute(userData) {
    // Validate input
    if (!userData.email || !userData.name) {
      throw new Error('Email and name are required');
    }

    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create entity
    const user = new User(
      this.generateId(),
      userData.email,
      userData.name
    );

    // Validate entity
    if (!user.isValid()) {
      throw new Error('Invalid user data');
    }

    // Save via repository
    await this.userRepository.save(user);

    // Send welcome email (side effect)
    await this.emailService.sendWelcomeEmail(user.email);

    return user;
  }

  generateId() {
    return `user_${Date.now()}_${Math.random()}`;
  }
}
```

```csharp
// .NET Use Case
public class PlaceOrderUseCase
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly IEventPublisher _eventPublisher;

    public PlaceOrderUseCase(
        IOrderRepository orderRepository,
        IProductRepository productRepository,
        IEventPublisher eventPublisher)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
        _eventPublisher = eventPublisher;
    }

    public async Task<OrderDto> Execute(PlaceOrderRequest request)
    {
        // Create order entity
        var order = new Order(request.CustomerId);

        // Add items
        foreach (var item in request.Items)
        {
            var product = await _productRepository.GetById(item.ProductId);
            if (product == null)
                throw new ProductNotFoundException(item.ProductId);

            order.AddItem(item.ProductId, item.Quantity, product.Price);
        }

        // Save order
        await _orderRepository.Save(order);

        // Publish domain event
        await _eventPublisher.Publish(new OrderPlacedEvent
        {
            OrderId = order.Id.ToString(),
            CustomerId = order.CustomerId,
            Total = order.GetTotal()
        });

        return MapToDto(order);
    }
}
```

### 3. Interface Adapters
Convert data from the format most convenient for use cases/entities to the format most convenient for external agencies.

```javascript
// Node.js Controller
class UserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  async create(req, res) {
    try {
      const userData = {
        email: req.body.email,
        name: req.body.name
      };

      const user = await this.createUserUseCase.execute(userData);

      res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

```csharp
// .NET Controller
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly PlaceOrderUseCase _placeOrderUseCase;

    public OrdersController(PlaceOrderUseCase placeOrderUseCase)
    {
        _placeOrderUseCase = placeOrderUseCase;
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> PlaceOrder([FromBody] PlaceOrderRequest request)
    {
        try
        {
            var order = await _placeOrderUseCase.Execute(request);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        catch (ProductNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
```

### 4. Frameworks & Drivers
Outermost layer containing frameworks, tools, and glue code.

```javascript
// Node.js - Database Implementation
class MongoUserRepository {
  constructor(mongoClient) {
    this.db = mongoClient.db('myapp');
    this.collection = this.db.collection('users');
  }

  async save(user) {
    await this.collection.insertOne({
      _id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    });
  }

  async findByEmail(email) {
    const doc = await this.collection.findOne({ email });
    if (!doc) return null;

    return new User(doc._id, doc.email, doc.name);
  }
}
```

```csharp
// .NET - Database Implementation
public class SqlOrderRepository : IOrderRepository
{
    private readonly ApplicationDbContext _context;

    public SqlOrderRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Save(Order order)
    {
        var entity = new OrderEntity
        {
            Id = order.Id,
            CustomerId = order.CustomerId,
            Items = order.Items.Select(i => new OrderItemEntity
            {
                ProductId = i.ProductId,
                Quantity = i.Quantity,
                Price = i.Price
            }).ToList()
        };

        _context.Orders.Add(entity);
        await _context.SaveChangesAsync();
    }

    public async Task<Order> GetById(Guid id)
    {
        var entity = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (entity == null) return null;

        var order = new Order(entity.CustomerId);
        // Reconstruct order from entity
        return order;
    }
}
```

## Project Structure Examples

### Node.js/TypeScript
```
src/
├── domain/
│   ├── entities/
│   │   ├── User.ts
│   │   └── Order.ts
│   └── repositories/
│       ├── IUserRepository.ts
│       └── IOrderRepository.ts
├── usecases/
│   ├── CreateUser/
│   │   ├── CreateUserUseCase.ts
│   │   └── CreateUserRequest.ts
│   └── PlaceOrder/
│       ├── PlaceOrderUseCase.ts
│       └── PlaceOrderRequest.ts
├── adapters/
│   ├── controllers/
│   │   ├── UserController.ts
│   │   └── OrderController.ts
│   ├── presenters/
│   │   └── UserPresenter.ts
│   └── repositories/
│       ├── MongoUserRepository.ts
│       └── SqlOrderRepository.ts
└── infrastructure/
    ├── web/
    │   ├── express-app.ts
    │   └── routes.ts
    ├── database/
    │   └── mongodb-connection.ts
    └── config/
        └── dependency-injection.ts
```

### .NET
```
Solution/
├── Domain/
│   ├── Entities/
│   │   ├── User.cs
│   │   └── Order.cs
│   └── Repositories/
│       ├── IUserRepository.cs
│       └── IOrderRepository.cs
├── Application/
│   ├── UseCases/
│   │   ├── CreateUser/
│   │   │   ├── CreateUserUseCase.cs
│   │   │   └── CreateUserRequest.cs
│   │   └── PlaceOrder/
│   │       ├── PlaceOrderUseCase.cs
│   │       └── PlaceOrderRequest.cs
│   └── DTOs/
│       ├── UserDto.cs
│       └── OrderDto.cs
├── Infrastructure/
│   ├── Persistence/
│   │   ├── ApplicationDbContext.cs
│   │   ├── UserRepository.cs
│   │   └── OrderRepository.cs
│   └── External/
│       └── EmailService.cs
└── WebApi/
    ├── Controllers/
    │   ├── UsersController.cs
    │   └── OrdersController.cs
    └── Program.cs
```

## Benefits

✅ **Testability**: Business logic isolated and easy to test  
✅ **Independence**: Framework-agnostic core logic  
✅ **Flexibility**: Easy to swap out UI, DB, or frameworks  
✅ **Maintainability**: Clear boundaries and responsibilities  
✅ **Scalability**: Easy to understand and extend  

## Challenges

⚠️ **Initial Complexity**: More files and abstractions  
⚠️ **Learning Curve**: Requires understanding of principles  
⚠️ **Overhead**: May be overkill for simple applications  
⚠️ **Discipline Required**: Easy to violate if not careful  

## Dependency Injection

```javascript
// Node.js Dependency Container
class DependencyContainer {
  constructor() {
    this.dependencies = new Map();
  }

  register(name, factory) {
    this.dependencies.set(name, factory);
  }

  resolve(name) {
    const factory = this.dependencies.get(name);
    return factory(this);
  }
}

// Setup
const container = new DependencyContainer();

container.register('userRepository', () => 
  new MongoUserRepository(mongoClient)
);

container.register('emailService', () => 
  new SendGridEmailService(apiKey)
);

container.register('createUserUseCase', (c) => 
  new CreateUserUseCase(
    c.resolve('userRepository'),
    c.resolve('emailService')
  )
);

container.register('userController', (c) =>
  new UserController(c.resolve('createUserUseCase'))
);
```

```csharp
// .NET Dependency Injection (Startup.cs)
public void ConfigureServices(IServiceCollection services)
{
    // Infrastructure
    services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

    // Repositories
    services.AddScoped<IUserRepository, SqlUserRepository>();
    services.AddScoped<IOrderRepository, SqlOrderRepository>();

    // Services
    services.AddScoped<IEmailService, SendGridEmailService>();

    // Use Cases
    services.AddScoped<CreateUserUseCase>();
    services.AddScoped<PlaceOrderUseCase>();

    services.AddControllers();
}
```

## Testing

```javascript
// Node.js Unit Test
describe('CreateUserUseCase', () => {
  it('should create a new user', async () => {
    // Arrange
    const mockRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue(undefined)
    };
    const mockEmailService = {
      sendWelcomeEmail: jest.fn().mockResolvedValue(undefined)
    };
    
    const useCase = new CreateUserUseCase(mockRepository, mockEmailService);

    // Act
    const user = await useCase.execute({
      email: 'test@example.com',
      name: 'Test User'
    });

    // Assert
    expect(user.email).toBe('test@example.com');
    expect(mockRepository.save).toHaveBeenCalledWith(user);
    expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(user.email);
  });
});
```

## Best Practices

1. **Keep entities pure**: No framework dependencies
2. **Use interfaces**: Define contracts in inner layers
3. **Dependency injection**: Always inject dependencies
4. **Single responsibility**: One use case per class
5. **Immutability**: Prefer immutable data structures
6. **Validation**: Validate at boundaries and in entities

## When to Use

✅ **Use When:**
- Building complex business applications
- Long-term maintainability is important
- Need to support multiple UIs or delivery mechanisms
- Business logic needs to be framework-independent
- Testing is a priority

❌ **Avoid When:**
- Building simple CRUD applications
- Rapid prototyping
- Team unfamiliar with architecture patterns
- Project has tight deadlines with small scope

## Related Patterns

- [Hexagonal Architecture](./hexagonal-architecture.md) (Ports and Adapters)
- [Onion Architecture](./onion-architecture.md)
- [Domain-Driven Design](./domain-driven-design.md)
- [CQRS Pattern](./cqrs.md)

## Further Reading

- "Clean Architecture" by Robert C. Martin
- "Clean Code" by Robert C. Martin
- [The Clean Architecture Blog Post](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- "Domain-Driven Design" by Eric Evans
