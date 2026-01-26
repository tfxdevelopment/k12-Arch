# ADR-PROP-006: Dapr for Cross-Cutting Concerns

**Status:** Proposed
**Date:** 2025-12-15
**Deciders:** CFI Architecture Team (Marty Flournory, Sumith Mathur)
**Technical Story:** K12 Cloud-Native Architecture Initiative

## Context and Problem Statement

K12 MyPortal is migrating to Azure Container Apps as part of the cloud-native modernization. The system needs consistent abstractions for cross-cutting concerns that:

1. Work identically in local development (Aspire + Docker) and production (Azure Container Apps)
2. Abstract Azure-specific SDKs to enable portability and simpler code
3. Provide built-in resilience patterns (retries, circuit breakers, timeouts)
4. Support the 80,000 concurrent user scale requirement

Currently, the codebase has direct dependencies on:
- Azure SDK for Blob Storage
- Azure SDK for Service Bus
- Azure SDK for Key Vault
- Azure Functions Timer Triggers for scheduled jobs
- Azure Durable Functions for workflow orchestration

This creates tight coupling to Azure services and different code paths for local vs. production environments.

## Decision Drivers

* **Cloud-agnostic abstractions** - Ability to swap backing services without code changes
* **Consistent local and production behavior** - Same programming model everywhere
* **Simplified code** - No direct Azure SDK dependencies in business logic
* **Built-in resilience** - Automatic retries, circuit breakers, timeouts
* **Developer productivity** - Aspire configures Dapr automatically for local dev
* **Container Apps native** - Dapr is built into Azure Container Apps
* **Observability** - Unified distributed tracing across all building blocks

## Considered Options

1. **Direct Azure SDK usage** - Continue using Azure SDKs directly
2. **Custom abstraction layer** - Build internal wrappers around Azure services
3. **Dapr for all cross-cutting concerns** - Use Dapr as the unified abstraction layer

## Decision Outcome

**Chosen option:** "Dapr for all cross-cutting concerns" because it provides a unified, cloud-agnostic abstraction layer that is natively integrated with Azure Container Apps and works seamlessly with .NET Aspire for local development.

### All 8 Dapr Building Blocks

K12 MyPortal will use **all 8 Dapr building blocks** as the standard abstraction layer:

| # | Building Block | Local (Aspire) | Production (Azure) | K12 Use Case |
|---|---------------|----------------|-------------------|--------------|
| 1 | **Service Invocation** | Dapr sidecar | Container Apps Dapr | API-to-API calls with mTLS |
| 2 | **State Management** | Redis container | Azure Cache for Redis | Session state, distributed cache |
| 3 | **Pub/Sub** | Redis Streams | Azure Service Bus | RDS integration, roster events, notifications |
| 4 | **Bindings** | Local file bindings | Azure Blob, SendGrid | Document storage, email sending |
| 5 | **Secrets** | Local secrets file | Azure Key Vault | Connection strings, API keys |
| 6 | **Configuration** | Local config file | Azure App Configuration | Feature flags, dynamic settings |
| 7 | **Workflows** | Dapr Workflow runtime | Dapr Workflow runtime | Roster certification, enrollment orchestration |
| 8 | **Jobs** | Dapr Jobs runtime | Dapr Jobs runtime | Scheduled tasks (replaces Timer Triggers) |

### Consequences

#### Good

- **Single programming model** - Same Dapr API calls work locally and in production
- **Automatic mTLS** - Service-to-service encryption without code changes
- **Built-in resilience** - Retries, circuit breakers, timeouts configured declaratively
- **Swap Azure services** - Change from Redis to Cosmos DB by updating component YAML, not code
- **Aspire integration** - `builder.AddDapr()` configures everything for local dev
- **Unified observability** - All Dapr calls emit OpenTelemetry traces
- **Simplified testing** - Mock Dapr sidecar for unit tests

#### Bad

- **Learning curve** - Team needs to learn Dapr concepts and APIs
- **Sidecar overhead** - Additional container per service (~50MB memory)
- **Debugging complexity** - Requests go through sidecar, harder to trace
- **Newer technology** - Dapr Workflows/Jobs less mature than Azure equivalents

#### Neutral

- **Component YAML files** - Need to maintain Dapr component configurations
- **Version management** - Must track Dapr runtime version compatibility

