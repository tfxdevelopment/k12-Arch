# CONT-07: KEDA Scaling and Performance

**Status:** Active
**Date:** 2025-12-22
**Related ADR:** [ADR-PROP-001: Container Functions on Container Apps](./../07-adr-proposed/ADR-PROP-001-container-functions.md)

---

## Overview

K12 MyPortal uses **KEDA (Kubernetes Event-Driven Autoscaling)** through Azure Container Apps to handle the 80,000 concurrent user scale during peak enrollment periods. This document describes scaling strategies, configuration, and performance optimization.

## KEDA Integration in Container Apps

Azure Container Apps includes KEDA natively, providing:
- **HTTP Scaling**: Scale based on concurrent requests
- **Queue-Based Scaling**: Scale based on Azure Service Bus queue depth
- **Custom Metrics Scaling**: Scale based on Azure Monitor metrics
- **Scale-to-Zero**: Reduce costs during off-peak periods

---

## Scaling Configuration

### HTTP-Based Scaling (Primary)

```yaml
# container-app-scale.yaml
scale:
  minReplicas: 2     # Always maintain 2 replicas (no cold starts)
  maxReplicas: 100   # Peak enrollment capacity
  rules:
  - name: http-scaling
    http:
      metadata:
        concurrentRequests: "50"  # Scale when > 50 concurrent requests per replica
```

### Queue-Based Scaling (RDS Integration)

```yaml
# rds-processor-scale.yaml
scale:
  minReplicas: 1
  maxReplicas: 20
  rules:
  - name: queue-scaling
    custom:
      type: azure-servicebus
      metadata:
        queueName: rds-validation-requests
        messageCount: "5"    # Scale when > 5 messages pending
        namespace: k12-servicebus
      auth:
      - secretRef: servicebus-connection
        triggerParameter: connection
```

### Azure Monitor Metrics Scaling

```yaml
# database-scaling.yaml
scale:
  minReplicas: 2
  maxReplicas: 50
  rules:
  - name: cpu-scaling
    custom:
      type: azure-monitor
      metadata:
        resourceURI: /subscriptions/{sub}/resourceGroups/k12-rg/providers/Microsoft.App/containerApps/k12-api
        tenantId: {tenant-id}
        subscriptionId: {sub-id}
        resourceGroupName: k12-rg
        metricName: CpuUsage
        targetValue: "70"
        metricAggregationType: Average
```

---

## Scale Profiles by Environment

### Local Development (Aspire)

```csharp
// No KEDA in local - single instance per service
var api = builder.AddProject<Projects.K12_Api>("k12-api");
```

### Development Environment

| Service | Min Replicas | Max Replicas | Scaling Trigger |
|---------|--------------|--------------|-----------------|
| k12-api | 1 | 5 | HTTP (100 req/replica) |
| k12-metabase | 1 | 2 | HTTP (50 req/replica) |
| rds-processor | 0 | 3 | Queue (10 messages) |

### Production Environment

| Service | Min Replicas | Max Replicas | Scaling Trigger |
|---------|--------------|--------------|-----------------|
| k12-api | 5 | 100 | HTTP (50 req/replica) |
| k12-metabase | 2 | 5 | HTTP (100 req/replica) |
| rds-processor | 2 | 20 | Queue (5 messages) |
| background-jobs | 1 | 10 | Schedule (cron) |

---

## Scale-to-Zero Strategy

### Services That Scale to Zero

```yaml
# Scale-to-zero for batch processors
scale:
  minReplicas: 0    # Can scale to zero
  maxReplicas: 10
  rules:
  - name: queue-scaling
    custom:
      type: azure-servicebus
      metadata:
        queueName: batch-processing
        messageCount: "1"
```

**Candidate Services:**
- Background report generation
- Data export jobs
- Non-critical batch processing

### Services That Never Scale to Zero

```yaml
# Always-on for user-facing APIs
scale:
  minReplicas: 2    # Never scale below 2
  maxReplicas: 100
```

**Always-On Services:**
- k12-api (main API)
- k12-metabase (analytics)
- Authentication endpoints

---

## Enrollment Month Capacity Planning

### Peak Load Profile

| Time Period | Expected Users | Required Replicas | Notes |
|-------------|----------------|-------------------|-------|
| Normal (Jan-Jul) | 5K-10K | 5-10 | Baseline |
| Pre-Enrollment (Aug 1-14) | 20K-30K | 20-30 | Ramp-up |
| Enrollment Peak (Aug 15-31) | 60K-80K | 60-100 | Maximum scale |
| Post-Enrollment (Sep) | 15K-25K | 15-25 | Wind-down |

