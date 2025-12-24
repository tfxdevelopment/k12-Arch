# ADR-014: Dapr Workflow for Orchestration

**Status:** Proposed
**Date:** 2025-12-23
**Deciders:** CFI Architecture Team
**Technical Story:** K12 Cloud-Native Modernization

## Context and Problem Statement

The K12 MyPortal system requires robust orchestration for complex multi-step processes like enrollment applications, document processing, payment workflows, and integration with external systems (ClassWallet, PandaDoc, SendGrid). Current implementation uses procedural code without formal workflow orchestration, leading to:

1. **No Retry Logic** - Failed steps require manual intervention
2. **No Compensation** - Rollback logic scattered across codebase
3. **Poor Observability** - Difficult to track workflow state and progress
4. **Complex State Management** - Custom code to persist workflow state
5. **Tight Coupling** - Business logic intertwined with orchestration concerns

With the proposed move to Azure Container Apps + .NET Aspire, we need a cloud-native workflow engine that provides:
- Durable execution with automatic retries
- Compensation and saga patterns
- Built-in observability and monitoring
- Integration with Dapr service mesh

## Decision Drivers

* **Durability** - Workflows must survive container restarts
* **Observability** - Track workflow state, progress, and failures
* **Developer Experience** - Write workflows in C# without external DSL
* **Azure Integration** - First-class support in Azure Container Apps
* **Cost** - No additional licensing or infrastructure costs
* **Compliance** - Must support FedRAMP, audit logging

## Considered Options

* **Option 1: Dapr Workflow** (Dapr v1.14+ built-in capability)
* **Option 2: Azure Durable Functions** (Current pattern extended)
* **Option 3: Temporal.io** (Third-party workflow engine)
* **Option 4: Custom State Machine** (Build our own)

## Decision Outcome

**Chosen option:** "Dapr Workflow", because:

1. **Native Container Apps Integration** - Built into Azure Container Apps environment
2. **Zero Infrastructure** - No additional services to deploy/manage
3. **C# Native** - Write workflows in .NET using familiar async/await patterns
4. **Dapr Ecosystem** - Integrates with Dapr pub/sub, state, secrets, service invocation
5. **Aspire Support** - .NET Aspire orchestration includes Dapr Workflow
6. **Cost Effective** - No additional licensing (free open-source)
7. **Actor-Based** - Uses Virtual Actors pattern for massive scalability

### Consequences

#### Good
- Workflows written in C# with compile-time safety
- Automatic state persistence using Dapr state stores (Redis, CosmosDB)
- Built-in retry policies, timeouts, and compensation
- Works locally (Aspire + Dapr CLI) and in Azure (Container Apps)
- Unified observability through Dapr telemetry
- Supports both orchestration (Workflow) and choreography (Pub/Sub)

#### Bad
- Relatively new (v1.14 released Nov 2024, early adoption risk)
- Limited tooling vs mature products like Temporal
- Requires Dapr runtime in every container (sidecar overhead)
- Learning curve for teams unfamiliar with Dapr

#### Neutral
- Requires .NET 8+ and Dapr SDK
- Workflows stored as code (not visual designer)

## Pros and Cons of the Options

### Option 1: Dapr Workflow

* **Pro:** Native to Azure Container Apps (no additional infrastructure)
* **Pro:** Write workflows in C# with full debugging support
* **Pro:** Integrates with Dapr pub/sub, state, bindings, secrets
* **Pro:** Actor-based model scales to millions of workflow instances
* **Pro:** Works locally with .NET Aspire
* **Pro:** Open-source (Apache 2.0 license)
* **Con:** New technology (v1.14, Nov 2024 release)
* **Con:** Smaller ecosystem vs Temporal or Durable Functions
* **Con:** Requires Dapr runtime (sidecar container)

### Option 2: Azure Durable Functions

* **Pro:** Current expertise in the team (already using Functions)
* **Pro:** Mature product with extensive documentation
* **Pro:** Built-in orchestration with durable task framework
* **Con:** Tied to Azure Functions runtime (not Container Apps native)
* **Con:** Cold start issues with consumption plans
* **Con:** Difficult to test locally (requires storage emulator)
* **Con:** Not designed for containerized microservices
* **Con:** Does not leverage Dapr service mesh benefits

### Option 3: Temporal.io

* **Pro:** Most mature workflow engine (production-proven at Uber, Netflix)
* **Pro:** Rich UI for workflow visualization
* **Pro:** Multi-language SDKs (Go, Java, Python, .NET)
* **Pro:** Advanced features (ContinueAsNew, versioning)
* **Con:** Requires dedicated Temporal Server infrastructure (Cassandra/Postgres)
* **Con:** Additional complexity and cost ($$$)
* **Con:** Not integrated with Dapr ecosystem
* **Con:** Overkill for current requirements

