# Dapr Components Configuration

This directory contains Dapr component configurations for the K12 Architecture Documentation workspace.

## Components Overview

### State Management

#### 1. Redis State Store (`statestore.yaml`)
Local development state store using Redis.

**Configuration:**
- **Host:** localhost:6379
- **Actor State Store:** Enabled
- **Use Case:** Local development and testing

**Usage:**
```csharp
// Save state
await daprClient.SaveStateAsync("statestore", "key", value);

// Get state
var result = await daprClient.GetStateAsync<T>("statestore", "key");
```

#### 2. Azure Cosmos DB State Store (`cosmosdb-statestore.yaml`)
Production-ready state store using Azure Cosmos DB.

**Configuration:**
- **Database:** k12-architecture
- **Collection:** statestore
- **Actor State Store:** Enabled
- **Use Case:** Production deployments

**Setup:**
1. Create Azure Cosmos DB account
2. Update `url` with your Cosmos DB endpoint
3. Store master key in secrets component
4. Reference secret in `masterKey` field

### Pub/Sub Messaging

#### 1. Redis Pub/Sub (`pubsub.yaml`)
Local development message broker using Redis.

**Configuration:**
- **Host:** localhost:6379
- **Use Case:** Local development and testing

**Usage:**
```csharp
// Publish event
await daprClient.PublishEventAsync("pubsub", "topic-name", eventData);

// Subscribe to events (in your API)
app.MapPost("/events/{topicName}", async (TopicData data) => {
    // Process event
});
```

#### 2. Azure Service Bus (`servicebus.yaml`)
Enterprise-grade message broker using Azure Service Bus.

**Configuration:**
- **Type:** Topics (pub/sub pattern)
- **Consumer ID:** docs-api
- **Entity Management:** Enabled (auto-creates topics)
- **Use Case:** Production deployments

**Setup:**
1. Create Azure Service Bus namespace
2. Update `namespaceName` with your namespace
3. Store connection string in secrets component
4. Reference secret in `connectionString` field

### Workflows (`workflow.yaml`)

Dapr Workflow engine for orchestrating long-running business processes.

**Configuration:**
- **Backend:** Actors (uses actor state store)
- **Use Case:** Document processing workflows, approval processes

**Example Workflow:**
```csharp
public class DocumentProcessingWorkflow : Workflow<DocumentInput, DocumentOutput>
{
    public override async Task<DocumentOutput> RunAsync(WorkflowContext context, DocumentInput input)
    {
        var validated = await context.CallActivityAsync<bool>("ValidateDocument", input);
        if (!validated) throw new Exception("Validation failed");
        
        var processed = await context.CallActivityAsync<ProcessedDoc>("ProcessDocument", input);
        await context.CallActivityAsync("NotifyUser", processed);
        
        return new DocumentOutput { Status = "Completed" };
    }
}
```

### Secrets Management (`secrets.yaml`)

Azure Key Vault integration for secure secrets management.

**Configuration:**
- **Vault Name:** Your Key Vault name
- **Authentication:** Service Principal (Client ID + Secret)
- **Use Case:** Production secrets management

**Setup:**
1. Create Azure Key Vault
2. Create App Registration (Service Principal)
3. Grant Service Principal access to Key Vault
4. Update `vaultName`, `azureClientId`, and `azureTenantId`
5. Store client secret securely (use managed identity in production)

**Usage:**
```csharp
// Get secret
var secret = await daprClient.GetSecretAsync("keyvault-secrets", "my-secret-key");
```

### Bindings

#### Azure Blob Storage (`blobstorage.yaml`)

Output binding for storing files in Azure Blob Storage.

**Configuration:**
- **Container:** architecture-docs
- **Access Level:** None (private)
- **Use Case:** Document storage, file uploads

**Setup:**
1. Create Azure Storage Account
2. Update `accountName`
3. Store account key in secrets component
4. Container will be created automatically

**Usage:**
```csharp
// Upload file to blob storage
await daprClient.InvokeBindingAsync("blobstorage", "create", new
{
    blobName = "docs/file.pdf",
    data = fileBytes
});
```

### Configuration Management (`appconfiguration.yaml`)

Azure App Configuration for centralized configuration management.