### Pre-Scaling for Peak

```bash
# Pre-scale before enrollment month
az containerapp update \
  --name k12-api \
  --resource-group k12-prod-rg \
  --min-replicas 20 \
  --max-replicas 100

# Return to normal after peak
az containerapp update \
  --name k12-api \
  --resource-group k12-prod-rg \
  --min-replicas 5 \
  --max-replicas 100
```

---

## Performance Optimization

### Container Resource Sizing

```yaml
# Optimal sizing for .NET 10 API containers
resources:
  cpu: 1.0      # 1 vCPU per replica
  memory: 2Gi   # 2GB RAM per replica
```

### Health Probes

```yaml
# Configure probes for fast failure detection
probes:
  - type: liveness
    httpGet:
      path: /health/live
      port: 8080
    initialDelaySeconds: 5
    periodSeconds: 10
    failureThreshold: 3
  - type: readiness
    httpGet:
      path: /health/ready
      port: 8080
    initialDelaySeconds: 5
    periodSeconds: 5
    failureThreshold: 3
  - type: startup
    httpGet:
      path: /health/startup
      port: 8080
    initialDelaySeconds: 0
    periodSeconds: 1
    failureThreshold: 30   # 30 seconds max startup
```

### Graceful Shutdown

```csharp
// Program.cs - Configure graceful shutdown
builder.Services.Configure<HostOptions>(options =>
{
    options.ShutdownTimeout = TimeSpan.FromSeconds(30);
});

// Handle SIGTERM for graceful drain
app.Lifetime.ApplicationStopping.Register(() =>
{
    // Complete in-flight requests
    // Close database connections
    // Flush telemetry
});
```

---

## Monitoring Scaling Events

### Azure Monitor Queries

```kusto
// Container Apps scaling events
ContainerAppSystemLogs
| where ContainerAppName_s == "k12-api"
| where Log_s contains "scaling"
| project TimeGenerated, Log_s, ReplicaCount_d
| order by TimeGenerated desc

// KEDA scaler activity
ContainerAppSystemLogs
| where Log_s contains "keda"
| project TimeGenerated, Log_s
| order by TimeGenerated desc
```

### Scaling Alerts

| Alert | Condition | Action |
|-------|-----------|--------|
| Max Scale Reached | Replicas = maxReplicas for 5 min | Page on-call |
| Scale Flapping | > 5 scale events in 10 min | Investigate |
| Scale-Up Latency | > 60 sec to add replica | Tune startup |
| Queue Backlog | > 1000 messages pending | Manual scale |

---

## Cost Optimization

### Per-Second Billing

Container Apps charges per second of vCPU and memory:
- **Development**: ~$100-200/month (low replica count)
- **Production Normal**: ~$500-800/month (5-10 replicas)
- **Production Peak**: ~$2,000-3,000/month (60-100 replicas)

### Cost Reduction Strategies

1. **Scale-to-Zero**: Non-critical services scale to 0 during off-hours
2. **Right-Sizing**: Use performance testing to determine optimal CPU/memory
3. **Reserved Capacity**: Pre-purchase for predictable baseline load
4. **Spot Instances**: Use for batch processing (when available)

---

## Terraform Configuration

```hcl
# modules/container-app/main.tf
resource "azurerm_container_app" "api" {
  name                         = "k12-api"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  template {
    container {
      name   = "k12-api"
      image  = "k12acr.azurecr.io/k12-api:${var.image_tag}"
      cpu    = 1.0
      memory = "2Gi"
    }

    min_replicas = var.environment == "prod" ? 5 : 1
    max_replicas = var.environment == "prod" ? 100 : 10

    http_scale_rule {
      name                = "http-scaling"
      concurrent_requests = var.environment == "prod" ? 50 : 100
    }
  }

  ingress {
    external_enabled = true
    target_port      = 8080
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}
```

---

## References

- [Azure Container Apps Scaling](https://learn.microsoft.com/en-us/azure/container-apps/scale-app)
- [KEDA Documentation](https://keda.sh/docs/)
- [KEDA Scalers](https://keda.sh/docs/scalers/)
- [Container Apps Pricing](https://azure.microsoft.com/en-us/pricing/details/container-apps/)

---

**Last Updated:** December 22, 2025
**Owner:** CFI Architecture Team
