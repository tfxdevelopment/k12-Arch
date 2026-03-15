# Dapr Integration Guide for K12 Container Apps

## Overview
Dapr (Distributed Application Runtime) provides building blocks for microservices communication, state management, and pub/sub messaging in the K12 Container Apps environment.

## Dapr Components Configured

### 1. State Store (Redis)
- **Component Name**: `statestore`
- **Type**: `state.redis`
- **Backend**: Azure Redis Cache (Basic SKU)
- **TLS**: Enabled
- **Available to**: `k12-api` app

### 2. Pub/Sub (Redis)
- **Component Name**: `pubsub`
- **Type**: `pubsub.redis`
- **Backend**: Azure Redis Cache (same instance)
- **TLS**: Enabled
- **Available to**: `k12-api` app

## Application Integration

### .NET Setup

#### 1. Add Dapr SDK
```xml
<!-- Add to .csproj -->
<PackageReference Include="Dapr.AspNetCore" Version="1.13.0" />
<PackageReference Include="Dapr.Client" Version="1.13.0" />
```

#### 2. Configure Dapr in Program.cs
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add Dapr
builder.Services.AddControllers().AddDapr();
builder.Services.AddDaprClient();

var app = builder.Build();

// Use Cloud Events for pub/sub
app.UseCloudEvents();

// Map Dapr subscriptions
app.MapSubscribeHandler();

app.Run();
```

### State Management Examples

#### Save State
```csharp
using Dapr.Client;

[ApiController]
[Route("api/[controller]")]
public class EnrollmentController : ControllerBase
{
    private readonly DaprClient _daprClient;
    
    public EnrollmentController(DaprClient daprClient)
    {
        _daprClient = daprClient;
    }
    
    [HttpPost("save-application")]
    public async Task<IActionResult> SaveApplication(Application application)
    {
        // Save to Dapr state store
        await _daprClient.SaveStateAsync(
            "statestore",                    // Component name
            $"application-{application.Id}", // Key
            application                      // Value
        );
        
        return Ok();
    }
}
```

#### Get State
```csharp
[HttpGet("application/{id}")]
public async Task<IActionResult> GetApplication(string id)
{
    var application = await _daprClient.GetStateAsync<Application>(
        "statestore",
        $"application-{id}"
    );
    
    if (application == null)
        return NotFound();
    
    return Ok(application);
}
```

#### Delete State
```csharp
[HttpDelete("application/{id}")]
public async Task<IActionResult> DeleteApplication(string id)
{
    await _daprClient.DeleteStateAsync(
        "statestore",
        $"application-{id}"
    );
    
    return NoContent();
}
```

#### Transactional State Operations
```csharp
[HttpPost("batch-save")]
public async Task<IActionResult> BatchSave(List<Application> applications)
{
    var operations = applications.Select(app => 
        new StateTransactionRequest(
            $"application-{app.Id}",
            JsonSerializer.SerializeToUtf8Bytes(app),
            StateOperationType.Upsert
        )
    ).ToList();
    
    await _daprClient.ExecuteStateTransactionAsync(
        "statestore",
        operations
    );
    
    return Ok();
}
```

### Pub/Sub Examples

#### Publish Event
```csharp
[HttpPost("submit-application")]
public async Task<IActionResult> SubmitApplication(Application application)
{
    // Save application
    await _daprClient.SaveStateAsync("statestore", $"application-{application.Id}", application);
    
    // Publish event
    await _daprClient.PublishEventAsync(
        "pubsub",                           // Component name
        "application-submitted",            // Topic
        new ApplicationSubmittedEvent
        {
            ApplicationId = application.Id,
            SubmittedAt = DateTime.UtcNow,
            ApplicantEmail = application.ApplicantEmail
        }
    );
    
    return Ok();
}
```

#### Subscribe to Events
```csharp
[Topic("pubsub", "application-submitted")]
[HttpPost("on-application-submitted")]
public async Task<IActionResult> OnApplicationSubmitted(ApplicationSubmittedEvent evt)
{
    // Process event
    _logger.LogInformation("Application {Id} submitted at {Time}", 
        evt.ApplicationId, evt.SubmittedAt);
    
    // Send notification email
    await _emailService.SendConfirmationEmail(evt.ApplicantEmail);
    
    return Ok();
}
```

#### Subscribe with Custom Route
```csharp
// In Program.cs
app.MapPost("/events/application-status-changed", 
    [Topic("pubsub", "application-status-changed")] 
    async (ApplicationStatusChangedEvent evt, ILogger<Program> logger) =>
{
    logger.LogInformation("Application {Id} status changed to {Status}", 
        evt.ApplicationId, evt.NewStatus);
    
    return Results.Ok();
});
```

## Service-to-Service Communication

If you add more Container Apps, they can communicate via Dapr service invocation:

```csharp
// From k12-api to another service (e.g., k12-notifications)
var response = await _daprClient.InvokeMethodAsync<NotificationRequest, NotificationResponse>(
    HttpMethod.Post,
    "k12-notifications",              // Target app ID
    "api/notifications/send",         // Target endpoint
    new NotificationRequest
    {
        To = "user@example.com",
        Subject = "Application Received"
    }
);
```

## Testing Dapr Locally

### 1. Install Dapr CLI
```bash
# Windows (PowerShell)
powershell -Command "iwr -useb https://raw.githubusercontent.com/dapr/cli/master/install/install.ps1 | iex"