### Option 4: Custom State Machine

* **Pro:** Full control over implementation
* **Pro:** No external dependencies
* **Con:** High development cost (6-12 months to build properly)
* **Con:** Error-prone (retry logic, compensation, state management)
* **Con:** Poor observability without significant investment
* **Con:** Not a core competency for the team

## Technical Details

### Dapr Workflow Components

```
┌─────────────────────────────────────────────────────────────────┐
│ Dapr Workflow Architecture                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐         ┌──────────────────┐            │
│  │ Workflow Client  │────────>│ Dapr Sidecar     │            │
│  │ (Starts workflow)│         │ (HTTP/gRPC API)  │            │
│  └──────────────────┘         └────────┬─────────┘            │
│                                          │                      │
│                                          ▼                      │
│  ┌──────────────────────────────────────────────────┐          │
│  │ Workflow Engine (Dapr Runtime)                   │          │
│  │ ┌────────────────────────────────────────────┐   │          │
│  │ │ Workflow Definition (C# code)              │   │          │
│  │ │ - Activities (tasks)                       │   │          │
│  │ │ - Retry policies                           │   │          │
│  │ │ - Compensation logic                       │   │          │
│  │ └────────────────────────────────────────────┘   │          │
│  │                                                   │          │
│  │ State Persistence                                 │          │
│  │ ┌─────────────┐  ┌─────────────┐  ┌──────────┐  │          │
│  │ │ Redis       │  │ CosmosDB    │  │ SQL      │  │          │
│  │ │ (dev/test)  │  │ (prod HA)   │  │ (backup) │  │          │
│  │ └─────────────┘  └─────────────┘  └──────────┘  │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Example: Enrollment Application Workflow

```csharp
// EnrollmentWorkflow.cs - Orchestration logic
using Dapr.Workflow;

public class EnrollmentWorkflow : Workflow<EnrollmentRequest, EnrollmentResult>
{
    public override async Task<EnrollmentResult> RunAsync(
        WorkflowContext context, 
        EnrollmentRequest input)
    {
        var workflowId = context.InstanceId;
        
        try
        {
            // Step 1: Validate student eligibility (NRules)
            var eligibility = await context.CallActivityAsync<EligibilityResult>(
                nameof(ValidateEligibilityActivity),
                input,
                new ActivityOptions { RetryPolicy = new(3, TimeSpan.FromSeconds(10)) });
            
            if (!eligibility.IsEligible)
            {
                return new EnrollmentResult { Status = "Rejected", Reason = eligibility.Reason };
            }
            
            // Step 2: Create household record (DAB)
            var householdId = await context.CallActivityAsync<string>(
                nameof(CreateHouseholdActivity),
                input.Household);
            
            // Step 3: Upload documents to ADLS Gen2 (Dapr Blob binding)
            var documentUrls = await context.CallActivityAsync<List<string>>(
                nameof(UploadDocumentsActivity),
                new { workflowId, documents = input.Documents });
            
            // Step 4: Submit to ClassWallet for payment setup
            var paymentSetup = await context.CallActivityAsync<PaymentResult>(
                nameof(SetupClassWalletPaymentActivity),
                new { householdId, amount = eligibility.AwardAmount },
                new ActivityOptions { RetryPolicy = new(5, TimeSpan.FromSeconds(30)) });
            
            // Step 5: Generate enrollment agreement (PandaDoc)
            var agreementUrl = await context.CallActivityAsync<string>(
                nameof(GenerateEnrollmentAgreementActivity),
                new { householdId, paymentSetup.AccountId });
            
            // Step 6: Send confirmation email (SendGrid via Dapr binding)
            await context.CallActivityAsync(
                nameof(SendConfirmationEmailActivity),
                new { 
                    email = input.ParentEmail, 
                    agreementUrl, 
                    householdId 
                });
            
            // Step 7: Update application status to "Pending Signature"
            await context.CallActivityAsync(
                nameof(UpdateApplicationStatusActivity),
                new { workflowId, status = "PendingSignature" });
            
            return new EnrollmentResult 
            { 
                Status = "Success",
                HouseholdId = householdId,
                AgreementUrl = agreementUrl,
                PaymentAccountId = paymentSetup.AccountId
            };
        }
        catch (Exception ex)
        {
            // Compensation logic (saga pattern)
            await context.CallActivityAsync(
                nameof(CompensateEnrollmentActivity),
                new { workflowId, error = ex.Message });
            
            return new EnrollmentResult 
            { 
                Status = "Failed", 
                Reason = ex.Message 
            };
        }
    }
}

// Activity implementations
public class ValidateEligibilityActivity : WorkflowActivity<EnrollmentRequest, EligibilityResult>
{
    private readonly IEligibilityService _eligibilityService;
    
