# Microservices Architecture

**Category**: Enterprise Architecture Pattern  
**Complexity**: High  
**Use Case**: Large-scale distributed systems  

## Overview

Microservices architecture is an approach to developing a single application as a suite of small, independent services, each running in its own process and communicating with lightweight mechanisms, often an HTTP resource API.

## Key Characteristics

### 1. Service Independence
- Each microservice is independently deployable
- Services have their own data storage
- Failure in one service doesn't cascade to others

### 2. Decentralized Governance
- Teams can choose technologies best suited for their service
- No single technology stack requirement
- Polyglot persistence and programming

### 3. Business Capability Focus
- Services organized around business capabilities
- Cross-functional teams own entire service lifecycle
- Domain-driven design principles

### 4. Communication
- Lightweight protocols (HTTP/REST, gRPC)
- Asynchronous messaging (RabbitMQ, Kafka)
- Service discovery mechanisms

## Benefits

✅ **Scalability**: Scale individual services based on demand  
✅ **Flexibility**: Use different technologies per service  
✅ **Resilience**: Isolated failure domains  
✅ **Faster Deployment**: Deploy services independently  
✅ **Team Autonomy**: Teams can work independently  

## Challenges

⚠️ **Complexity**: Distributed system complexity  
⚠️ **Data Consistency**: Managing distributed transactions  
⚠️ **Testing**: Integration testing is more complex  
⚠️ **Deployment**: Requires sophisticated DevOps  
⚠️ **Monitoring**: Need comprehensive observability  

## Implementation Patterns

### Service Discovery
```javascript
// Node.js Example with Consul
const consul = require('consul')();

// Register service
consul.agent.service.register({
  name: 'user-service',
  address: 'localhost',
  port: 3000,
  check: {
    http: 'http://localhost:3000/health',
    interval: '10s'
  }
});
```

### API Gateway
```csharp
// .NET Example with Ocelot
{
  "Routes": [
    {
      "DownstreamPathTemplate": "/api/users",
      "DownstreamScheme": "http",
      "DownstreamHostAndPorts": [
        { "Host": "user-service", "Port": 3000 }
      ],
      "UpstreamPathTemplate": "/users",
      "UpstreamHttpMethod": [ "Get" ]
    }
  ]
}
```

### Circuit Breaker
```javascript
// Node.js Example with Opossum
const CircuitBreaker = require('opossum');

function callExternalService() {
  return fetch('http://service/api/data');
}

const breaker = new CircuitBreaker(callExternalService, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
});

breaker.fire()
  .then(response => console.log(response))
  .catch(err => console.error('Service unavailable'));
```

## Best Practices

### 1. Service Boundaries
- Design services around business domains
- Keep services loosely coupled
- Avoid shared databases between services

### 2. Data Management
- Each service owns its data
- Use event sourcing for consistency
- Implement eventual consistency patterns

### 3. Communication
- Use asynchronous messaging for non-critical operations
- Implement idempotency for operations
- Version your APIs properly

### 4. Observability
- Centralized logging (ELK, Splunk)
- Distributed tracing (Jaeger, Zipkin)
- Metrics and monitoring (Prometheus, Grafana)

### 5. Security
- Implement API Gateway for authentication
- Use service mesh for secure service-to-service communication
- Apply zero-trust security principles

## When to Use

✅ **Use When:**
- Building large, complex applications
- Need independent scaling of components
- Multiple teams working on different features
- Require technology diversity
- Need frequent, independent deployments

❌ **Avoid When:**
- Building small applications
- Team lacks DevOps maturity
- Simple, monolithic solution suffices
- Limited operational resources

## Related Patterns

- [Event-Driven Architecture](./event-driven.md)
- [API Gateway Pattern](./api-gateway.md)
- [Saga Pattern](./saga.md) - for distributed transactions
- [CQRS Pattern](./cqrs.md)

## Example Architecture

```
                    ┌─────────────┐
                    │ API Gateway │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │  User   │       │  Order  │       │ Product │
   │ Service │       │ Service │       │ Service │
   └────┬────┘       └────┬────┘       └────┬────┘
        │                 │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │ User DB │       │Order DB │       │Product  │
   └─────────┘       └─────────┘       │   DB    │
                                        └─────────┘
```

## Tools and Frameworks

### Node.js
- **Express.js**: Lightweight service framework
- **NestJS**: Enterprise-grade framework
- **Seneca**: Microservices toolkit
- **Moleculer**: Fast & powerful framework

### .NET
- **ASP.NET Core**: Web API framework
- **Dapr**: Distributed application runtime
- **MassTransit**: Message-based communication
- **Steeltoe**: Cloud-native toolkit

### Infrastructure
- **Docker**: Containerization
- **Kubernetes**: Orchestration
- **Consul/Eureka**: Service discovery
- **Istio**: Service mesh

## Further Reading

- "Building Microservices" by Sam Newman
- "Microservices Patterns" by Chris Richardson
- [Martin Fowler's Microservices Guide](https://martinfowler.com/microservices/)
- [12-Factor App Methodology](https://12factor.net/)
