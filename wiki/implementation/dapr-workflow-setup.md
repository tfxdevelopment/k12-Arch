# Dapr Workflow Implementation Guide (.NET 10 + Aspire 13.1)

## Overview
Implementation of Dapr Workflow with comprehensive Dapr building blocks for K12 MyPortal distributed application using .NET 10 and Aspire 13.1.

## Dapr Building Blocks Used

1. **Workflow** - Orchestration of long-running business processes (student sync, enrollment processing)
2. **State Management** - Redis-backed state store for workflow persistence and app state
3. **Pub/Sub** - Azure Service Bus for event-driven communication
4. **Bindings** - Input/output bindings for Azure Storage Queues, Event Grid
5. **Configuration** - Azure App Configuration for centralized settings
6. **Secrets** - Azure Key Vault for secure credential management
7. **Service Invocation** - mTLS-secured service-to-service calls

## Project Structure

```
src/
├── K12.Workflows/
│   ├── Workflows/
│   │   ├── StudentSyncWorkflow.cs
│   │   ├── EnrollmentProcessingWorkflow.cs
│   │   └── DocumentVerificationWorkflow.cs
│   ├── Activities/
│   │   ├── FetchStudentDataActivity.cs
│   │   ├── TransformDataActivity.cs
│   │   ├── PublishEventActivity.cs
│   │   └── ValidateDocumentActivity.cs
│   └── Program.cs
├── K12.Functions/
│   ├── WorkflowTriggers.cs
│   ├── host.json
│   └── Program.cs
├── K12.AppHost/
│   └── Program.cs (Aspire 13.1)
├── K12.ServiceDefaults/
│   └── Extensions.cs (OpenTelemetry)
└── dapr/
    ├── config.yaml
    └── components/
        ├── statestore.yaml
        ├── pubsub.yaml
        ├── secrets.yaml
        ├── configuration.yaml
        └── bindings.yaml
```

## NuGet Packages

### K12.Workflows.csproj (.NET 10)
```xml
<Project Sdk="Microsoft.NET.Sdk.Worker">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Dapr.Workflow" Version="1.14.0" />
    <PackageReference Include="Dapr.AspNetCore" Version="1.14.0" />
    <PackageReference Include="Dapr.Client" Version="1.14.0" />
    <PackageReference Include="Microsoft.Extensions.Hosting" Version="10.0.0" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\K12.ServiceDefaults\K12.ServiceDefaults.csproj" />
  </ItemGroup>
</Project>
```

### K12.AppHost.csproj (Aspire 13.1)
```xml
<Project Sdk="Aspire.AppHost.Sdk/13.1.0">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <UserSecretsId>k12-myportal-secrets</UserSecretsId>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Aspire.Hosting.Dapr" Version="13.1.0" />
    <PackageReference Include="Aspire.Hosting.Azure.Functions" Version="13.1.0" />
    <PackageReference Include="Aspire.Hosting.Redis" Version="13.1.0" />
    <PackageReference Include="Aspire.Hosting.Azure.ServiceBus" Version="13.1.0" />
    <PackageReference Include="Aspire.Hosting.Azure.Storage" Version="13.1.0" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\K12.Workflows\K12.Workflows.csproj" />
    <ProjectReference Include="..\K12.Functions\K12.Functions.csproj" />
  </ItemGroup>
</Project>
```

### K12.Functions.csproj (.NET 10 + Functions Worker 2.x)
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <AzureFunctionsVersion>v4</AzureFunctionsVersion>
    <OutputType>Exe</OutputType>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="2.0.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="2.0.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http" Version="4.0.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Dapr" Version="1.2.0" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\K12.ServiceDefaults\K12.ServiceDefaults.csproj" />
  </ItemGroup>
</Project>
```

## Dapr Components Configuration

### dapr/components/statestore.yaml
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
  - name: redisPassword
    secretKeyRef:
      name: redis-password
      key: redis-password
  - name: actorStateStore
    value: "true"
```

### dapr/components/pubsub.yaml
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
    value: "<your-servicebus-namespace>.servicebus.windows.net"
  - name: consumerID
    value: "k12-workflows"
  - name: connectionString
    secretKeyRef:
      name: servicebus-connectionstring
      key: value
```

### dapr/components/secrets.yaml
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
    value: "k12-myportal-kv"
  - name: azureClientId
    value: "<managed-identity-client-id>"
```

### dapr/components/configuration.yaml
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
      name: appconfig-connectionstring
      key: value
  - name: subscribeAllChanges
    value: "true"
```

### dapr/components/bindings.yaml
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
    value: "k12myportalsa"
  - name: queue
    value: "enrollment-processing"
  - name: storageAccessKey
    secretKeyRef:
      name: storage-access-key
      key: value
```

## Aspire 13.1 AppHost Configuration