    public ValidateEligibilityActivity(IEligibilityService eligibilityService)
    {
        _eligibilityService = eligibilityService;
    }
    
    public override async Task<EligibilityResult> RunAsync(
        WorkflowActivityContext context, 
        EnrollmentRequest input)
    {
        // Calls NRules engine to validate eligibility
        return await _eligibilityService.ValidateAsync(input);
    }
}

public class CreateHouseholdActivity : WorkflowActivity<Household, string>
{
    private readonly DaprClient _daprClient;
    
    public CreateHouseholdActivity(DaprClient daprClient)
    {
        _daprClient = daprClient;
    }
    
    public override async Task<string> RunAsync(
        WorkflowActivityContext context, 
        Household input)
    {
        // Call Data API Builder via Dapr service invocation
        var response = await _daprClient.InvokeMethodAsync<Household, HouseholdResponse>(
            "k12-dab",
            "api/households",
            input);
        
        return response.Id;
    }
}

// Workflow registration in Program.cs
builder.Services.AddDaprWorkflow(options =>
{
    // Register workflows
    options.RegisterWorkflow<EnrollmentWorkflow>();
    
    // Register activities
    options.RegisterActivity<ValidateEligibilityActivity>();
    options.RegisterActivity<CreateHouseholdActivity>();
    options.RegisterActivity<UploadDocumentsActivity>();
    options.RegisterActivity<SetupClassWalletPaymentActivity>();
    options.RegisterActivity<GenerateEnrollmentAgreementActivity>();
    options.RegisterActivity<SendConfirmationEmailActivity>();
    options.RegisterActivity<UpdateApplicationStatusActivity>();
    options.RegisterActivity<CompensateEnrollmentActivity>();
});

