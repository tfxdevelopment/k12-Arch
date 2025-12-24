# ADR-PROP-006: Dapr for Microservices Patterns with Comprehensive Building Blocks

## Status
Proposed

## Context
The K12 MyPortal platform requires distributed application patterns including:
- Long-running workflow orchestration (enrollment processing, document verification)
- Event-driven pub/sub messaging between services
- Secure state management for workflows and application data
- Centralized configuration management
- Secure secrets handling
- Integration with external systems via bindings
- Service-to-service communication with zero-trust security (mTLS)

We need a solution that works seamlessly with:
- **.NET 10** for all services
- **Aspire 13.1** for local development orchestration
- **Azure Functions 2.x** for serverless compute
- **Azure Container Apps** for production hosting

## Decision
We will adopt **Dapr 1.14** with all building blocks to provide enterprise-grade distributed system capabilities.

### Dapr Building Blocks Selected

#### 1. Workflow
- **Purpose**: Orchestrate long-running business processes
- **Use Cases**: 
  - Student data synchronization across systems
  - Multi-step enrollment processing with human approvals
  - Document verification workflows with retry logic
  - RDS residency determination process orchestration
- **Implementation**: Dapr Workflow with durable execution

#### 2. State Management
- **Purpose**: Distributed state store for workflow persistence and app state
- **Backing Store**: Azure Redis (Premium tier for persistence)
- **Use Cases**:
  - Workflow state persistence
  - Application session state
  - Distributed caching
  - Actor state (if needed for future patterns)

#### 3. Pub/Sub Messaging
- **Purpose**: Event-driven communication between services
- **Backing Service**: Azure Service Bus (Standard tier)
- **Use Cases**:
  - Enrollment event notifications
  - Student data change events
  - Cross-application integration events
  - Audit log event streaming

#### 4. Input/Output Bindings
- **Purpose**: Trigger code from external events, invoke external systems
- **Integrations**:
  - Azure Storage Queues (enrollment processing queue)
  - Azure Event Grid (system-wide events)
  - Azure Blob Storage (document uploads)
  - Future: SendGrid, ClassWallet webhooks
- **Use Cases**:
  - Process messages from queues without polling
  - React to blob storage changes
  - Send notifications via external services

#### 5. Configuration Management
- **Purpose**: Centralized application configuration
- **Backing Service**: Azure App Configuration
- **Use Cases**:
  - Feature flags for gradual rollouts
  - Environment-specific settings
  - Dynamic configuration updates without redeployment
  - A/B testing configuration

#### 6. Secrets Management
- **Purpose**: Secure credential storage and retrieval
- **Backing Service**: Azure Key Vault
- **Use Cases**:
  - Database connection strings
  - API keys for external services (Class Wallet, SendGrid, PandaDoc)
  - Encryption keys
  - Service principal credentials

#### 7. Service Invocation
- **Purpose**: Secure, reliable service-to-service calls
- **Features**: mTLS encryption, automatic retries, service discovery
- **Use Cases**:
  - Azure Functions calling workflow service
  - Workflow service calling Azure Functions
  - Cross-service API calls with automatic mTLS

## Architecture Integration

### Local Development with Aspire 13.1

```csharp
// K12.AppHost/Program.cs
var builder = DistributedApplication.CreateBuilder(args);

// Add Dapr with telemetry
builder.AddDapr(options =>
{
    options.EnableTelemetry = true;
    options.DaprPath = "../dapr";
});

// Add backing services
var redis = builder.AddRedis("redis").WithDataVolume();
var serviceBus = builder.AddAzureServiceBus("servicebus");
var keyVault = builder.AddAzureKeyVault("keyvault");
var appConfig = builder.AddAzureAppConfiguration("appconfig");
var storage = builder.AddAzureStorage("storage");

// Add workflow service with Dapr sidecar
var workflows = builder.AddProject<Projects.K12_Workflows>("workflows")
    .WithDaprSidecar(new DaprSidecarOptions
    {
        AppId = "k12-workflows",
        AppPort = 5001,
        Config = "../dapr/config.yaml",
        ResourcesPath = "../dapr/components"
    })
    .WithReference(redis)
    .WithReference(serviceBus)
    .WithReference(keyVault)
    .WithReference(appConfig)
    .WithReference(storage);

// Add Azure Functions with Dapr sidecar
var functions = builder.AddAzureFunctionsProject<Projects.K12_Functions>("functions")
    .WithDaprSidecar(new DaprSidecarOptions
    {
        AppId = "k12-functions",
        AppPort = 7071,
        Config = "../dapr/config.yaml",
        ResourcesPath = "../dapr/components"
    })
    .WithReference(workflows)
    .WithReference(redis)
    .WithReference(serviceBus);
```

### Production Deployment (Azure Container Apps)

