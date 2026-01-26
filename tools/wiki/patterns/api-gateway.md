# API Gateway Pattern

**Category**: Enterprise Architecture Pattern  
**Complexity**: Medium  
**Use Case**: Microservices architecture, Single entry point for clients  

## Overview

The API Gateway pattern provides a single entry point for clients to interact with multiple microservices. It acts as a reverse proxy that routes requests to appropriate microservices, aggregates responses, and handles cross-cutting concerns like authentication, rate limiting, and logging.

## Key Concepts

### Single Entry Point
All client requests go through a single gateway that routes them to the appropriate backend services.

### Request Routing
The gateway determines which microservice should handle each request based on the URL path, headers, or other criteria.

### Response Aggregation
The gateway can call multiple services and combine their responses into a single response for the client.

## Architecture

```
                    Clients (Web, Mobile, Desktop)
                              │
                              ▼
                    ┌──────────────────┐
                    │   API Gateway    │
                    │                  │
                    │  - Routing       │
                    │  - Auth          │
                    │  - Rate Limiting │
                    │  - Caching       │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
   ┌─────────┐         ┌─────────┐         ┌─────────┐
   │  User   │         │  Order  │         │ Product │
   │ Service │         │ Service │         │ Service │
   └─────────┘         └─────────┘         └─────────┘
```

## Implementation Examples

### Node.js with Express

```javascript
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

const app = express();

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Route to User Service
app.use('/api/users', authenticate, createProxyMiddleware({
  target: 'http://user-service:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/users'
  }
}));

// Route to Order Service
app.use('/api/orders', authenticate, createProxyMiddleware({
  target: 'http://order-service:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/orders': '/orders'
  }
}));

// Route to Product Service
app.use('/api/products', createProxyMiddleware({
  target: 'http://product-service:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/api/products': '/products'
  }
}));

// Response aggregation example
app.get('/api/user-profile/:userId', authenticate, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Call multiple services in parallel
    const [userResponse, ordersResponse] = await Promise.all([
      fetch(`http://user-service:3001/users/${userId}`),
      fetch(`http://order-service:3002/orders?userId=${userId}`)
    ]);

    const user = await userResponse.json();
    const orders = await ordersResponse.json();

    // Aggregate response
    res.json({
      user: user,
      recentOrders: orders.slice(0, 5),
      orderCount: orders.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
```

### .NET with Ocelot

```json
// ocelot.json
{
  "Routes": [
    {
      "DownstreamPathTemplate": "/api/users/{everything}",
      "DownstreamScheme": "http",
      "DownstreamHostAndPorts": [
        {
          "Host": "user-service",
          "Port": 5001
        }
      ],
      "UpstreamPathTemplate": "/users/{everything}",
      "UpstreamHttpMethod": [ "Get", "Post", "Put", "Delete" ],
      "AuthenticationOptions": {
        "AuthenticationProviderKey": "Bearer"
      },
      "RateLimitOptions": {
        "ClientWhitelist": [],
        "EnableRateLimiting": true,
        "Period": "1m",
        "PeriodTimespan": 60,
        "Limit": 100
      }
    },
    {
      "DownstreamPathTemplate": "/api/orders/{everything}",
      "DownstreamScheme": "http",
      "DownstreamHostAndPorts": [
        {
          "Host": "order-service",
          "Port": 5002
        }
      ],
      "UpstreamPathTemplate": "/orders/{everything}",
      "UpstreamHttpMethod": [ "Get", "Post", "Put", "Delete" ],
      "AuthenticationOptions": {
        "AuthenticationProviderKey": "Bearer"
      }
    },
    {
      "DownstreamPathTemplate": "/api/products/{everything}",
      "DownstreamScheme": "http",
      "DownstreamHostAndPorts": [
        {
          "Host": "product-service",
          "Port": 5003
        }
      ],
      "UpstreamPathTemplate": "/products/{everything}",
      "UpstreamHttpMethod": [ "Get" ]
    }
  ],
  "GlobalConfiguration": {
    "BaseUrl": "https://api.example.com"
  }
}
```

```csharp
// Program.cs
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add Ocelot
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);
builder.Services.AddOcelot(builder.Configuration);

// Add authentication
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.Authority = "https://identity-server.com";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false
        };
    });

var app = builder.Build();

// Use Ocelot middleware
await app.UseOcelot();

app.Run();
```

### Custom Gateway with Response Aggregation

```javascript
// Custom API Gateway with aggregation
const express = require('express');
const axios = require('axios');

