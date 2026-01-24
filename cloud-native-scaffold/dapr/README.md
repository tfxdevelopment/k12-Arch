# Dapr Configuration

This directory contains Dapr component and configuration files for the K12 Cloud Native application.

## Components

### State Store (`statestore.yaml`)
- **Type**: Redis
- **Usage**: Stores application state (enrollment applications, session data)
- **Local Development**: Uses local Redis instance at `localhost:6379`
- **Production**: Can be swapped to Azure Cosmos DB or Azure Table Storage

### Pub/Sub (`pubsub.yaml`)
- **Type**: Redis Streams
- **Usage**: Event-driven messaging between services
- **Local Development**: Uses local Redis instance
- **Production**: Can be swapped to Azure Service Bus or Azure Event Grid

### Secret Store (`secretstore.yaml`)
- **Type**: Local file-based
- **Usage**: Manages secrets for local development
- **Local Development**: Reads from `./dapr/secrets/secrets.json`
- **Production**: Swap to Azure Key Vault

## Configuration (`config.yaml`)

Dapr runtime configuration includes:
- **Tracing**: OpenTelemetry integration
- **Metrics**: Prometheus metrics exposure
- **Access Control**: Service-to-service authorization
- **Logging**: API request/response logging

## Running Dapr Locally

### Prerequisites
```bash
# Install Dapr CLI
curl -fsSL https://raw.githubusercontent.com/dapr/cli/master/install/install.sh | /bin/bash

# Initialize Dapr
dapr init

# Verify installation
dapr --version
```

### Running Services with Dapr

The .NET Aspire AppHost automatically configures Dapr sidecars. Alternatively, run manually:

```bash
# Enrollment API
dapr run --app-id enrollment-api \
         --app-port 5001 \
         --dapr-http-port 3501 \
         --dapr-grpc-port 50001 \
         --config ./dapr/config.yaml \
         --components-path ./dapr/components \
         -- dotnet run --project src/Api/K12.Api.Enrollment

# Programs API
dapr run --app-id programs-api \
         --app-port 5002 \
         --dapr-http-port 3502 \
         --dapr-grpc-port 50002 \
         --config ./dapr/config.yaml \
         --components-path ./dapr/components \
         -- dotnet run --project src/Api/K12.Api.Programs
```

## Production Configuration

For production, update component manifests to use Azure services:

### Azure Cosmos DB (State Store)
```yaml
spec:
  type: state.azure.cosmosdb
  metadata:
  - name: url
    value: https://yourcosmosdb.documents.azure.com:443/
  - name: masterKey
    secretKeyRef:
      name: cosmosdb-key
```

### Azure Service Bus (Pub/Sub)
```yaml
spec:
  type: pubsub.azure.servicebus
  metadata:
  - name: connectionString
    secretKeyRef:
      name: servicebus-connection-string
```

### Azure Key Vault (Secrets)
```yaml
spec:
  type: secretstores.azure.keyvault
  metadata:
  - name: vaultName
    value: your-keyvault-name
  - name: azureClientId
    value: your-client-id
```

## Best Practices

1. **Never commit secrets** to version control
2. **Use managed identities** in Azure (DefaultAzureCredential)
3. **Configure access control** for production service-to-service calls
4. **Enable distributed tracing** for observability
5. **Use scoped topics** for pub/sub to avoid cross-tenant events