```csharp
if (builder.ExecutionContext.IsPublishMode)
{
    var containerEnv = builder.AddAzureContainerAppEnvironment("k12-env");
    
    workflows.PublishAsAzureContainerApp((infra, app) =>
    {
        app.Template.Dapr = new ContainerAppDaprConfiguration
        {
            AppId = "k12-workflows",
            AppPort = 5001,
            Enabled = true,
            EnableApiLogging = true,
            LogLevel = DaprLogLevel.Info
        };
    });

    functions.PublishAsAzureContainerApp((infra, app) =>
    {
        app.Template.Dapr = new ContainerAppDaprConfiguration
        {
            AppId = "k12-functions",
            AppPort = 7071,
            Enabled = true
        };
    });
}
```

## Component Configuration

### State Store (Redis)
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
    value: <redis-connection>
  - name: actorStateStore
    value: "true"
```

### Pub/Sub (Azure Service Bus)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: pubsub
spec:
  type: pubsub.azure.servicebus.topics
  version: v1
  metadata:
  - name: namespaceName
    value: <servicebus-namespace>
  - name: connectionString
    secretKeyRef:
      name: servicebus-conn
      key: value
```

### Secrets (Azure Key Vault)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: azurekeyvault
spec:
  type: secretstores.azure.keyvault
  version: v1
  metadata:
  - name: vaultName
    value: k12-myportal-kv
  - name: azureClientId
    value: <managed-identity-client-id>
```

### Configuration (Azure App Configuration)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: appconfiguration
spec:
  type: configuration.azure.appconfig
  version: v1
  metadata:
  - name: connectionString
    secretKeyRef:
      name: appconfig-conn
      key: value
```

### Binding (Storage Queue)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: enrollment-queue
spec:
  type: bindings.azure.storagequeues
  version: v1
  metadata:
  - name: storageAccount
    value: k12myportalsa
  - name: queue
    value: enrollment-processing
  - name: storageAccessKey
    secretKeyRef:
      name: storage-key
      key: value
```

## Consequences

### Positive
- **Unified Pattern**: Single API surface for all distributed patterns
- **Portability**: Can run anywhere Dapr runs (local, Container Apps, Kubernetes)
- **Zero-Trust Security**: Automatic mTLS between all services
- **Simplified Code**: No direct SDK dependencies on Azure-specific libraries
- **Observability**: Built-in OpenTelemetry tracing and metrics
- **Aspire Integration**: First-class support in Aspire 13.1
- **Azure Functions Support**: Official integration with Functions Worker 2.x
- **Cost Optimization**: Use Dapr Workflow instead of Durable Functions (simpler, more portable)

### Negative
- **Learning Curve**: Team needs to learn Dapr concepts
- **Additional Complexity**: Sidecar pattern adds deployment complexity
- **Debugging**: Distributed tracing required for multi-service debugging
- **Version Management**: Must keep Dapr versions aligned across environments

### Risks
- **Dapr Maturity**: While v1.x is stable, newer features may have edge cases
- **Azure Container Apps Dapr Version**: Must use Dapr version supported by Container Apps
- **Migration Effort**: Existing code needs refactoring to use Dapr APIs

## Alternatives Considered

### Alternative 1: Azure-Specific SDKs Directly
- **Pros**: Native Azure integration, well-documented
- **Cons**: Tight coupling to Azure, no local development parity, more code

### Alternative 2: Durable Functions Only
- **Pros**: Mature, well-supported by Microsoft
- **Cons**: Functions-specific, doesn't help with pub/sub or state management patterns, vendor lock-in

### Alternative 3: Custom Abstraction Layer
- **Pros**: Full control
- **Cons**: High development cost, ongoing maintenance burden

## Implementation Plan

1. **Phase 1** (Sprint 1-2): Setup Dapr components, Aspire configuration
2. **Phase 2** (Sprint 3-4): Implement workflow building block for student sync
3. **Phase 3** (Sprint 5-6): Add pub/sub for enrollment events
4. **Phase 4** (Sprint 7-8): Integrate secrets, configuration, bindings
5. **Phase 5** (Sprint 9-10): Production deployment to Azure Container Apps

## References
- [Dapr Documentation](https://docs.dapr.io/)
- [Aspire 13.1 Dapr Integration](https://aspire.dev/integrations/dapr/)
- [Azure Functions with Aspire](https://learn.microsoft.com/en-us/azure/azure-functions/dotnet-aspire-integration)
- [Azure Container Apps Dapr Integration](https://learn.microsoft.com/en-us/azure/container-apps/dapr-overview)
- [ADR-009: Observability Strategy](../../adr/009-observability-strategy.md)

## Decision Date
December 22, 2025

## Decision Makers
- Architecture Team
- Lead Developers

## Related ADRs
- ADR-PROP-001: Container Functions on Container Apps
- ADR-PROP-002: .NET Aspire Orchestration
- ADR-009: Observability Strategy
