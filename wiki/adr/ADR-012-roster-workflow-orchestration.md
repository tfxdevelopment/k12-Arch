# ADR-012: Roster Workflow Orchestration

**Status:** Superseded by [ADR-PROP-006: Dapr for Cross-Cutting Concerns](../09-proposed-architecture/07-adr-proposed/ADR-PROP-006-dapr.md)
**Date:** 2025-12-11
**Updated:** 2025-12-15
**Deciders:** CFI Architecture Team
**Technical Story:** [K12-XXXX] Roster Certification Workflow Implementation

> **Update (2025-12-15):** This ADR originally recommended Azure Durable Functions. The decision has been **superseded** in favor of **Dapr Workflows** as part of the unified Dapr abstraction strategy. Dapr Workflows provide:
> - Consistent programming model with other Dapr building blocks
> - Works identically in local development (Aspire) and production (Container Apps)
> - No Azure Functions overhead in Container Apps environment
> - Better alignment with cloud-native architecture goals
>
> See [ADR-PROP-006](../09-proposed-architecture/07-adr-proposed/ADR-PROP-006-dapr.md) for the updated decision.

## Context and Problem Statement

The K12 MyPortal system needs to implement the "Roster - To Be Certified" workflow, which orchestrates the transition of students from completed enrollment applications to certified school rosters. This workflow involves:

- Coordinating multiple prerequisite completion signals (application, award, school selection)
- Managing certification windows with time-based constraints
- Handling partial certification scenarios
- Triggering downstream payment workflows
- Maintaining complete audit trails

The workflow requires durable state management, timer-based events, external event handling, and reliable execution across potentially long-running processes (days to weeks).

## Decision Drivers

* **Durability**: Workflow state must survive process restarts, deployments, and failures
* **Scalability**: Must handle 95,000+ applications during peak enrollment periods
* **Observability**: Complete visibility into workflow state for debugging and monitoring
* **Cost Efficiency**: Minimize infrastructure costs while maintaining performance
* **Developer Experience**: Leverage existing team skills in .NET and Azure
* **Integration**: Seamless integration with existing Azure infrastructure (Service Bus, SQL, Functions)

## Considered Options

* **Option 1**: Azure Durable Functions
* **Option 2**: Azure Logic Apps
* **Option 3**: Custom State Machine with Azure SQL
* **Option 4**: Temporal.io

## Decision Outcome

**Chosen option:** "Azure Durable Functions", because it provides the best balance of durability, developer experience, cost efficiency, and integration with our existing Azure infrastructure while supporting complex orchestration patterns.

### Consequences

#### Good

- Native .NET support leverages existing team expertise
- Built-in durable state management with automatic checkpointing
- Timer and external event support for certification windows
- Pay-per-execution model is cost-effective for variable workloads
- Seamless integration with Azure Service Bus, SQL, and other Azure services
- Built-in monitoring via Application Insights
- Supports fan-out/fan-in patterns for parallel processing
- Automatic retry and compensation patterns

#### Bad

- Learning curve for Durable Functions patterns (orchestrator constraints)
- Execution history can grow large for long-running workflows
- Limited debugging experience compared to traditional code
- Vendor lock-in to Azure platform

#### Neutral

- Requires careful consideration of orchestrator determinism rules
- State stored in Azure Storage (additional cost, but minimal)
- May need to implement sub-orchestrations for complex scenarios

## Pros and Cons of the Options

### Option 1: Azure Durable Functions

* **Pro:** Native .NET support, team already proficient
* **Pro:** Built-in durable state management with automatic checkpointing
* **Pro:** Timer triggers for certification windows (CreateTimer)
* **Pro:** External events for certification actions (WaitForExternalEvent)
* **Pro:** Pay-per-execution pricing, cost-effective
* **Pro:** Seamless Azure integration (Service Bus, SQL, Storage)
* **Pro:** Sub-orchestrations for complex workflows
* **Pro:** Fan-out/fan-in for parallel student processing
* **Con:** Orchestrator code must be deterministic
* **Con:** Execution history can grow large over time
* **Con:** Azure vendor lock-in

### Option 2: Azure Logic Apps

* **Pro:** Visual designer for workflow creation
* **Pro:** 400+ pre-built connectors
* **Pro:** Low-code approach for simple workflows
* **Con:** Per-action pricing expensive at scale (95K+ applications)
* **Con:** Limited custom logic capabilities
* **Con:** Harder to version control and code review
* **Con:** Performance overhead for complex workflows
* **Con:** Less control over error handling

### Option 3: Custom State Machine with Azure SQL

* **Pro:** Full control over implementation
* **Pro:** No additional Azure services required
* **Pro:** Familiar SQL-based state storage
* **Con:** Significant development effort
* **Con:** Must implement durability, retries, timers manually
* **Con:** No built-in monitoring or observability
* **Con:** Risk of bugs in state management code
* **Con:** Scalability challenges under load

### Option 4: Temporal.io

* **Pro:** Advanced workflow orchestration features
* **Pro:** Language-agnostic (supports .NET)
* **Pro:** Superior visibility and debugging tools
* **Pro:** Battle-tested at scale (Uber, Netflix, etc.)
* **Con:** Additional infrastructure to manage (Temporal Server)
* **Con:** Learning curve for new paradigm
* **Con:** Additional operational complexity
* **Con:** Potential cost for Temporal Cloud or self-hosted

## Technical Details

### Orchestrator Pattern

The roster workflow uses the **Monitor Pattern** combined with **External Events**:

