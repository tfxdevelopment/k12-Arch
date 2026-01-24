# Azure Well-Architected Framework Alignment

This document demonstrates how the K12 Cloud-Native architecture aligns with the [Azure Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/).

## Five Pillars

The Azure Well-Architected Framework consists of five pillars:

1. **Reliability** - Ability to recover from failures and continue to function
2. **Security** - Protecting applications and data from threats
3. **Cost Optimization** - Managing costs to maximize value
4. **Operational Excellence** - Operations processes that keep a system running in production
5. **Performance Efficiency** - Ability to scale and adapt to changes in load

---

## 1. Reliability

**Goal**: Ensure the application can recover from failures and continue functioning.

### Implementation

#### Health Checks
```csharp
// ServiceDefaults/Extensions.cs:51
builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy(), tags: ["live"]);

// Endpoints
app.MapHealthChecks("/health");           // Readiness probe
app.MapHealthChecks("/alive");            // Liveness probe
```

**Benefits:**
- Kubernetes/Container Apps can monitor service health
- Automatic restart of unhealthy instances
- Load balancer removes unhealthy instances

#### Retry & Circuit Breaker (Aspire)
```csharp
// ServiceDefaults/Extensions.cs:22
http.AddStandardResilienceHandler();
```

**Policies:**
- **Retry**: Automatic retry on transient failures
- **Circuit Breaker**: Prevents cascading failures
- **Timeout**: Request timeout to prevent hanging

#### State Management with Dapr
```csharp
// Infrastructure/Messaging/DaprEventBus.cs:30
await _daprClient.SaveStateAsync(
    "k12-statestore",
    $"enrollment-application-{applicationId}",
    applicationState);
```

**Benefits:**
- Pluggable state stores (Redis → Cosmos DB)
- Automatic retry and failover
- Consistent state across instances

#### Event-Driven Architecture
```csharp
// Features/SubmitEnrollment/SubmitEnrollmentHandler.cs:58
await _eventBus.PublishAsync(integrationEvent, cancellationToken);
```

