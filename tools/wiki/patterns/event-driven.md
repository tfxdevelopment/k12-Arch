# Event-Driven Architecture

**Category**: Enterprise Architecture Pattern  
**Complexity**: Medium-High  
**Use Case**: Reactive, scalable systems with decoupled components  

## Overview

Event-Driven Architecture (EDA) is a software architecture paradigm promoting the production, detection, consumption, and reaction to events. An event is a significant change in state or an important occurrence in the system.

## Key Concepts

### Events
An event is an immutable record of something that happened:
```javascript
{
  "eventId": "evt_123",
  "eventType": "OrderPlaced",
  "timestamp": "2023-11-15T10:30:00Z",
  "data": {
    "orderId": "order_456",
    "customerId": "cust_789",
    "totalAmount": 99.99
  }
}
```

### Components

1. **Event Producers**: Generate events when state changes occur
2. **Event Consumers**: Listen for and react to events
3. **Event Channels**: Transport events between producers and consumers
4. **Event Store**: Persists events for replay and audit

## Architecture Styles

### 1. Event Notification
Simple notification that something happened, minimal data included.

```javascript
// Node.js Producer
const EventEmitter = require('events');
class OrderService extends EventEmitter {
  placeOrder(order) {
    // Process order
    this.emit('orderPlaced', { orderId: order.id });
  }
}

// Consumer
orderService.on('orderPlaced', (data) => {
  console.log(`Order ${data.orderId} placed`);
});
```

### 2. Event-Carried State Transfer
Events contain sufficient data so consumers don't need to query back.

```csharp
// .NET Example
public class OrderPlacedEvent
{
    public string OrderId { get; set; }
    public string CustomerId { get; set; }
    public decimal TotalAmount { get; set; }
    public List<OrderItem> Items { get; set; }
    public DateTime PlacedAt { get; set; }
}
```

### 3. Event Sourcing
Store all changes as a sequence of events, derive current state by replaying events.

```javascript
// Event Store Example
class EventStore {
  constructor() {
    this.events = [];
  }

  append(event) {
    this.events.push({
      ...event,
      timestamp: new Date(),
      version: this.events.length + 1
    });
  }

  getEventsForAggregate(aggregateId) {
    return this.events.filter(e => e.aggregateId === aggregateId);
  }

  replayEvents(aggregateId) {
    const events = this.getEventsForAggregate(aggregateId);
    let state = {};
    events.forEach(event => {
      state = applyEvent(state, event);
    });
    return state;
  }
}
```

### 4. CQRS (Command Query Responsibility Segregation)
Separate read and write models, often used with event sourcing.

```csharp
// .NET Command Handler
public class PlaceOrderCommandHandler : ICommandHandler<PlaceOrderCommand>
{
    private readonly IEventBus _eventBus;

    public async Task Handle(PlaceOrderCommand command)
    {
        // Validate and process
        var order = new Order(command.OrderId, command.Items);
        
        // Publish event
        await _eventBus.Publish(new OrderPlacedEvent
        {
            OrderId = order.Id,
            Items = order.Items,
            PlacedAt = DateTime.UtcNow
        });
    }
}
```

## Benefits

✅ **Loose Coupling**: Components don't need to know about each other  
✅ **Scalability**: Easy to scale event consumers independently  
✅ **Flexibility**: Add new consumers without changing producers  
✅ **Audit Trail**: Events provide complete history  
✅ **Real-time Processing**: React to changes as they happen  

## Challenges

⚠️ **Eventual Consistency**: Data may be temporarily inconsistent  
⚠️ **Complexity**: More moving parts to manage  
⚠️ **Debugging**: Harder to trace event flows  
⚠️ **Event Schema Evolution**: Managing event version changes  
⚠️ **Duplicate Events**: Need idempotency handling  

## Implementation Example

### Message Broker with RabbitMQ (Node.js)

```javascript
const amqp = require('amqplib');

// Publisher
class EventPublisher {
  async connect() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange('events', 'topic', { durable: true });
  }

  async publish(eventType, event) {
    const message = JSON.stringify(event);
    this.channel.publish('events', eventType, Buffer.from(message), {
      persistent: true,
      timestamp: Date.now()
    });
  }
}

// Subscriber
class EventSubscriber {
  async connect(eventTypes) {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange('events', 'topic', { durable: true });
    
    const queue = await this.channel.assertQueue('', { exclusive: true });
    
    eventTypes.forEach(eventType => {
      this.channel.bindQueue(queue.queue, 'events', eventType);
    });

    this.channel.consume(queue.queue, this.handleMessage.bind(this), {
      noAck: false
    });
  }

  handleMessage(msg) {
    const event = JSON.parse(msg.content.toString());
    console.log('Received event:', event);
    // Process event
    this.channel.ack(msg);
  }
}
```

