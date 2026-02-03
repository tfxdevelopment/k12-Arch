# Container Apps Development Setup Guide

## Overview
This guide covers deploying the K12 API to Azure Container Apps with VNet integration, Dapr, Redis, and Application Insights telemetry.

## Prerequisites
- Azure CLI installed and logged in (`az login`)
- Terraform >= 1.1.0
- Docker (for local image builds)
- Access to the `development` resource group

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ k12-vnet (10.0.0.0/16)                                      │
│                                                              │
│  ┌──────────────────────────────────────┐                   │
│  │ aca-infrastructure-subnet            │                   │
│  │ 10.0.0.0/23 (Container Apps)         │                   │
│  │  ┌────────────────────────────────┐  │                   │
│  │  │ Container App Environment      │  │                   │
│  │  │ - k12-api (with Dapr)          │  │                   │
│  │  │ - Application Insights         │  │                   │
│  │  └────────────────────────────────┘  │                   │
│  └──────────────────────────────────────┘                   │
│                                                              │
│  ┌──────────────────────────────────────┐                   │
│  │ apim-subnet (10.0.2.0/24)            │                   │
│  │ (Future: APIM integration)           │                   │
│  └──────────────────────────────────────┘                   │
│                                                              │
│  ┌──────────────────────────────────────┐                   │
│  │ redis-subnet (10.0.3.0/24)           │                   │
│  │  ┌────────────────────────────────┐  │                   │
│  │  │ Azure Redis Cache (Basic)      │  │                   │
│  │  │ - Dapr State Store             │  │                   │
│  │  │ - Dapr Pub/Sub                 │  │                   │
│  │  └────────────────────────────────┘  │                   │
│  └──────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘

External Services:
├─ Azure Container Registry (Basic SKU)
├─ Key Vault (existing: developmentapikv)
└─ Log Analytics + Application Insights
```

## Deployed Resources

### Networking
- **Virtual Network**: `10.0.0.0/16`
  - Container Apps Subnet: `10.0.0.0/23` (512 IPs)
  - APIM Subnet: `10.0.2.0/24` (256 IPs)
  - Redis Subnet: `10.0.3.0/24` (256 IPs)

### Container Apps
- **Environment**: `development-k12-cae`
  - VNet integrated (private networking)
  - Public ingress enabled for dev
  - Dapr enabled with Application Insights
- **App**: `development-app`
  - Image: `developmentk12acr.azurecr.io/k12-api:latest`
  - Min replicas: 1, Max: 5
  - CPU: 0.5, Memory: 1Gi
  - Health checks: `/health/live`, `/health/ready`

### Dapr Configuration
- **App ID**: `k12-api`
- **App Port**: 8080
- **Components**:
  - State Store: Redis (`statestore`)
  - Pub/Sub: Redis (`pubsub`)

### Supporting Services
- **Redis Cache**: Basic SKU (C0)
- **ACR**: Basic SKU
- **Application Insights**: Connected to Container App Environment
- **Key Vault**: Existing `developmentapikv` (secrets integrated)

## Deployment Steps

### 1. Initialize Terraform
```bash
cd terraform/environments/development
terraform init
```

### 2. Review Infrastructure Plan
```bash
terraform plan
```

**Expected new resources:**
- `azurerm_virtual_network.k12_vnet`
- `azurerm_subnet.aca_subnet`
- `azurerm_subnet.apim_subnet`
- `azurerm_subnet.redis_subnet`
- `azurerm_redis_cache.dapr_state`
- `azurerm_container_app_environment.api_env`
- `azurerm_container_app_environment_dapr_component.state_store`
- `azurerm_container_app_environment_dapr_component.pubsub`
- `azurerm_container_registry.acr`
- `azurerm_container_app.api_app`
- `azurerm_application_insights.aca_insights`
- `azurerm_log_analytics_workspace.aca_logs`

### 3. Apply Infrastructure
```bash
terraform apply
```

**Estimated deployment time**: 10-15 minutes

### 4. Store Secrets in Key Vault
```bash
# Get Key Vault name
KV_NAME=$(az keyvault list --resource-group development --query "[0].name" -o tsv)

# Store SQL connection string
az keyvault secret set \
  --vault-name $KV_NAME \
  --name "sql-connection-string" \
  --value "Server=tcp:development-api-enrollment.database.windows.net,1433;Initial Catalog=K12;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;Authentication=\"Active Directory Default\";"

# Store Blob Storage connection string
az keyvault secret set \
  --vault-name $KV_NAME \
  --name "blob-connection-string" \
  --value "your-blob-storage-connection-string"
```

### 5. Build and Push Container Image

#### Option A: Using ACR Build (Recommended)
```bash
# Get ACR name
ACR_NAME=$(az acr list --resource-group development --query "[?contains(name, 'k12acr')].name" -o tsv)

# Build and push from source (run from app root directory)
az acr build \
  --registry $ACR_NAME \
  --image k12-api:latest \
  --file Dockerfile .
```

#### Option B: Local Build and Push
```bash
# Login to ACR
az acr login --name $ACR_NAME

# Build locally
docker build -t $ACR_NAME.azurecr.io/k12-api:latest .

# Push to ACR
docker push $ACR_NAME.azurecr.io/k12-api:latest
```

### 6. Verify Deployment
```bash
# Get Container App URL
az containerapp show \
  --name development-app \
  --resource-group development \
  --query "properties.configuration.ingress.fqdn" -o tsv