## Building Block Details

### 1. Service Invocation

**Purpose:** Secure, reliable service-to-service communication with automatic mTLS.

**Local Component:**
```yaml
# No explicit component needed - Dapr sidecar handles automatically
```

**Production Component:**
```yaml
# No explicit component needed - Container Apps Dapr handles automatically
```

**Code Example:**
```csharp
// Instead of: var response = await httpClient.GetAsync("https://k12-dab:8080/api/students");
// Use Dapr service invocation:
var client = DaprClient.CreateInvokeHttpClient("k12-dab");
var response = await client.GetAsync("/api/students");
```

**Benefits:**
- Automatic mTLS encryption
- Built-in retries with exponential backoff
- Circuit breaker on repeated failures
- Load balancing across replicas

### 2. State Management

**Purpose:** Distributed state storage with consistent API across backends.

**Local Component (Redis):**
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
spec:
  type: state.redis
  version: v1
  metadata:
    - name: redisHost
      value: localhost:6379
    - name: actorStateStore
      value: "true"
```

**Production Component (Azure Cache for Redis):**
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
spec:
  type: state.redis
  version: v1
  metadata:
    - name: redisHost
      secretKeyRef:
        name: redis-connection
        key: host
    - name: redisPassword
      secretKeyRef:
        name: redis-connection
        key: password
    - name: enableTLS
      value: "true"
    - name: actorStateStore
      value: "true"
```

**Code Example:**
```csharp
// Save state
await daprClient.SaveStateAsync("statestore", "user-session-123", sessionData);

// Get state
var session = await daprClient.GetStateAsync<UserSession>("statestore", "user-session-123");

// Delete state
await daprClient.DeleteStateAsync("statestore", "user-session-123");
```

### 3. Pub/Sub

**Purpose:** Asynchronous messaging between services with guaranteed delivery.

**Local Component (Redis Streams):**
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: pubsub
spec:
  type: pubsub.redis
  version: v1
  metadata:
    - name: redisHost
      value: localhost:6379
```

**Production Component (Azure Service Bus):**
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: pubsub
spec:
  type: pubsub.azure.servicebus.queues
  version: v1
  metadata:
    - name: connectionString
      secretKeyRef:
        name: servicebus-connection
        key: connectionString
    - name: maxDeliveryCount
      value: "5"
    - name: lockDurationInSec
      value: "60"
```

**Code Example:**
```csharp
// Publish event
await daprClient.PublishEventAsync("pubsub", "k12.roster.events", new RosterCertifiedEvent
{
    SchoolId = schoolId,
    StudentIds = certifiedStudents,
    CertifiedAt = DateTime.UtcNow
});

// Subscribe (in controller)
[Topic("pubsub", "k12.roster.events")]
[HttpPost("/events/roster-certified")]
public async Task<IActionResult> HandleRosterCertified([FromBody] RosterCertifiedEvent evt)
{
    // Process event
    return Ok();
}
```

### 4. Bindings

**Purpose:** Connect to external systems (storage, email, etc.) via declarative components.

**Local Component (File binding for documents):**
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: documents
spec:
  type: bindings.localstorage
  version: v1
  metadata:
    - name: rootPath
      value: ./local-documents
```

**Production Component (Azure Blob Storage):**
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: documents
spec:
  type: bindings.azure.blobstorage
  version: v1
  metadata:
    - name: storageAccount
      value: k12documents
    - name: storageAccessKey
      secretKeyRef:
        name: blob-storage
        key: accessKey
    - name: container
      value: enrollment-documents
```

**Code Example:**
```csharp
// Upload document
await daprClient.InvokeBindingAsync("documents", "create", documentBytes, new Dictionary<string, string>
{
    ["blobName"] = $"{applicationId}/{documentType}.pdf"
});

// Download document
var document = await daprClient.InvokeBindingAsync<byte[]>("documents", "get", null, new Dictionary<string, string>
{
    ["blobName"] = $"{applicationId}/{documentType}.pdf"
});
```

### 5. Secrets

**Purpose:** Secure access to secrets without hardcoding or environment variables.

**Local Component:**
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: secrets
spec:
  type: secretstores.local.file
  version: v1
  metadata:
    - name: secretsFile
      value: ./secrets/local-secrets.json