**Benefits:**
- Asynchronous processing (failures don't block)
- Message durability (events persisted in Service Bus)
- Poison message handling

### Azure Services for Reliability

| Service | Purpose | Reliability Feature |
|---------|---------|---------------------|
| **Azure Container Apps** | Hosting | Auto-scaling, health probes, zero-downtime deployments |
| **Azure SQL Database** | Database | Automatic backups, point-in-time restore, geo-replication |
| **Azure Service Bus** | Messaging | Message persistence, dead-letter queue, duplicate detection |
| **Azure Cosmos DB** | State Store | 99.999% SLA, multi-region writes, automatic failover |
| **Azure Key Vault** | Secrets | Geo-redundant, disaster recovery |

### Design Patterns

- **Idempotency**: Commands can be retried safely
- **Saga Pattern**: Distributed transactions with compensation
- **Outbox Pattern**: Reliable event publishing

---

## 2. Security

**Goal**: Protect applications and data from threats.

### Implementation

#### Authentication & Authorization

**Azure Entra ID Integration** (following K12 Hub & Spoke model):
```csharp
// Program.cs (to be added)
builder.Services.AddMicrosoftIdentityWebApi(configuration);
```

**Custom Security Attributes** (from K12 architecture):
- `studentAccessControl.parentReadWrite`
- `studentAccessControl.proxyReadOnly`
- `studentAccessControl.enrolledSchoolId`

#### Defense in Depth

```
┌─────────────────────────────────────┐
│ 1. Azure API Management (APIM)     │ JWT validation, rate limiting
├─────────────────────────────────────┤
│ 2. API Gateway Middleware          │ Custom authorization logic
├─────────────────────────────────────┤
│ 3. Application Logic                │ Business rule validation
├─────────────────────────────────────┤
│ 4. Azure SQL Row-Level Security     │ Database-level authorization
└─────────────────────────────────────┘
```

#### Secrets Management

**Local Development**:
```yaml
# dapr/components/secretstore.yaml
spec:
  type: secretstores.local.file
```

**Production**:
```yaml
spec:
  type: secretstores.azure.keyvault
  metadata:
  - name: vaultName
    value: your-keyvault-name
```

#### Secure Communication

- **TLS 1.2+** for all HTTP traffic
- **mTLS** for Dapr service-to-service calls
- **Encrypted connections** to Azure SQL, Service Bus, Cosmos DB

#### Input Validation

```csharp
// Features/SubmitEnrollment/SubmitEnrollmentValidator.cs
public class SubmitEnrollmentValidator : AbstractValidator<SubmitEnrollmentCommand>
{
    public SubmitEnrollmentValidator()
    {
        RuleFor(x => x.HouseholdId).NotEmpty();
        RuleFor(x => x.ProgramId).NotEmpty();
        // Prevents injection attacks, invalid data
    }
}
```

#### Azure Services for Security

| Service | Purpose | Security Feature |
|---------|---------|------------------|
| **Azure Entra ID** | Identity | SSO, MFA, conditional access, custom security attributes |
| **Azure Key Vault** | Secrets | Hardware Security Module (HSM), access policies, auditing |
| **Azure API Management** | Gateway | OAuth 2.0, JWT validation, IP filtering, rate limiting |
| **Azure SQL Database** | Database | Transparent Data Encryption (TDE), Always Encrypted, firewall |
| **Azure Monitor** | Logging | Security event logging, threat detection |

### Security Best Practices

- ✅ Never commit secrets to source control
- ✅ Use Managed Identity for Azure resource access
- ✅ Implement least privilege access (RBAC)
- ✅ Validate all inputs
- ✅ Use parameterized queries (Dapper prevents SQL injection)
- ✅ Enable audit logging
- ✅ Regular security scanning

---

## 3. Cost Optimization

**Goal**: Manage costs to maximize value delivered.

### Implementation

#### Serverless Architecture

**Azure Container Apps** with consumption-based pricing:
- Scale to zero when idle
- Pay only for actual usage
- Automatic scaling based on load

**Dapr State Store** options:
- **Local/Dev**: Redis (free)
- **Production**: Cosmos DB with autoscale (pay per RU)

#### Efficient Data Access

```csharp
// Using Dapper instead of Entity Framework
public async Task<EnrollmentApplication> GetByIdAsync(Guid id)
{
    const string sql = "SELECT * FROM EnrollmentApplications WHERE Id = @Id";
    return await _connection.QuerySingleOrDefaultAsync<EnrollmentApplication>(sql, new { Id = id });
}
```

**Benefits:**
- Lower memory footprint
- Faster query execution
- Reduced database load (less RU consumption)

#### Caching Strategy

```csharp
// Use Redis for frequently accessed data
public async Task<ProgramDetails> GetProgramAsync(Guid programId)
{
    var cached = await _cache.GetAsync<ProgramDetails>($"program:{programId}");
    if (cached != null) return cached;

    var program = await _database.GetProgramAsync(programId);
    await _cache.SetAsync($"program:{programId}", program, TimeSpan.FromMinutes(15));
    return program;
}
```

**Cost Savings:**
- Reduce database queries (lower RU consumption)
- Faster response times
- Lower compute costs

#### Resource Optimization

| Resource | Development | Production | Cost Optimization |
|----------|-------------|------------|-------------------|
| **SQL Database** | Basic tier | Standard S3 | Pause non-prod during off-hours |
| **Service Bus** | Basic | Standard | Use topics efficiently |
| **Cosmos DB** | 400 RU/s | Autoscale 400-4000 RU/s | Pay for actual usage |
| **Container Apps** | 0.5 vCPU, 1GB | Auto-scale 0-10 instances | Scale to zero |
| **Storage** | Locally Redundant (LRS) | Geo-Redundant (GRS) | Lifecycle management |

#### Monitoring & Optimization

```csharp
// OpenTelemetry metrics for cost insights
builder.Services.AddOpenTelemetry()
    .WithMetrics(metrics =>
    {
        metrics.AddMeter("K12.CostMetrics");
        // Track: API calls, database queries, storage operations
    });
```

**Cost Optimization Practices:**
- Monitor resource utilization
- Right-size resources based on telemetry
- Use reserved instances for predictable workloads
- Implement auto-scaling policies
- Clean up unused resources

---

## 4. Operational Excellence

**Goal**: Operations processes that keep the system running in production.

### Implementation

#### Observability (OpenTelemetry)

**Distributed Tracing**:
```csharp
// ServiceDefaults/Extensions.cs:47
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing =>
    {
        tracing
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddSource("K12.*")
            .AddSource("Dapr.*");
    });
```

**Metrics**:
```csharp
.WithMetrics(metrics =>
{
    metrics
        .AddAspNetCoreInstrumentation()  // Request rate, duration
        .AddHttpClientInstrumentation()  // Outbound HTTP
        .AddRuntimeInstrumentation()     // GC, thread pool
        .AddMeter("K12.*");              // Custom business metrics
});
```

**Structured Logging**:
```csharp
_logger.LogInformation(
    "Processing enrollment submission for Household {HouseholdId}, Program {ProgramId}",
    command.HouseholdId,
    command.ProgramId);
```

**Benefits:**
- Correlate logs across services
- Identify performance bottlenecks
- Alert on anomalies

#### .NET Aspire Dashboard

**Real-time Monitoring**:
- Service health status
- Live logs aggregation
- Distributed traces visualization
- Metrics dashboards
- Resource consumption

#### Infrastructure as Code

**Aspire Deployment Manifests**:
```csharp
// AppHost/Program.cs
builder.AddAzureContainerApps()
       .AddAzureApplicationInsights()
       .AddAzureSqlServer();
```

**Benefits:**
- Reproducible deployments
- Version-controlled infrastructure
- Automated provisioning

#### CI/CD Integration

```yaml
# Azure DevOps Pipeline (example)
trigger:
  branches:
    include:
    - main
    - development

stages:
- stage: Build
  jobs:
  - job: Build
    steps:
    - task: DotNetCoreCLI@2
      inputs:
        command: 'build'
        projects: '**/*.csproj'

- stage: Test
  jobs:
  - job: Test
    steps:
    - task: DotNetCoreCLI@2
      inputs:
        command: 'test'
        projects: '**/*Tests.csproj'

- stage: Deploy
  jobs:
  - job: DeployToAzure
    steps:
    - task: AzureCLI@2
      inputs:
        azureSubscription: 'K12-Production'
        scriptType: 'bash'
        scriptLocation: 'inlineScript'
        inlineScript: 'azd deploy'
```

#### Health Monitoring

```csharp
// Infrastructure/InfrastructureHealthCheck.cs
public async Task<HealthCheckResult> CheckHealthAsync(...)
{
    // Check database connectivity
    // Check message bus availability
    // Check external service health
    return HealthCheckResult.Healthy();
}
```

#### Incident Response

**Alerting** (Azure Monitor):
- High error rates
- Slow response times
- Failed health checks
- Resource exhaustion

**Runbooks**:
- Deployment rollback procedures
- Scaling procedures
- Disaster recovery procedures

---

## 5. Performance Efficiency

**Goal**: System's ability to scale and adapt to changes in load.

### Implementation

#### Horizontal Scaling

**Azure Container Apps**:
```yaml
# Container Apps auto-scaling rules
scale:
  minReplicas: 1
  maxReplicas: 10
  rules:
  - name: http-scaling
    http:
      metadata:
        concurrentRequests: "100"
```

**Benefits:**
- Automatic scale-out under load
- Scale to zero when idle
- Cost-effective scaling

#### Asynchronous Processing

**CQRS Pattern**:
```csharp
// Commands (writes) are asynchronous
public async Task<Result<Guid>> Handle(SubmitEnrollmentCommand command, ...)
{
    // Process asynchronously
    await _repository.AddAsync(application);
    await _eventBus.PublishAsync(@event);  // Non-blocking
}
```

**Event-Driven Architecture**:
- Long-running operations processed asynchronously
- User doesn't wait for background tasks
- System handles higher throughput

#### Performance Optimizations

**Dapper for Data Access**:
```csharp
// High-performance micro-ORM
await _connection.QueryAsync<T>(sql, parameters);
```

**Benefits:**
- Minimal overhead (vs. EF Core)
- Direct SQL control
- Faster query execution

**Caching with Redis**:
```csharp
// Reduce database load
var cached = await _cache.GetAsync<T>(key);
```

**Mapster for Object Mapping**:
```csharp
// Faster than AutoMapper via source generation
var dto = application.Adapt<EnrollmentApplicationDto>();
```

#### Database Performance

**Connection Pooling**:
```csharp
services.AddSingleton<IDbConnectionFactory, SqlConnectionFactory>();
```

**Optimized Queries**:
- Use Dapper for custom queries
- Index important columns
- Use pagination for large datasets
- Implement read replicas for query scaling

#### CDN & Static Content

For Angular frontend (separate repo):
- Azure CDN for static assets
- Compression (gzip, brotli)
- Browser caching headers

#### Performance Monitoring

```csharp
// OpenTelemetry metrics
var meter = new Meter("K12.Performance");
var requestDuration = meter.CreateHistogram<double>("http.request.duration");

requestDuration.Record(elapsedMs,
    new KeyValuePair<string, object>("endpoint", "/api/enrollment"));
```

**Track:**
- API response times (P50, P95, P99)
- Database query performance
- Cache hit ratio
- Message processing latency

### Performance Targets

| Metric | Target | Monitoring |
|--------|--------|------------|
| **API Response Time** | < 200ms (P95) | Application Insights |
| **Database Query Time** | < 50ms (average) | SQL Insights |
| **Event Processing** | < 1 second | Custom metrics |
| **Cache Hit Ratio** | > 80% | Redis metrics |
| **Throughput** | > 1000 req/sec | Load testing |

---

## Implementation Checklist

### Reliability ✅
- [x] Health checks implemented
- [x] Retry policies configured
- [x] Event-driven architecture
- [ ] Chaos engineering tests
- [ ] Disaster recovery plan

### Security ✅
- [ ] Azure Entra ID authentication (to be added)
- [x] Input validation with FluentValidation
- [x] Secrets management (Key Vault ready)
- [x] Defense in depth layers
- [ ] Security scanning in CI/CD

### Cost Optimization ✅
- [x] Serverless architecture
- [x] Efficient data access (Dapper)
- [x] Caching strategy
- [x] Resource auto-scaling
- [ ] Cost monitoring dashboard

### Operational Excellence ✅
- [x] Distributed tracing (OpenTelemetry)
- [x] Structured logging
- [x] Health monitoring
- [x] Infrastructure as Code (Aspire)
- [ ] Automated deployments

### Performance Efficiency ✅
- [x] Horizontal scaling
- [x] Asynchronous processing (CQRS, events)
- [x] High-performance data access
- [x] Caching layer
- [ ] Load testing and optimization

---

## Next Steps

1. **Add Authentication**
   - Integrate Microsoft.Identity.Web
   - Implement JWT middleware
   - Add role-based authorization

2. **Enhance Security**
   - Add CORS policies
   - Implement rate limiting in APIM
   - Add request/response validation middleware

3. **Performance Testing**
   - Conduct load testing with Apache JMeter or k6
   - Identify bottlenecks
   - Optimize based on telemetry

4. **Cost Analysis**
   - Set up Azure Cost Management alerts
   - Review monthly spend
   - Optimize resource allocation

5. **Disaster Recovery**
   - Document recovery procedures
   - Test backup and restore
   - Implement geo-replication

---

## Resources

- [Azure Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/)
- [Cloud Design Patterns](https://learn.microsoft.com/en-us/azure/architecture/patterns/)
- [Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/)
- [Dapr Best Practices](https://docs.dapr.io/operations/best-practices/)
- [.NET Aspire Documentation](https://learn.microsoft.com/en-us/dotnet/aspire/)