// Start workflow from API endpoint
[Function("StartEnrollmentWorkflow")]
public async Task<IActionResult> StartEnrollment(
    [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req,
    [DaprWorkflowClient] DaprWorkflowClient workflowClient)
{
    var enrollmentRequest = await req.ReadFromJsonAsync<EnrollmentRequest>();
    
    var workflowId = Guid.NewGuid().ToString();
    
    await workflowClient.ScheduleNewWorkflowAsync(
        name: nameof(EnrollmentWorkflow),
        instanceId: workflowId,
        input: enrollmentRequest);
    
    return new AcceptedResult($"/api/workflows/{workflowId}", new { workflowId });
}

// Check workflow status
[Function("GetWorkflowStatus")]
public async Task<IActionResult> GetWorkflowStatus(
    [HttpTrigger(AuthorizationLevel.Function, "get", Route = "workflows/{workflowId}")] HttpRequest req,
    [DaprWorkflowClient] DaprWorkflowClient workflowClient,
    string workflowId)
{
    var state = await workflowClient.GetWorkflowMetadataAsync(workflowId);
    
    return new OkObjectResult(new
    {
        workflowId = state.InstanceId,
        status = state.RuntimeStatus.ToString(),
        createdAt = state.CreatedAt,
        lastUpdated = state.LastUpdatedAt,
        output = state.ReadOutputAs<EnrollmentResult>()
    });
}
```

### .NET Aspire Integration

```csharp
// K12.AppHost/Program.cs
var builder = DistributedApplication.CreateBuilder(args);

// Redis for Dapr state store
var redis = builder.AddRedis("k12-redis")
    .WithDataVolume();

// Add Dapr components
builder.AddDapr(options =>
{
    // State store for workflow persistence
    options.AddStateStore("workflowstore", "state.redis", stateOptions =>
    {
        stateOptions.Metadata.Add("redisHost", redis.Resource.ConnectionStringExpression);
        stateOptions.Metadata.Add("actorStateStore", "true"); // Enable for workflows
    });
    
    // Pub/sub for event-driven choreography
    options.AddPubSub("pubsub", "pubsub.redis", pubsubOptions =>
    {
        pubsubOptions.Metadata.Add("redisHost", redis.Resource.ConnectionStringExpression);
    });
    
    // Configuration store
    options.AddConfiguration("configstore", "configuration.redis", configOptions =>
    {
        configOptions.Metadata.Add("redisHost", redis.Resource.ConnectionStringExpression);
    });
    
    // Secret store (Azure Key Vault in production)
    options.AddSecretStore("secretstore", "secretstores.azure.keyvault", secretOptions =>
    {
        secretOptions.Metadata.Add("vaultName", builder.Configuration["KeyVault:VaultName"]);
    });
    
    // Blob binding for document storage
    options.AddBinding("documents", "bindings.azure.blobstorage", blobOptions =>
    {
        blobOptions.Metadata.Add("storageAccount", builder.Configuration["Storage:AccountName"]);
        blobOptions.Metadata.Add("container", "enrollment-documents");
    });
    
    // Event binding for SendGrid
    options.AddBinding("email", "bindings.twilio.sendgrid", emailOptions =>
    {
        emailOptions.Metadata.Add("apiKey", "{secretstore:secretstore:sendgrid-apikey}");
        emailOptions.Metadata.Add("emailFrom", "noreply@k12.nc.gov");
    });
});

// Functions container with Dapr Workflow
var functions = builder.AddProject<Projects.K12_API>("k12-functions")
    .WithReference(redis)
    .WithDaprSidecar("k12-functions", new()
    {
        AppPort = 7071,
        DaprHttpPort = 3500,
        DaprGrpcPort = 50001,
        EnableApiLogging = true,
        Config = "workflow-config"
    });

builder.Build().Run();
```

### Dapr Component Definitions

```yaml
# dapr-components/workflow-state.yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: workflowstore
spec:
  type: state.redis
  version: v1
  metadata:
    - name: redisHost
      value: k12-redis:6379
    - name: redisPassword
      secretKeyRef:
        name: redis-password
        key: password
    - name: actorStateStore
      value: "true"
    - name: ttlInSeconds
      value: "2592000"  # 30 days

---
# dapr-components/pubsub.yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: pubsub
spec:
  type: pubsub.redis
  version: v1
  metadata:
    - name: redisHost
      value: k12-redis:6379
    - name: consumerID
      value: k12-enrollment

---
# dapr-components/blob-binding.yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: documents
spec:
  type: bindings.azure.blobstorage
  version: v1
  metadata:
    - name: storageAccount
      value: k12storageaccount
    - name: storageAccessKey
      secretKeyRef:
        name: storage-secret
        key: accessKey
    - name: container
      value: enrollment-documents

---
# dapr-components/sendgrid-binding.yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: email
spec:
  type: bindings.twilio.sendgrid
  version: v1
  metadata:
    - name: apiKey
      secretKeyRef:
        name: sendgrid-secret
        key: apiKey
    - name: emailFrom
      value: noreply@k12.nc.gov
    - name: emailFromName
      value: NC K-12 Scholarship Program
```

### Key Use Cases

| Workflow | Activities | Compensation Logic |
|----------|-----------|-------------------|
| **Enrollment Application** | Validate → Create Household → Upload Docs → ClassWallet → PandaDoc → Email | Delete household, rollback ClassWallet account |
| **Payment Processing** | Validate Funds → Deduct ClassWallet → Update Award → Notify Provider | Refund ClassWallet, revert award status |
| **Document Processing** | OCR → Validate → Store ADLS → Update Status → Notify | Delete ADLS files, mark document as rejected |
| **Provider Onboarding** | Validate TIN → DMV Check → Create Account → Send Agreement | Delete account, cancel background check |

## Validation

Success metrics for Dapr Workflow adoption:

1. **Durability** - 99.9% workflow completion rate (no lost state)
2. **Retry Success** - 95% of transient failures automatically recovered
3. **Observability** - 100% of workflows tracked in Application Insights
4. **Performance** - < 100ms workflow orchestration overhead
5. **Developer Velocity** - Reduce workflow implementation time by 60%

## Related Decisions

* [ADR-013: RDS Async Integration Pattern](ADR-013-rds-async-integration-pattern.md) - Complements Dapr Workflow for state agency integrations
* [ADR-PROP-006: Dapr for Microservices Patterns](../09-proposed-architecture/07-adr-proposed/ADR-PROP-006-dapr.md)
* [ADR-015: Observability Strategy](ADR-015-observability.md) - Workflow telemetry integration

## References

### Official Documentation
* [Dapr Workflow Documentation](https://docs.dapr.io/developing-applications/building-blocks/workflow/)
* [Dapr Workflow .NET SDK](https://github.com/dapr/dotnet-sdk/tree/master/examples/Workflow)
* [Azure Container Apps Dapr Integration](https://learn.microsoft.com/en-us/azure/container-apps/dapr-overview)
* [.NET Aspire Dapr Integration](https://learn.microsoft.com/en-us/dotnet/aspire/frameworks/dapr)
* [Azure Functions Dapr Extension](https://learn.microsoft.com/en-us/azure/azure-functions/dotnet-aspire-integration)

### Tutorials
* [Build Your First Dapr Workflow](https://docs.dapr.io/developing-applications/building-blocks/workflow/workflow-quickstart/)
* [Saga Pattern with Dapr Workflow](https://docs.dapr.io/developing-applications/building-blocks/workflow/workflow-patterns/)

---

**Document Status:** Proposed - Awaiting Leadership Approval
**Last Updated:** 2025-12-23
**Next Review:** After POC completion (Q1 2026)
