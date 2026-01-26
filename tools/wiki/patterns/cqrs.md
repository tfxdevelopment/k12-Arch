# CQRS Pattern

**Category**: Application Architecture Pattern  
**Complexity**: Medium-High  
**Use Case**: Systems with complex queries and scalability requirements  

## Overview

Command Query Responsibility Segregation (CQRS) is a pattern that separates read and write operations for a data store. Commands (writes) and Queries (reads) use different models, optimized for their specific purpose.

## Core Concept

Traditional CRUD approach uses the same model for reads and writes:
```
Application ←→ Single Model ←→ Database
```

CQRS separates these concerns:
```
Application → Commands → Write Model → Database
           ← Queries  ← Read Model  ← Database/Cache
```

## Key Components

### 1. Commands
Operations that change state, never return data (except confirmation).

```javascript
// Node.js Command
class CreateOrderCommand {
  constructor(customerId, items) {
    this.commandId = generateId();
    this.customerId = customerId;
    this.items = items;
    this.timestamp = new Date();
  }
}

class CreateOrderCommandHandler {
  constructor(orderRepository, eventBus) {
    this.orderRepository = orderRepository;
    this.eventBus = eventBus;
  }

  async handle(command) {
    // Validate
    if (!command.items || command.items.length === 0) {
      throw new Error('Order must have items');
    }

    // Create aggregate
    const order = new Order(command.customerId);
    command.items.forEach(item => {
      order.addItem(item.productId, item.quantity, item.price);
    });

    // Persist
    await this.orderRepository.save(order);

    // Publish events
    await this.eventBus.publish(new OrderCreatedEvent({
      orderId: order.id,
      customerId: order.customerId,
      total: order.getTotal()
    }));

    return { success: true, orderId: order.id };
  }
}
```

```csharp
// .NET Command
public class CreateOrderCommand : ICommand
{
    public Guid CommandId { get; } = Guid.NewGuid();
    public string CustomerId { get; set; }
    public List<OrderItemDto> Items { get; set; }
}

public class CreateOrderCommandHandler : ICommandHandler<CreateOrderCommand>
{
    private readonly IOrderRepository _repository;
    private readonly IEventBus _eventBus;

    public CreateOrderCommandHandler(IOrderRepository repository, IEventBus eventBus)
    {
        _repository = repository;
        _eventBus = eventBus;
    }

    public async Task<CommandResult> Handle(CreateOrderCommand command)
    {
        var order = new Order(command.CustomerId);
        
        foreach (var item in command.Items)
        {
            order.AddItem(item.ProductId, item.Quantity, item.Price);
        }

        await _repository.Save(order);

        await _eventBus.Publish(new OrderCreatedEvent
        {
            OrderId = order.Id,
            CustomerId = order.CustomerId,
            Total = order.GetTotal()
        });

        return CommandResult.Success(order.Id);
    }
}
```

### 2. Queries
Operations that return data, never change state.