```csharp
[FunctionName("ToBeCertifiedOrchestrator")]
public static async Task<WorkflowResult> RunOrchestrator(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var input = context.GetInput<ToBeCertifiedInput>();

    // Step 1: Add students to roster (Activity)
    var rosterEntryId = await context.CallActivityAsync<int>(
        "AddStudentsToRoster", input);

    // Step 2: Wait for certification window (Timer)
    var windowOpenDate = GetCertWindowOpenDate(input.FiscalYear);
    await context.CreateTimer(windowOpenDate, CancellationToken.None);

    // Step 3: Wait for certification OR window close (Race)
    var certComplete = context.WaitForExternalEvent<CertificationResult>("AllCertified");
    var windowClose = context.CreateTimer(GetCertWindowCloseDate(input.FiscalYear), CancellationToken.None);

    var winner = await Task.WhenAny(certComplete, windowClose);

    // Step 4: Handle outcome
    if (winner == certComplete)
    {
        await context.CallActivityAsync("TriggerPaymentWorkflow", rosterEntryId);
        return new WorkflowResult { FinalState = RosterState.Certified };
    }
    else
    {
        await context.CallActivityAsync("HandleIncomplete", rosterEntryId);
        return new WorkflowResult { FinalState = RosterState.Incomplete };
    }
}
```

### Activity Functions

Activities handle non-deterministic operations:

| Activity | Purpose | Idempotent |
|----------|---------|------------|
| `AddStudentsToRoster` | DB insert with check | Yes |
| `CreateRosterTasks` | Task creation | Yes |
| `SendNotification` | Queue email | Yes |
| `UpdateWorkflowState` | State persistence | Yes |
| `TriggerPaymentWorkflow` | Downstream trigger | Yes |

### Service Bus Integration

Events trigger orchestrator instances and signal external events:

```csharp
[FunctionName("ApplicationCompleteHandler")]
public static async Task HandleApplicationComplete(
    [ServiceBusTrigger("roster-events")] ApplicationCompleteEvent evt,
    [DurableClient] IDurableOrchestrationClient client)
{
    var instanceId = $"roster-{evt.HouseholdId}-{evt.FiscalYear}";
    await client.StartNewAsync("ToBeCertifiedOrchestrator", instanceId, evt);
}

[FunctionName("CertificationUpdatedHandler")]
public static async Task HandleCertificationUpdated(
    [ServiceBusTrigger("certification-events")] CertificationUpdatedEvent evt,
    [DurableClient] IDurableOrchestrationClient client)
{
    var instanceId = $"roster-{evt.HouseholdId}-{evt.FiscalYear}";
    await client.RaiseEventAsync(instanceId, "CertificationUpdated", evt);
}
```

### State Management

Workflow state stored in Azure Storage Tables:

```
Instances Table: Orchestration metadata
History Table: Execution history (events, activities)
```

### Monitoring

Application Insights integration provides:

- Orchestration status tracking
- Activity execution metrics
- Timer and event telemetry
- Custom metrics via `TelemetryClient`

```csharp
// Custom telemetry in activities
telemetryClient.TrackEvent("RosterCreated", new Dictionary<string, string>
{
    { "RosterEntryId", rosterEntryId.ToString() },
    { "SchoolId", schoolId.ToString() },
    { "StudentCount", studentCount.ToString() }
});
```

### Error Handling

Automatic retry with backoff:

```csharp
var retryOptions = new RetryOptions(
    firstRetryInterval: TimeSpan.FromSeconds(5),
    maxNumberOfAttempts: 3)
{
    BackoffCoefficient = 2.0,
    MaxRetryInterval = TimeSpan.FromMinutes(1),
    RetryTimeout = TimeSpan.FromMinutes(10)
};

await context.CallActivityWithRetryAsync("AddStudentsToRoster", retryOptions, input);
```

Compensation for failures:

```csharp
try
{
    await context.CallActivityAsync("CreateRosterTasks", taskInput);
}
catch (FunctionFailedException)
{
    // Compensate: Remove roster entry
    await context.CallActivityAsync("RemoveRosterEntry", rosterEntryId);
    throw;
}
```

## Validation

Success criteria for this decision:

1. **Workflow Reliability**: <1% failure rate for roster workflows
2. **Performance**: Roster creation completes within 30 seconds
3. **Scalability**: Successfully handle 10,000+ concurrent orchestrations
4. **Cost**: Durable Functions cost < $500/month at peak load
5. **Developer Adoption**: Team comfortable with patterns within 2 weeks

Metrics to track:

```kql
// Orchestration success rate
customEvents
| where name == "OrchestrationCompleted"
| where customDimensions.orchestrationName == "ToBeCertifiedOrchestrator"
| summarize
    total = count(),
    succeeded = countif(customDimensions.status == "Completed"),
    failed = countif(customDimensions.status == "Failed")
| extend successRate = succeeded * 100.0 / total
```

## Related Decisions

* [ADR-001](ADR-001-azure-government-cloud.md) - Azure Government Cloud Selection
* [ADR-002](ADR-002-dapper-over-entity-framework.md) - Dapper for Data Access
* [ADR-008](ADR-008-multi-schema-database.md) - Multi-Schema Database Design

## References

* [Azure Durable Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/durable/)
* [Durable Functions Patterns](https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview?tabs=csharp#application-patterns)
* [Monitor Pattern](https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-monitor)
* [External Events](https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-external-events)
* [WF-01: Roster - To Be Certified Workflow](../02-architecture/workflows/WF-01-roster-to-be-certified.md)
* [Confluence: Roster Workflow](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/4523982849)