# Test health endpoints
APP_URL=$(az containerapp show --name development-app --resource-group development --query "properties.configuration.ingress.fqdn" -o tsv)

curl https://$APP_URL/health/live
curl https://$APP_URL/health/ready
```

### 7. View Logs and Telemetry
```bash
# Stream container logs
az containerapp logs show \
  --name development-app \
  --resource-group development \
  --follow

# Open Application Insights in portal
az monitor app-insights component show \
  --app development-aca-insights \
  --resource-group development \
  --query "appId" -o tsv
```

## Application Requirements

Your application **must** implement the following endpoints:

### Health Check Endpoints
```csharp
// Startup.cs or Program.cs
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false // Basic liveness check
});

app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready")
});
```

### Dapr Integration (Optional)
```csharp
// State Store example
app.MapPost("/save-state", async (DaprClient daprClient, MyData data) =>
{
    await daprClient.SaveStateAsync("statestore", "mykey", data);
    return Results.Ok();
});

app.MapGet("/get-state", async (DaprClient daprClient) =>
{
    var data = await daprClient.GetStateAsync<MyData>("statestore", "mykey");
    return Results.Ok(data);
});

// Pub/Sub example
app.MapPost("/publish", async (DaprClient daprClient, MyEvent evt) =>
{
    await daprClient.PublishEventAsync("pubsub", "my-topic", evt);
    return Results.Ok();
});
```

### Application Insights Telemetry
```csharp
// Add to Program.cs
builder.Services.AddApplicationInsightsTelemetry(options =>
{
    options.ConnectionString = Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING");
});
```

## Configuration

### Environment Variables Available in Container
- `APPLICATIONINSIGHTS_CONNECTION_STRING`: Application Insights connection
- `ASPNETCORE_ENVIRONMENT`: Set to "Development"
- `ConnectionStrings__SqlDatabase`: From Key Vault secret
- `ConnectionStrings__BlobStorage`: From Key Vault secret
- Dapr environment variables (auto-injected):
  - `DAPR_HTTP_PORT`: 3500
  - `DAPR_GRPC_PORT`: 50001
  - `APP_ID`: k12-api

### Dapr Component Usage
```bash
# Test Dapr state store
curl -X POST https://$APP_URL/v1.0/state/statestore \
  -H "Content-Type: application/json" \
  -d '[{"key": "test", "value": "hello"}]'

# Get Dapr state
curl https://$APP_URL/v1.0/state/statestore/test
```

## Troubleshooting

### Container App won't start
```bash
# Check revision status
az containerapp revision list \
  --name development-app \
  --resource-group development \
  -o table

# View replica console logs
az containerapp logs show \
  --name development-app \
  --resource-group development \
  --tail 100
```

### Health check failures
- Ensure endpoints return HTTP 200
- Check startup probe timeout (60 seconds max)
- Verify application is listening on port 8080

### Key Vault access denied
```bash
# Verify Container App has access
az role assignment list \
  --scope "/subscriptions/.../resourceGroups/development/providers/Microsoft.KeyVault/vaults/developmentapikv" \
  --query "[?principalType=='ServicePrincipal'].{Name:principalName, Role:roleDefinitionName}"
```

### Dapr component issues
```bash
# Check Dapr components
az containerapp env dapr-component list \
  --name development-k12-cae \
  --resource-group development \
  -o table
```

## Cost Estimate (Development)

| Resource | SKU | Monthly Cost |
|----------|-----|--------------|
| Container App Environment | Consumption | ~$15 |
| Container App (1 replica, 0.5 CPU, 1Gi) | Consumption | ~$30 |
| Redis Cache | Basic C0 | ~$17 |
| ACR | Basic | ~$5 |
| VNet | Standard | ~$0 |
| Log Analytics | PerGB2018 | ~$5-10 |
| Application Insights | Pay-as-you-go | ~$5-10 |
| **Total** | | **~$77-87/month** |

## Scaling for Staging/Testing

For **staging** and **testing** environments, same configuration applies:
- Same SKUs (Basic/Consumption)
- Same VNet structure (`10.0.0.0/16`)
- Same Dapr configuration
- Different resource names (prefixed with `staging-` or `testing-`)

To deploy:
```bash
cd terraform/environments/staging
terraform init
terraform apply

cd terraform/environments/testing
terraform init
terraform apply
```

## Production Readiness

When ready for production, upgrade to:
- **ACR**: Premium SKU (geo-replication, zone redundancy)
- **Redis**: Standard or Premium SKU (zone redundancy, clustering)
- **Container App Environment**: Enable zone redundancy
- **Min Replicas**: Increase to 2+ for HA
- **Internal Load Balancer**: Enable for private access only
- **Application Gateway**: Add for WAF and external access control

See `terraform/docs/ACA_PRODUCTION_READINESS.md` for full checklist.

## Next Steps

1. ✅ Deploy infrastructure (`terraform apply`)
2. ✅ Build and push container image to ACR
3. ✅ Verify health checks are working
4. 🔜 Test Dapr state store and pub/sub
5. 🔜 Integrate APIM with Container App
6. 🔜 Set up CI/CD pipeline for automated deployments
7. 🔜 Configure monitoring alerts in Application Insights