class APIGateway {
  constructor(services) {
    this.services = services;
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());
    
    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      req.startTime = Date.now();
      next();
    });

    // Response time logging
    this.app.use((req, res, next) => {
      res.on('finish', () => {
        const duration = Date.now() - req.startTime;
        console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
      });
      next();
    });
  }

  setupRoutes() {
    // Simple proxy routes
    Object.keys(this.services).forEach(serviceName => {
      const service = this.services[serviceName];
      this.app.use(service.path, this.proxyRequest.bind(this, service));
    });

    // Aggregated endpoint
    this.app.get('/api/dashboard', this.getDashboard.bind(this));
  }

  async proxyRequest(service, req, res) {
    try {
      const url = `${service.url}${req.path}`;
      const response = await axios({
        method: req.method,
        url: url,
        data: req.body,
        headers: this.forwardHeaders(req.headers)
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      const status = error.response?.status || 500;
      res.status(status).json({ 
        error: 'Service unavailable',
        message: error.message 
      });
    }
  }

  async getDashboard(req, res) {
    try {
      // Call multiple services in parallel
      const [users, orders, products] = await Promise.allSettled([
        axios.get(`${this.services.users.url}/users/stats`),
        axios.get(`${this.services.orders.url}/orders/stats`),
        axios.get(`${this.services.products.url}/products/stats`)
      ]);

      // Aggregate results
      const dashboard = {
        users: users.status === 'fulfilled' ? users.value.data : null,
        orders: orders.status === 'fulfilled' ? orders.value.data : null,
        products: products.status === 'fulfilled' ? products.value.data : null,
        timestamp: new Date()
      };

      res.json(dashboard);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load dashboard' });
    }
  }

  forwardHeaders(headers) {
    // Forward only necessary headers
    const allowedHeaders = ['authorization', 'content-type', 'user-agent'];
    const forwarded = {};
    
    allowedHeaders.forEach(header => {
      if (headers[header]) {
        forwarded[header] = headers[header];
      }
    });

    return forwarded;
  }

  start(port) {
    this.app.listen(port, () => {
      console.log(`API Gateway listening on port ${port}`);
    });
  }
}

// Usage
const gateway = new APIGateway({
  users: {
    path: '/api/users',
    url: 'http://user-service:3001'
  },
  orders: {
    path: '/api/orders',
    url: 'http://order-service:3002'
  },
  products: {
    path: '/api/products',
    url: 'http://product-service:3003'
  }
});

gateway.start(3000);
```

## Cross-Cutting Concerns

### 1. Authentication & Authorization

```javascript
// JWT Authentication
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
```

### 2. Rate Limiting

```javascript
// Simple rate limiter
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  middleware() {
    return (req, res, next) => {
      const key = req.ip;
      const now = Date.now();
      const requests = this.requests.get(key) || [];
      
      // Remove old requests outside the window
      const validRequests = requests.filter(time => now - time < this.windowMs);
      
      if (validRequests.length >= this.maxRequests) {
        return res.status(429).json({ 
          error: 'Too many requests',
          retryAfter: Math.ceil((validRequests[0] + this.windowMs - now) / 1000)
        });
      }
      
      validRequests.push(now);
      this.requests.set(key, validRequests);
      next();
    };
  }
}
```

### 3. Caching

```javascript
// Response caching
const cache = new Map();

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl;
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < duration) {
      return res.json(cached.data);
    }

    // Override res.json to cache response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      cache.set(key, {
        data: data,
        timestamp: Date.now()
      });
      return originalJson(data);
    };

    next();
  };
};
```

### 4. Circuit Breaker

```javascript
// Circuit breaker for service calls
class CircuitBreaker {
  constructor(threshold, timeout) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failures = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}
```

## Benefits

✅ **Single Entry Point**: Simplified client interaction  
✅ **Security**: Centralized authentication and authorization  
✅ **Load Balancing**: Distribute requests across service instances  
✅ **Protocol Translation**: Convert between protocols (HTTP to gRPC)  
✅ **Response Aggregation**: Combine multiple service responses  

## Challenges

⚠️ **Single Point of Failure**: Gateway must be highly available  
⚠️ **Performance Bottleneck**: All traffic goes through gateway  
⚠️ **Complexity**: Additional infrastructure to manage  
⚠️ **Latency**: Extra network hop for all requests  
⚠️ **Development Overhead**: Gateway configuration and maintenance  

## Best Practices

1. **Make it stateless**: Don't store session data in the gateway
2. **Implement health checks**: Monitor backend service health
3. **Use circuit breakers**: Prevent cascading failures
4. **Cache responses**: Reduce load on backend services
5. **Log everything**: Centralized logging for debugging
6. **Version your APIs**: Support multiple API versions
7. **Implement rate limiting**: Protect services from abuse
8. **Handle failures gracefully**: Return meaningful error messages

## When to Use

✅ **Use When:**
- Building microservices architecture
- Need centralized authentication
- Want to aggregate responses from multiple services
- Need to support multiple client types
- Require protocol translation

❌ **Avoid When:**
- Building monolithic applications
- Performance is critical and extra latency unacceptable
- Simple architecture with few services
- Team lacks DevOps expertise

## Related Patterns

- [Microservices Architecture](./microservices.md)
- [Backend for Frontend (BFF)](./backend-for-frontend.md)
- [Service Mesh](./service-mesh.md)
- [Circuit Breaker Pattern](./circuit-breaker.md)

## Tools and Technologies

### Open Source
- **Kong**: API Gateway and service mesh
- **Traefik**: Cloud-native edge router
- **Nginx**: Reverse proxy and load balancer
- **Envoy**: Service proxy

### Commercial
- **AWS API Gateway**: Managed API Gateway service
- **Azure API Management**: Enterprise API management
- **Google Cloud Endpoints**: API management
- **Apigee**: Full API management platform

### .NET
- **Ocelot**: .NET API Gateway
- **YARP**: Reverse proxy library
- **Pro.NBitcoin**: Custom gateway framework

### Node.js
- **Express Gateway**: Microservices API Gateway
- **http-proxy-middleware**: Proxy middleware
- **custom implementations**: Roll your own

## Further Reading

- "Building Microservices" by Sam Newman
- "Microservices Patterns" by Chris Richardson
- Netflix Tech Blog on API Gateway pattern
- AWS API Gateway Best Practices