```

**Production Component (Azure Key Vault):**
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: secrets
spec:
  type: secretstores.azure.keyvault
  version: v1
  metadata:
    - name: vaultName
      value: k12-keyvault-prod
    - name: azureClientId
      value: "{managed-identity-client-id}"
```

**Code Example:**
```csharp
// Get secret
var secret = await daprClient.GetSecretAsync("secrets", "sendgrid-api-key");
var apiKey = secret["sendgrid-api-key"];

// Use in configuration
builder.Configuration.AddDaprSecretStore("secrets", new DaprSecretStoreOptions
{
    SecretDescriptors = new List<DaprSecretDescriptor>
    {
        new DaprSecretDescriptor("sendgrid-api-key"),
        new DaprSecretDescriptor("classwallet-api-key")
    }
});
```

### 6. Configuration

**Purpose:** Dynamic configuration with hot reload support.

**Local Component:**
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: config
spec:
  type: configuration.local.file
  version: v1
  metadata:
    - name: configFile
      value: ./config/local-config.json
```

**Production Component (Azure App Configuration):**
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: config
spec:
  type: configuration.azure.appconfig
  version: v1
  metadata:
    - name: host
      value: k12-appconfig.azconfig.io
    - name: connectionString
      secretKeyRef:
        name: appconfig
        key: connectionString
```

**Code Example:**
```csharp
// Get configuration
var config = await daprClient.GetConfiguration("config", new[] { "feature-flags", "enrollment-settings" });
var isFeatureEnabled = config.Items["feature-flags:new-enrollment-flow"].Value == "true";

// Subscribe to changes
await daprClient.SubscribeConfiguration("config", new[] { "feature-flags" }, (id, items) =>
{
    // Handle configuration change
    logger.LogInformation("Configuration updated: {Items}", items);
});
```

### 7. Workflows

**Purpose:** Long-running, durable workflow orchestration.

> **Note:** Dapr Workflows replaces Azure Durable Functions as the preferred workflow orchestration pattern. See [ADR-012](ADR-012-roster-workflow-orchestration.md) for migration guidance.

**Workflow Definition:**
```csharp
public class RosterCertificationWorkflow : Workflow<RosterCertificationInput, RosterCertificationResult>
{
    public override async Task<RosterCertificationResult> RunAsync(
        WorkflowContext context,
        RosterCertificationInput input)
    {
        // Step 1: Notify school of certification window
        await context.CallActivityAsync(
            nameof(NotifySchoolActivity),
            new NotifySchoolInput { SchoolId = input.SchoolId });

        // Step 2: Wait for certification deadline (with timeout)
        var certified = await context.WaitForExternalEventAsync<bool>(
            "certification-submitted",
            TimeSpan.FromDays(14));

        if (!certified)
        {
            // Step 3: Escalate uncertified roster
            await context.CallActivityAsync(
                nameof(EscalateUncertifiedActivity),
                new EscalateInput { SchoolId = input.SchoolId });
        }

        // Step 4: Process certified students
        var students = await context.CallActivityAsync<List<Student>>(
            nameof(GetCertifiedStudentsActivity),
            new GetStudentsInput { SchoolId = input.SchoolId });

        // Step 5: Fan-out - process each student in parallel
        var tasks = students.Select(s => context.CallActivityAsync(
            nameof(ProcessStudentCertificationActivity),
            new ProcessStudentInput { StudentId = s.Id }));

        await Task.WhenAll(tasks);

        return new RosterCertificationResult { Success = true };
    }
}
```

**Starting a Workflow:**
```csharp
var workflowId = await daprClient.StartWorkflowAsync(
    "dapr",
    nameof(RosterCertificationWorkflow),
    $"roster-{schoolId}-{DateTime.UtcNow:yyyyMM}",
    new RosterCertificationInput { SchoolId = schoolId });
```

### 8. Jobs

**Purpose:** Scheduled task execution (replaces Azure Functions Timer Triggers).

> **Note:** Dapr Jobs replaces Azure Functions Timer Triggers for scheduled tasks. This provides a consistent programming model and works in Container Apps without Azure Functions overhead.

**Job Definition:**
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: audit-cleanup-job
spec:
  type: bindings.cron
  version: v1
  metadata:
    - name: schedule
      value: "0 0 2 * * *"  # Daily at 2 AM
    - name: route
      value: /jobs/audit-cleanup