# Initialize Dapr
dapr init
```

### 2. Run Application with Dapr
```bash
# From application directory
dapr run --app-id k12-api --app-port 8080 --dapr-http-port 3500 -- dotnet run
```

### 3. Test Dapr APIs
```bash
# Save state
curl -X POST http://localhost:3500/v1.0/state/statestore \
  -H "Content-Type: application/json" \
  -d '[
    {
      "key": "test-application",
      "value": {"id": "123", "name": "Test"}
    }
  ]'

# Get state
curl http://localhost:3500/v1.0/state/statestore/test-application

# Publish event
curl -X POST http://localhost:3500/v1.0/publish/pubsub/test-topic \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Dapr"}'
```

## Monitoring Dapr in Container Apps

### View Dapr Logs
```bash
# Container App logs include Dapr sidecar logs
az containerapp logs show \
  --name development-app \
  --resource-group development \
  --follow
```

### Application Insights Integration
Dapr telemetry is automatically sent to Application Insights. View:
- Service Map: See Dapr component interactions
- Dependency Tracking: Redis calls, service invocations
- Custom Events: Pub/sub messages

### Health Checks
Dapr sidecar exposes health endpoints:
- `http://localhost:3500/v1.0/healthz`: Overall health
- `http://localhost:3500/v1.0/healthz/outbound`: Outbound component health

## Best Practices

### 1. State Keys
Use consistent naming conventions:
```csharp
// Good
$"application-{id}"
$"user-{userId}"
$"enrollment-{programId}-{applicantId}"

// Avoid
$"{id}"
$"temp123"
```

### 2. Error Handling
```csharp
try
{
    await _daprClient.SaveStateAsync("statestore", key, value);
}
catch (DaprException ex)
{
    _logger.LogError(ex, "Failed to save state for key {Key}", key);
    // Implement retry logic or fallback
}
```

### 3. Pub/Sub Reliability
```csharp
[Topic("pubsub", "critical-events", DeadLetterTopic = "critical-events-dlq")]
[HttpPost("process-critical-event")]
public async Task<IActionResult> ProcessCriticalEvent(CriticalEvent evt)
{
    try
    {
        await ProcessEvent(evt);
        return Ok(); // Success - message acknowledged
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Failed to process event");
        return StatusCode(500); // Failure - Dapr will retry
    }
}
```

### 4. State TTL (Time-to-Live)
```csharp
var metadata = new Dictionary<string, string>
{
    { "ttlInSeconds", "3600" } // Expire after 1 hour
};

await _daprClient.SaveStateAsync(
    "statestore",
    "temp-session-data",
    sessionData,
    metadata: metadata
);
```

## Configuration Reference

### Dapr Sidecar Configuration
In Container App:
```terraform
dapr {
  app_id       = "k12-api"
  app_port     = 8080
  app_protocol = "http"
}
```

### Environment Variables (Auto-set by Dapr)
- `DAPR_HTTP_PORT`: 3500
- `DAPR_GRPC_PORT`: 50001
- `APP_ID`: k12-api

### Component Scoping
Components are scoped to `k12-api`. To make available to other apps:
```terraform
resource "azurerm_container_app_environment_dapr_component" "state_store" {
  # ...
  scopes = ["k12-api", "k12-notifications", "k12-admin"]
}
```

## Troubleshooting

### Issue: State operations fail
```bash
# Check Redis connectivity
az redis show --name development-k12-redis --resource-group development

# Test Redis directly
redis-cli -h development-k12-redis.redis.cache.windows.net -p 6380 -a <password> --tls
```

### Issue: Pub/sub not working
- Verify subscriber has correct `[Topic]` attribute
- Check that route matches Dapr subscription expectations
- View Dapr logs for subscription registration

### Issue: Service invocation fails
- Ensure target app has Dapr enabled
- Verify app-id matches exactly
- Check network connectivity between apps

## References
- [Dapr State Management API](https://docs.dapr.io/reference/api/state_api/)
- [Dapr Pub/Sub API](https://docs.dapr.io/reference/api/pubsub_api/)
- [Dapr Service Invocation](https://docs.dapr.io/reference/api/service_invocation_api/)
- [Dapr .NET SDK](https://docs.dapr.io/developing-applications/sdks/dotnet/)
- [Azure Container Apps Dapr](https://learn.microsoft.com/en-us/azure/container-apps/dapr-overview)