### Kafka Implementation (Node.js)

```javascript
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

// Producer
const producer = kafka.producer();
await producer.connect();
await producer.send({
  topic: 'order-events',
  messages: [
    {
      key: 'order-123',
      value: JSON.stringify({
        eventType: 'OrderPlaced',
        orderId: 'order-123',
        customerId: 'cust-456',
        amount: 99.99
      })
    }
  ]
});

// Consumer
const consumer = kafka.consumer({ groupId: 'order-processor' });
await consumer.connect();
await consumer.subscribe({ topic: 'order-events' });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const event = JSON.parse(message.value.toString());
    console.log('Processing event:', event);
    // Handle event
  }
});
```

### Azure Event Hub (.NET)

```csharp
using Azure.Messaging.EventHubs;
using Azure.Messaging.EventHubs.Producer;

// Producer
var producerClient = new EventHubProducerClient(
    connectionString, 
    eventHubName
);

var eventBatch = await producerClient.CreateBatchAsync();
eventBatch.TryAdd(new EventData(
    Encoding.UTF8.GetBytes(JsonSerializer.Serialize(orderEvent))
));

await producerClient.SendAsync(eventBatch);

// Consumer
var consumerClient = new EventHubConsumerClient(
    consumerGroup,
    connectionString,
    eventHubName
);

await foreach (PartitionEvent partitionEvent in consumerClient.ReadEventsAsync())
{
    var eventData = Encoding.UTF8.GetString(partitionEvent.Data.Body.ToArray());
    var orderEvent = JsonSerializer.Deserialize<OrderEvent>(eventData);
    // Process event
}
```

## Best Practices

### 1. Event Design
- Make events immutable
- Include sufficient context in events
- Use clear, business-oriented event names
- Version your event schemas

### 2. Idempotency
```javascript
class IdempotentEventHandler {
  constructor() {
    this.processedEvents = new Set();
  }

  async handle(event) {
    if (this.processedEvents.has(event.eventId)) {
      console.log('Event already processed, skipping');
      return;
    }

    await this.processEvent(event);
    this.processedEvents.add(event.eventId);
  }
}
```

### 3. Error Handling
- Implement dead letter queues
- Use retry policies with exponential backoff
- Monitor failed event processing

### 4. Event Ordering
- Use partition keys for related events
- Consider timestamp-based ordering
- Handle out-of-order events gracefully

### 5. Testing
- Test event handlers in isolation
- Use event replay for debugging
- Implement contract testing for event schemas

## When to Use

✅ **Use When:**
- Need loose coupling between components
- Building reactive, real-time systems
- Require audit trail of all changes
- Need to scale components independently
- Multiple consumers need same data

❌ **Avoid When:**
- Simple CRUD applications
- Strong consistency is critical
- Team lacks distributed systems experience
- Synchronous processing is sufficient

## Related Patterns

- [Microservices Architecture](./microservices.md)
- [CQRS Pattern](./cqrs.md)
- [Saga Pattern](./saga.md)
- [Event Sourcing](./event-sourcing.md)

## Tools and Technologies

### Message Brokers
- **RabbitMQ**: Reliable message broker
- **Apache Kafka**: High-throughput streaming platform
- **AWS SNS/SQS**: Cloud-native messaging
- **Azure Event Hub**: Cloud event streaming
- **Google Pub/Sub**: Global messaging service

### Event Store Databases
- **EventStoreDB**: Purpose-built for event sourcing
- **Apache Kafka**: Can serve as event store
- **CosmosDB**: Change feed for events
- **PostgreSQL**: Can be used for event sourcing

### Frameworks
- **MassTransit** (.NET): Message-based communication
- **NServiceBus** (.NET): Enterprise service bus
- **Axon Framework** (Java): CQRS and Event Sourcing
- **EventEmitter** (Node.js): Built-in event handling

## Monitoring and Observability

```javascript
// Event metrics tracking
class EventMetrics {
  constructor() {
    this.metrics = {
      published: new Map(),
      consumed: new Map(),
      failed: new Map()
    };
  }

  recordPublished(eventType) {
    this.increment(this.metrics.published, eventType);
  }

  recordConsumed(eventType, durationMs) {
    this.increment(this.metrics.consumed, eventType);
    // Record processing time
  }

  recordFailed(eventType, error) {
    this.increment(this.metrics.failed, eventType);
    // Log error details
  }

  increment(map, key) {
    map.set(key, (map.get(key) || 0) + 1);
  }
}
```

## Further Reading

- "Enterprise Integration Patterns" by Gregor Hohpe
- "Designing Event-Driven Systems" by Ben Stopford
- Martin Fowler's article on Event-Driven Architecture
- Microsoft's Event-Driven Architecture Guide