**Configuration:**
- **Subscribe Poll Interval:** 24 hours
- **Max Retries:** 3
- **Use Case:** Dynamic configuration, feature flags

**Setup:**
1. Create Azure App Configuration store
2. Store connection string in secrets component
3. Add configuration keys in Azure portal

**Usage:**
```csharp
// Get configuration
var configs = await daprClient.GetConfiguration("appconfiguration", 
    new List<string> { "FeatureFlags:EnableNewUI", "Settings:MaxFileSize" });
```

### Dapr Configuration (`dapr-config.yaml`)

Global Dapr runtime configuration.

**Features Enabled:**
- **Tracing:** OpenTelemetry with 100% sampling
- **Metrics:** Prometheus-compatible metrics
- **mTLS:** Disabled for local development
- **API Access Control:** Allow all APIs
- **Name Resolution:** mDNS for service discovery

**Production Recommendations:**
- Enable mTLS for service-to-service security
- Configure access control policies
- Set up distributed tracing backend (Zipkin, Jaeger, or Azure Monitor)
- Reduce sampling rate for tracing (e.g., 0.1 = 10%)

## Environment-Specific Configuration

### Local Development

Use Redis-based components:
- `statestore.yaml` (Redis)
- `pubsub.yaml` (Redis)
- `dapr-config.yaml` with mTLS disabled

### Production

Use Azure-based components:
- `cosmosdb-statestore.yaml` (Cosmos DB)
- `servicebus.yaml` (Azure Service Bus)
- `secrets.yaml` (Azure Key Vault)
- `blobstorage.yaml` (Azure Blob Storage)
- `appconfiguration.yaml` (Azure App Configuration)
- Update `dapr-config.yaml` to enable mTLS

## Component Scopes

Components can be scoped to specific apps using the `scopes` field:

```yaml
scopes:
  - docs-api
  - other-service
```

This restricts access to the component to only the specified app IDs.

## Best Practices

1. **Secrets Management:**
   - Never commit secrets to source control
   - Use secret references in component configs
   - Use managed identities in Azure for production

2. **State Management:**
   - Use consistent hashing for partitioning
   - Enable TTL for temporary state
   - Use transactions for multi-key operations

3. **Pub/Sub:**
   - Use topics for event-driven architectures
   - Implement idempotent consumers
   - Handle dead-letter queues for failed messages

4. **Workflows:**
   - Keep workflow steps idempotent
   - Use compensation activities for rollback
   - Monitor workflow execution through Dapr dashboard

5. **Configuration:**
   - Use feature flags for gradual rollouts
   - Implement configuration change subscriptions
   - Version your configuration keys

## Testing Components

### Test State Store
```bash
dapr run --app-id test-app --app-port 5000 --dapr-http-port 3500 \
  --components-path ./src/K12.AppHost/components
```

### Test Pub/Sub
```bash
# Publisher
curl -X POST http://localhost:3500/v1.0/publish/pubsub/test-topic \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Dapr"}'

# Subscriber endpoint in your app
POST /events/test-topic
```

### Test Workflows
```bash
# Start workflow
curl -X POST http://localhost:3500/v1.0-alpha1/workflows/dapr/DocumentProcessingWorkflow/start \
  -H "Content-Type: application/json" \
  -d '{"input": {"documentId": "123"}}'
```

## Monitoring and Troubleshooting

### View Component Status
```bash
dapr components -k
```

### Check Dapr Logs
```bash
dapr logs --app-id docs-api
```

### Aspire Dashboard
Navigate to `https://localhost:17241` to view:
- Component health and status
- Distributed traces across services
- Metrics and performance data

## Additional Resources

- [Dapr Components Documentation](https://docs.dapr.io/reference/components-reference/)
- [Dapr Workflow](https://docs.dapr.io/developing-applications/building-blocks/workflow/)
- [Azure Integration](https://docs.dapr.io/operations/components/setup-state-store/supported-state-stores/setup-azure-cosmosdb/)
- [Production Deployment](https://docs.dapr.io/operations/hosting/kubernetes/)

## Contributing

When adding new components:
1. Create YAML file in this directory
2. Document configuration options above
3. Provide usage examples
4. Test locally before committing
5. Update this README

## License

Copyright (c) 2024 CFI Group. All rights reserved.