```csharp
// K12.AppHost/Program.cs
var builder = DistributedApplication.CreateBuilder(args);

// Azure resources
var storage = builder.AddAzureStorage("storage");
var blobs = storage.AddBlobs("blobs");
var queues = storage.AddQueues("queues");

var serviceBus = builder.AddAzureServiceBus("servicebus")
    .AddTopic("enrollment-events")
    .AddTopic("student-updates");

var keyVault = builder.AddAzureKeyVault("keyvault");
var appConfig = builder.AddAzureAppConfiguration("appconfig");

// Redis for Dapr state store
var redis = builder.AddRedis("redis")
    .WithDataVolume();

// Dapr with all building blocks
builder.AddDapr(options =>
{
    options.EnableTelemetry = true;
    options.DaprPath = "/dapr";
});

// Workflow service with Dapr sidecar
var workflows = builder.AddProject<Projects.K12_Workflows>("workflows")
    .WithDaprSidecar(new DaprSidecarOptions
    {
        AppId = "k12-workflows",
        AppPort = 5001,
        DaprHttpPort = 3501,
        DaprGrpcPort = 50001,
        MetricsPort = 9091,
        Config = "dapr/config.yaml"
    })
    .WithReference(redis)
    .WithReference(serviceBus)
    .WithReference(storage)
    .WithReference(keyVault)
    .WithReference(appConfig);

// Azure Functions with Dapr sidecar
var functions = builder.AddAzureFunctionsProject<Projects.K12_Functions>("functions")
    .WithDaprSidecar(new DaprSidecarOptions
    {
        AppId = "k12-functions",
        AppPort = 7071,
        DaprHttpPort = 3502,
        DaprGrpcPort = 50002,
        MetricsPort = 9092,
        Config = "dapr/config.yaml"
    })
    .WithReference(workflows)
    .WithReference(redis)
    .WithReference(serviceBus)
    .WithReference(storage)
    .WithReference(keyVault)
    .WithReference(appConfig)
    .WithExternalHttpEndpoints();

builder.Build().Run();
```

## Workflow Service Implementation

```csharp
// K12.Workflows/Program.cs
using Dapr.Workflow;
using K12.Workflows;

var builder = Host.CreateApplicationBuilder(args);

builder.AddServiceDefaults(); // Aspire OTEL, health checks

// Register Dapr Workflow
builder.Services.AddDaprWorkflow(options =>
{
    options.RegisterWorkflow<StudentSyncWorkflow>();
    options.RegisterWorkflow<EnrollmentProcessingWorkflow>();
    
    options.RegisterActivity<FetchStudentDataActivity>();
    options.RegisterActivity<TransformDataActivity>();
    options.RegisterActivity<PublishEventActivity>();
});

builder.Services.AddDaprClient();

var host = builder.Build();
host.Run();
```

## Azure Functions with Dapr Building Blocks

```csharp
// K12.Functions/WorkflowTriggers.cs
using Dapr.Client;
using Dapr.Workflow;
using Microsoft.Azure.Functions.Worker;

public class WorkflowTriggers
{
    private readonly DaprClient _daprClient;

    public WorkflowTriggers(DaprClient daprClient)
    {
        _daprClient = daprClient;
    }

    // Start workflow via HTTP
    [Function("StartStudentSync")]
    public async Task<HttpResponseData> StartWorkflow(
        [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData req,
        [DaprWorkflowClient] DaprWorkflowClient workflowClient)
    {
        var input = await req.ReadFromJsonAsync<StudentSyncInput>();
        
        var instanceId = await workflowClient.ScheduleNewWorkflowAsync(
            nameof(StudentSyncWorkflow),
            input);

        var response = req.CreateResponse(HttpStatusCode.Accepted);
        await response.WriteAsJsonAsync(new { instanceId });
        return response;
    }

    // Dapr Pub/Sub trigger
    [Function("ProcessEnrollmentEvent")]
    public async Task ProcessEnrollment(
        [DaprTopicTrigger("pubsub", Topic = "enrollment-events")] CloudEvent<EnrollmentEvent> evt)
    {
        // Use Dapr state store
        await _daprClient.SaveStateAsync("statestore", evt.Data.EnrollmentId, evt.Data);
        
        // Publish to another topic
        await _daprClient.PublishEventAsync("pubsub", "student-updates", evt.Data);
    }

    // Dapr Binding trigger
    [Function("ProcessQueueMessage")]
    public async Task ProcessQueue(
        [DaprBindingTrigger(BindingName = "enrollment-queue")] string message)
    {
        var data = JsonSerializer.Deserialize<EnrollmentData>(message);
        await _daprClient.SaveStateAsync("statestore", data.Id, data);
    }

    // Use Dapr secrets
    [Function("GetSecretExample")]
    public async Task<HttpResponseData> GetSecret(
        [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequestData req)
    {
        var secrets = await _daprClient.GetSecretAsync("azurekeyvault", "sql-connection-string");
        var connectionString = secrets["sql-connection-string"];

        var response = req.CreateResponse(HttpStatusCode.OK);
        return response;
    }

    // Use Dapr configuration
    [Function("GetConfigExample")]
    public async Task<HttpResponseData> GetConfig(
        [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequestData req)
    {
        var config = await _daprClient.GetConfiguration("appconfiguration", new[] { "FeatureFlags" });
        
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(config.Items);
        return response;
    }
}
```

## Local Development

```bash
# Start Aspire
cd src/K12.AppHost
dotnet run

# Access Aspire Dashboard
# http://localhost:15888
```

## Production Deployment (Azure Container Apps)

The AppHost automatically configures Container Apps with Dapr when in publish mode. All Dapr components are automatically configured in Azure with managed identities.

```bash
# Deploy to Azure
aspire deploy --environment production
```

## References
- [Aspire 13.1 Release Notes](https://aspire.dev/whats-new/aspire-13-1/)
- [Azure Functions with Aspire](https://learn.microsoft.com/en-us/azure/azure-functions/dotnet-aspire-integration)
- [Dapr Building Blocks](https://docs.dapr.io/concepts/building-blocks-concept/)