```

**Job Handler:**
```csharp
[HttpPost("/jobs/audit-cleanup")]
public async Task<IActionResult> HandleAuditCleanup()
{
    _logger.LogInformation("Starting daily audit log cleanup");

    await _auditService.ArchiveOldLogsAsync(olderThan: TimeSpan.FromDays(90));
    await _auditService.PurgeArchivedLogsAsync(olderThan: TimeSpan.FromDays(365));

    return Ok();
}
```

**Alternative: Dapr Jobs API (Preview):**
```csharp
// Schedule a job programmatically
await daprClient.ScheduleJobAsync(new Job
{
    Name = "enrollment-reminder",
    Schedule = "0 9 * * MON",  // Every Monday at 9 AM
    Data = new EnrollmentReminderInput { BatchSize = 100 }
});
```

## Aspire Integration

All Dapr components are configured in the Aspire AppHost for local development:

```csharp
// K12.AppHost/Program.cs
var builder = DistributedApplication.CreateBuilder(args);

// Add Dapr with all building blocks
builder.AddDapr(options =>
{
    options.DaprGrpcPort = 50001;
    options.DaprHttpPort = 3500;
    options.EnableTelemetry = true;
});

// Infrastructure
var redis = builder.AddRedis("redis");
var postgres = builder.AddPostgres("postgres");

// Configure Dapr components
builder.AddDaprStateStore("statestore", "state.redis", options =>
{
    options.Metadata.Add("redisHost", redis.Resource.ConnectionStringExpression);
});

builder.AddDaprPubSub("pubsub", "pubsub.redis", options =>
{
    options.Metadata.Add("redisHost", redis.Resource.ConnectionStringExpression);
});

builder.AddDaprSecretStore("secrets", "secretstores.local.file", options =>
{
    options.Metadata.Add("secretsFile", "./secrets/local-secrets.json");
});

// Add services with Dapr sidecars
var functions = builder.AddProject<K12_Functions>("k12-functions")
    .WithDaprSidecar("k12-functions");

var dab = builder.AddContainer("k12-dab", "mcr.microsoft.com/azure-databases/data-api-builder")
    .WithDaprSidecar("k12-dab");

builder.Build().Run();
```

## Migration from Azure SDKs

| Current Pattern | Dapr Replacement |
|-----------------|------------------|
| `BlobServiceClient` | Dapr Bindings (`bindings.azure.blobstorage`) |
| `ServiceBusClient` | Dapr Pub/Sub (`pubsub.azure.servicebus`) |
| `SecretClient` (Key Vault) | Dapr Secrets (`secretstores.azure.keyvault`) |
| `ConfigurationClient` | Dapr Configuration (`configuration.azure.appconfig`) |
| Timer Trigger Functions | Dapr Jobs (cron binding) |
| Durable Functions | Dapr Workflows |
| `IDistributedCache` | Dapr State Management |

## Validation

This decision will be validated through:

1. **POC (Week 1-2):** Implement Dapr for one workflow (roster certification)
2. **Integration Testing (Week 3-4):** Verify local dev matches production behavior
3. **Performance Testing (Week 5-6):** Confirm 80K user scale with Dapr overhead
4. **Production Deployment (Week 8+):** Gradual rollout starting with non-critical paths

## Related Decisions

- [ADR-PROP-001: Azure Container Functions on Container Apps](ADR-PROP-001-container-functions.md)
- [ADR-PROP-002: .NET Aspire Orchestration](ADR-PROP-002-aspire.md)
- [ADR-012: Roster Workflow Orchestration](ADR-012-roster-workflow-orchestration.md) (superseded by Dapr Workflows)
- [ADR-PROP-azure-service-bus-standard](ADR-PROP-azure-service-bus-standard.md)

## References

- [Dapr Documentation](https://docs.dapr.io/)
- [Dapr Building Blocks](https://docs.dapr.io/concepts/building-blocks-concept/)
- [Dapr on Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/dapr-overview)
- [.NET Aspire Dapr Integration](https://learn.microsoft.com/en-us/dotnet/aspire/frameworks/dapr)
- [Dapr Workflows](https://docs.dapr.io/developing-applications/building-blocks/workflow/)
- [Dapr Jobs (Preview)](https://docs.dapr.io/developing-applications/building-blocks/jobs/)

---

*Last Updated: December 2025*