```javascript
// Node.js Query
class GetOrdersByCustomerQuery {
  constructor(customerId, page = 1, pageSize = 10) {
    this.customerId = customerId;
    this.page = page;
    this.pageSize = pageSize;
  }
}

class GetOrdersByCustomerQueryHandler {
  constructor(readDatabase) {
    this.readDatabase = readDatabase;
  }

  async handle(query) {
    // Query optimized read model
    const orders = await this.readDatabase.query(`
      SELECT 
        o.id,
        o.customer_id,
        o.total,
        o.status,
        o.created_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.customer_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [query.customerId, query.pageSize, (query.page - 1) * query.pageSize]);

    return {
      orders: orders,
      page: query.page,
      pageSize: query.pageSize,
      total: orders.length
    };
  }
}
```

```csharp
// .NET Query
public class GetOrdersByCustomerQuery : IQuery<OrderListDto>
{
    public string CustomerId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetOrdersByCustomerQueryHandler : IQueryHandler<GetOrdersByCustomerQuery, OrderListDto>
{
    private readonly IReadDbContext _readContext;

    public GetOrdersByCustomerQueryHandler(IReadDbContext readContext)
    {
        _readContext = readContext;
    }

    public async Task<OrderListDto> Handle(GetOrdersByCustomerQuery query)
    {
        var orders = await _readContext.OrderSummaries
            .Where(o => o.CustomerId == query.CustomerId)
            .OrderByDescending(o => o.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        return new OrderListDto
        {
            Orders = orders,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = await _readContext.OrderSummaries
                .CountAsync(o => o.CustomerId == query.CustomerId)
        };
    }
}
```

### 3. Read Model Synchronization

```javascript
// Node.js Event Handler - Updates Read Model
class OrderCreatedEventHandler {
  constructor(readDatabase) {
    this.readDatabase = readDatabase;
  }

  async handle(event) {
    // Update denormalized read model
    await this.readDatabase.execute(`
      INSERT INTO order_summaries (
        id, customer_id, total, status, created_at, item_count
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      event.orderId,
      event.customerId,
      event.total,
      'pending',
      event.timestamp,
      event.itemCount
    ]);

    // Update customer statistics
    await this.readDatabase.execute(`
      UPDATE customer_statistics
      SET total_orders = total_orders + 1,
          total_spent = total_spent + ?
      WHERE customer_id = ?
    `, [event.total, event.customerId]);
  }
}
```

```csharp
// .NET Event Handler - Updates Read Model
public class OrderCreatedEventHandler : IEventHandler<OrderCreatedEvent>
{
    private readonly IReadDbContext _readContext;

    public OrderCreatedEventHandler(IReadDbContext readContext)
    {
        _readContext = readContext;
    }

    public async Task Handle(OrderCreatedEvent @event)
    {
        // Update denormalized read model
        var orderSummary = new OrderSummary
        {
            Id = @event.OrderId,
            CustomerId = @event.CustomerId,
            Total = @event.Total,
            Status = OrderStatus.Pending,
            CreatedAt = @event.Timestamp,
            ItemCount = @event.ItemCount
        };

        _readContext.OrderSummaries.Add(orderSummary);
        await _readContext.SaveChangesAsync();
    }
}
```

## Benefits

✅ **Scalability**: Scale read and write sides independently  
✅ **Performance**: Optimize queries without affecting writes  
✅ **Flexibility**: Different databases for reads and writes  
✅ **Simplified Queries**: Denormalized read models  
✅ **Better Security**: Separate permissions for reads/writes  

## Challenges

⚠️ **Complexity**: More infrastructure and code  
⚠️ **Eventual Consistency**: Read model may lag behind writes  
⚠️ **Data Duplication**: Same data stored multiple ways  
⚠️ **Synchronization**: Keep read models in sync  
⚠️ **Learning Curve**: New patterns to understand  

## Implementation Patterns

### Simple CQRS (Same Database)
```javascript
// Write side uses normalized tables
// Read side uses views or materialized views

class OrderCommandRepository {
  async save(order) {
    await db.transaction(async (trx) => {
      await trx('orders').insert({
        id: order.id,
        customer_id: order.customerId,
        status: order.status
      });
      
      for (const item of order.items) {
        await trx('order_items').insert({
          order_id: order.id,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price
        });
      }
    });
  }
}

class OrderQueryRepository {
  async getOrderSummaries(customerId) {
    // Query from materialized view
    return await db('order_summaries_view')
      .where('customer_id', customerId)
      .select('*');
  }
}
```

### CQRS with Event Sourcing
```javascript
class EventSourcedOrderRepository {
  constructor(eventStore) {
    this.eventStore = eventStore;
  }

  async save(order) {
    const events = order.getUncommittedEvents();
    await this.eventStore.append(order.id, events);
    order.clearUncommittedEvents();
  }

  async load(orderId) {
    const events = await this.eventStore.getEvents(orderId);
    const order = new Order();
    order.loadFromHistory(events);
    return order;
  }
}

// Projection builds read model from events
class OrderSummaryProjection {
  constructor(readDatabase) {
    this.readDatabase = readDatabase;
  }

  async project(event) {
    switch (event.type) {
      case 'OrderCreated':
        await this.readDatabase.insert('order_summaries', {
          id: event.aggregateId,
          customer_id: event.data.customerId,
          total: event.data.total,
          status: 'pending'
        });
        break;
      
      case 'OrderShipped':
        await this.readDatabase.update('order_summaries')
          .where('id', event.aggregateId)
          .set({ status: 'shipped' });
        break;
    }
  }
}
```

### CQRS with Separate Databases
```csharp
// Write side - SQL Server for transactions
public class OrderCommandRepository : IOrderCommandRepository
{
    private readonly SqlServerContext _context;

    public async Task Save(Order order)
    {
        _context.Orders.Add(MapToEntity(order));
        await _context.SaveChangesAsync();
    }
}

// Read side - MongoDB for fast queries
public class OrderQueryRepository : IOrderQueryRepository
{
    private readonly IMongoDatabase _database;

    public async Task<List<OrderSummary>> GetOrdersByCustomer(string customerId)
    {
        var collection = _database.GetCollection<OrderSummary>("orderSummaries");
        return await collection
            .Find(o => o.CustomerId == customerId)
            .ToListAsync();
    }
}
```

## Controller/API Layer

```javascript
// Node.js Express Controllers
class OrderController {
  constructor(commandBus, queryBus) {
    this.commandBus = commandBus;
    this.queryBus = queryBus;
  }

  async createOrder(req, res) {
    const command = new CreateOrderCommand(
      req.body.customerId,
      req.body.items
    );

    const result = await this.commandBus.send(command);
    res.status(201).json(result);
  }

  async getOrders(req, res) {
    const query = new GetOrdersByCustomerQuery(
      req.params.customerId,
      req.query.page,
      req.query.pageSize
    );

    const result = await this.queryBus.send(query);
    res.json(result);
  }
}
```

```csharp
// .NET API Controllers
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly ICommandBus _commandBus;
    private readonly IQueryBus _queryBus;

    public OrdersController(ICommandBus commandBus, IQueryBus queryBus)
    {
        _commandBus = commandBus;
        _queryBus = queryBus;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderCommand command)
    {
        var result = await _commandBus.Send(command);
        return CreatedAtAction(nameof(GetOrder), new { id = result.OrderId }, result);
    }

    [HttpGet("{customerId}")]
    public async Task<ActionResult<OrderListDto>> GetOrders(
        string customerId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = new GetOrdersByCustomerQuery
        {
            CustomerId = customerId,
            Page = page,
            PageSize = pageSize
        };

        var result = await _queryBus.Send(query);
        return Ok(result);
    }
}
```

## Best Practices

1. **Commands return minimal data**: Only confirmation/ID
2. **Queries never modify state**: Pure read operations
3. **Use DTOs**: Different models for commands/queries
4. **Idempotency**: Commands should be idempotent
5. **Versioning**: Handle read model schema changes
6. **Monitoring**: Track synchronization lag

## When to Use

✅ **Use When:**
- Complex query requirements
- Need to scale reads independently
- High read-to-write ratio
- Multiple read models needed
- Using event sourcing

❌ **Avoid When:**
- Simple CRUD applications
- Strong consistency required
- Small-scale applications
- Team lacks experience with pattern

## Related Patterns

- [Event Sourcing](./event-sourcing.md)
- [Event-Driven Architecture](./event-driven.md)
- [Domain-Driven Design](./domain-driven-design.md)
- [Microservices Architecture](./microservices.md)

## Tools and Frameworks

### .NET
- **MediatR**: Command/Query bus implementation
- **Axon Framework**: CQRS and Event Sourcing
- **EventFlow**: CQRS/ES framework

### Node.js
- **NestJS CQRS**: Built-in CQRS module
- **Wolkenkit**: CQRS and Event Sourcing framework
- **Custom implementation**: Using EventEmitter

## Further Reading

- "CQRS Documents" by Greg Young
- "Implementing Domain-Driven Design" by Vaughn Vernon
- Martin Fowler's CQRS article
- Microsoft's CQRS pattern guidance
