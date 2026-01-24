# Dapr Workflow Examples

This document provides examples of implementing Dapr workflows for the K12 Architecture Documentation system.

## Overview

Dapr Workflow provides a programming model for building reliable, stateful workflows. Workflows are composed of activities that execute in a specific order with built-in retry, compensation, and state management.

## Prerequisites

Add the Dapr Workflow SDK to your project:

```bash
dotnet add package Dapr.Workflow
```

## Basic Workflow Example

### Document Processing Workflow

This workflow demonstrates a multi-step document processing pipeline with error handling and compensation.

```csharp
using Dapr.Workflow;

namespace K12.Docs.Workflows;

public record DocumentInput(string DocumentId, string FilePath, string UserId);
public record DocumentOutput(string DocumentId, string Status, string ProcessedPath);

public class DocumentProcessingWorkflow : Workflow<DocumentInput, DocumentOutput>
{
    public override async Task<DocumentOutput> RunAsync(WorkflowContext context, DocumentInput input)
    {
        // Step 1: Validate document
        var validationResult = await context.CallActivityAsync<ValidationResult>(
            nameof(ValidateDocumentActivity),
            input);

        if (!validationResult.IsValid)
        {
            return new DocumentOutput(
                input.DocumentId,
                "Failed",
                $"Validation failed: {validationResult.Message}");
        }

        // Step 2: Upload to blob storage
        var uploadResult = await context.CallActivityAsync<UploadResult>(
            nameof(UploadDocumentActivity),
            new UploadInput(input.DocumentId, input.FilePath));

        // Step 3: Process document (OCR, extract metadata)
        var processResult = await context.CallActivityAsync<ProcessResult>(
            nameof(ProcessDocumentActivity),
            new ProcessInput(input.DocumentId, uploadResult.BlobUrl));

        // Step 4: Index for search
        await context.CallActivityAsync(
            nameof(IndexDocumentActivity),
            new IndexInput(input.DocumentId, processResult.Metadata));

        // Step 5: Notify user
        await context.CallActivityAsync(
            nameof(NotifyUserActivity),
            new NotificationInput(input.UserId, input.DocumentId, "completed"));

        return new DocumentOutput(
            input.DocumentId,
            "Completed",
            processResult.ProcessedPath);
    }
}
```

### Workflow Activities

Activities are the individual steps executed by workflows:

```csharp
// Validation Activity
public class ValidateDocumentActivity : WorkflowActivity<DocumentInput, ValidationResult>
{
    public override async Task<ValidationResult> RunAsync(WorkflowActivityContext context, DocumentInput input)
    {
        // Check file exists
        if (!File.Exists(input.FilePath))
        {
            return new ValidationResult(false, "File not found");
        }

        // Check file size
        var fileInfo = new FileInfo(input.FilePath);
        if (fileInfo.Length > 10 * 1024 * 1024) // 10 MB
        {
            return new ValidationResult(false, "File too large");
        }

        // Check file type
        var extension = Path.GetExtension(input.FilePath);
        var allowedExtensions = new[] { ".pdf", ".docx", ".md", ".txt" };
        if (!allowedExtensions.Contains(extension.ToLower()))
        {
            return new ValidationResult(false, "Invalid file type");
        }

        return new ValidationResult(true, "Valid");
    }
}

// Upload Activity with Dapr Blob Binding
public class UploadDocumentActivity : WorkflowActivity<UploadInput, UploadResult>
{
    private readonly DaprClient _daprClient;

    public UploadDocumentActivity(DaprClient daprClient)
    {
        _daprClient = daprClient;
    }

    public override async Task<UploadResult> RunAsync(
        WorkflowActivityContext context, 
        UploadInput input)
    {
        var fileBytes = await File.ReadAllBytesAsync(input.FilePath);
        var blobName = $"documents/{input.DocumentId}/{Path.GetFileName(input.FilePath)}";

        // Use Dapr output binding to upload to blob storage
        await _daprClient.InvokeBindingAsync("blobstorage", "create", new
        {
            blobName = blobName,
            data = fileBytes
        });

        var blobUrl = $"https://storage.account.blob.core.windows.net/architecture-docs/{blobName}";
        return new UploadResult(blobUrl);
    }
}

// Process Activity
public class ProcessDocumentActivity : WorkflowActivity<ProcessInput, ProcessResult>
{
    public override async Task<ProcessResult> RunAsync(
        WorkflowActivityContext context, 
        ProcessInput input)
    {
        // Simulate document processing (OCR, metadata extraction, etc.)
        await Task.Delay(1000); // Simulate work

        var metadata = new Dictionary<string, string>
        {
            ["documentId"] = input.DocumentId,
            ["processedAt"] = DateTime.UtcNow.ToString("O"),
            ["pageCount"] = "10",
            ["title"] = "Architecture Documentation"
        };

        return new ProcessResult(
            input.DocumentId,
            input.BlobUrl,
            metadata);
    }
}

// Index Activity with Dapr State Store
public class IndexDocumentActivity : WorkflowActivity<IndexInput, string>
{
    private readonly DaprClient _daprClient;

    public IndexDocumentActivity(DaprClient daprClient)
    {
        _daprClient = daprClient;
    }

    public override async Task<string> RunAsync(
        WorkflowActivityContext context, 
        IndexInput input)
    {
        // Store document metadata in state store for search
        await _daprClient.SaveStateAsync("statestore", $"doc-{input.DocumentId}", input.Metadata);
        return "Indexed";
    }
}

// Notification Activity with Dapr Pub/Sub
public class NotifyUserActivity : WorkflowActivity<NotificationInput, string>
{
    private readonly DaprClient _daprClient;

    public NotifyUserActivity(DaprClient daprClient)
    {
        _daprClient = daprClient;
    }

    public override async Task<string> RunAsync(
        WorkflowActivityContext context, 
        NotificationInput input)
    {
        // Publish event to notify user
        await _daprClient.PublishEventAsync("pubsub", "document-events", new
        {
            userId = input.UserId,
            documentId = input.DocumentId,
            status = input.Status,
            timestamp = DateTime.UtcNow
        });

        return "Notified";
    }
}
```

## Registering Workflows and Activities

In your `Program.cs`:

```csharp
using Dapr.Workflow;

var builder = WebApplication.CreateBuilder(args);

// Add Dapr Workflow
builder.Services.AddDaprWorkflow(options =>
{
    // Register workflows
    options.RegisterWorkflow<DocumentProcessingWorkflow>();

    // Register activities
    options.RegisterActivity<ValidateDocumentActivity>();
    options.RegisterActivity<UploadDocumentActivity>();
    options.RegisterActivity<ProcessDocumentActivity>();
    options.RegisterActivity<IndexDocumentActivity>();
    options.RegisterActivity<NotifyUserActivity>();
});

var app = builder.Build();

// Workflow endpoints
app.MapPost("/workflows/start", async (WorkflowStartRequest request, DaprWorkflowClient workflowClient) =>
{
    var input = new DocumentInput(request.DocumentId, request.FilePath, request.UserId);
    var instanceId = await workflowClient.ScheduleNewWorkflowAsync(
        nameof(DocumentProcessingWorkflow),
        input);

    return Results.Ok(new { instanceId });
});

app.MapGet("/workflows/{instanceId}", async (string instanceId, DaprWorkflowClient workflowClient) =>
{
    var state = await workflowClient.GetWorkflowStateAsync(instanceId, true);
    return Results.Ok(new
    {
        instanceId = state.InstanceId,
        status = state.RuntimeStatus.ToString(),
        createdAt = state.CreatedAt,
        lastUpdated = state.LastUpdatedAt,
        output = state.ReadOutputAs<DocumentOutput>()
    });
});

app.MapPost("/workflows/{instanceId}/terminate", async (string instanceId, DaprWorkflowClient workflowClient) =>
{
    await workflowClient.TerminateWorkflowAsync(instanceId, "User requested termination");
    return Results.Ok();
});

app.Run();
```

## Advanced Patterns

### Workflow with Retry and Timeout

```csharp
public class ResilientDocumentWorkflow : Workflow<DocumentInput, DocumentOutput>
{
    public override async Task<DocumentOutput> RunAsync(WorkflowContext context, DocumentInput input)
    {
        var retryOptions = new WorkflowTaskOptions
        {
            RetryPolicy = new WorkflowRetryPolicy(
                maxNumberOfAttempts: 3,
                firstRetryInterval: TimeSpan.FromSeconds(5),
                backoffCoefficient: 2.0)
        };

        var timeoutOptions = new WorkflowTaskOptions
        {
            Timeout = TimeSpan.FromMinutes(5)
        };

        var result = await context.CallActivityAsync<ProcessResult>(
            nameof(ProcessDocumentActivity),
            input,
            retryOptions);

        return new DocumentOutput(input.DocumentId, "Completed", result.ProcessedPath);
    }
}
```

### Workflow with Parallel Execution

```csharp
public class ParallelProcessingWorkflow : Workflow<BatchInput, BatchOutput>
{
    public override async Task<BatchOutput> RunAsync(WorkflowContext context, BatchInput input)
    {
        // Process multiple documents in parallel
        var tasks = input.Documents.Select(doc =>
            context.CallActivityAsync<ProcessResult>(
                nameof(ProcessDocumentActivity),
                new ProcessInput(doc.Id, doc.Path)));

        var results = await Task.WhenAll(tasks);

        return new BatchOutput(results.Select(r => r.ProcessedPath).ToList());
    }
}
```

### Workflow with Human Approval

```csharp
public class ApprovalWorkflow : Workflow<ApprovalInput, ApprovalOutput>
{
    public override async Task<ApprovalOutput> RunAsync(WorkflowContext context, ApprovalInput input)
    {
        // Submit for approval
        await context.CallActivityAsync(nameof(SubmitForApprovalActivity), input);

        // Wait for approval event (human in the loop)
        var approved = await context.WaitForExternalEventAsync<bool>(
            "approval-decision",
            TimeSpan.FromDays(7)); // 7-day timeout

        if (!approved)
        {
            return new ApprovalOutput(input.DocumentId, "Rejected");
        }

        // Continue processing after approval
        await context.CallActivityAsync(nameof(PublishDocumentActivity), input);

        return new ApprovalOutput(input.DocumentId, "Approved and Published");
    }
}

// Raise external event from API endpoint
app.MapPost("/workflows/{instanceId}/approve", async (
    string instanceId,
    ApprovalDecision decision,
    DaprWorkflowClient workflowClient) =>
{
    await workflowClient.RaiseEventAsync(instanceId, "approval-decision", decision.Approved);
    return Results.Ok();
});
```

### Workflow with Compensation (Saga Pattern)

```csharp
public class SagaWorkflow : Workflow<OrderInput, OrderOutput>
{
    public override async Task<OrderOutput> RunAsync(WorkflowContext context, OrderInput input)
    {
        try
        {
            // Step 1: Reserve inventory
            await context.CallActivityAsync(nameof(ReserveInventoryActivity), input);

            // Step 2: Process payment
            await context.CallActivityAsync(nameof(ProcessPaymentActivity), input);

            // Step 3: Ship order
            await context.CallActivityAsync(nameof(ShipOrderActivity), input);

            return new OrderOutput(input.OrderId, "Completed");
        }
        catch (Exception)
        {
            // Compensation logic (rollback)
            await context.CallActivityAsync(nameof(CancelShipmentActivity), input);
            await context.CallActivityAsync(nameof(RefundPaymentActivity), input);
            await context.CallActivityAsync(nameof(ReleaseInventoryActivity), input);

            return new OrderOutput(input.OrderId, "Compensated");
        }
    }
}
```

## Testing Workflows

### Unit Testing Workflows

```csharp
using Dapr.Workflow;
using Moq;
using Xunit;

public class DocumentWorkflowTests
{
    [Fact]
    public async Task DocumentProcessingWorkflow_Success()
    {
        // Arrange
        var mockContext = new Mock<WorkflowContext>();
        mockContext
            .Setup(c => c.CallActivityAsync<ValidationResult>(
                nameof(ValidateDocumentActivity),
                It.IsAny<DocumentInput>(),
                null))
            .ReturnsAsync(new ValidationResult(true, "Valid"));

        var workflow = new DocumentProcessingWorkflow();
        var input = new DocumentInput("doc-123", "/path/to/doc.pdf", "user-456");

        // Act
        var result = await workflow.RunAsync(mockContext.Object, input);

        // Assert
        Assert.Equal("Completed", result.Status);
    }
}
```

### Integration Testing with Dapr

```bash
# Start Dapr with workflow component
dapr run --app-id workflow-test --app-port 5000 \
  --dapr-http-port 3500 --dapr-grpc-port 50001 \
  --components-path ./src/K12.AppHost/components

# Start workflow
curl -X POST http://localhost:5000/workflows/start \
  -H "Content-Type: application/json" \
  -d '{"documentId": "doc-123", "filePath": "/tmp/test.pdf", "userId": "user-456"}'

# Check workflow status
curl http://localhost:5000/workflows/{instanceId}
```

## Monitoring Workflows

### View Workflow State in Aspire Dashboard

1. Navigate to `https://localhost:17241`
2. Select "Traces" tab
3. Filter by workflow instance ID
4. View execution timeline and activity results

### Query Workflow State via API

```csharp
app.MapGet("/workflows", async (DaprWorkflowClient workflowClient) =>
{
    // List all workflow instances (requires custom state query)
    var client = DaprClient.CreateInvokeHttpClient("dapr-workflow");
    var response = await client.GetAsync("v1.0-alpha1/workflows/instances");
    return Results.Ok(await response.Content.ReadAsStringAsync());
});
```

## Best Practices

1. **Idempotency**: Make activities idempotent - they may be retried
2. **Timeouts**: Set appropriate timeouts for long-running activities
3. **Compensation**: Implement compensation logic for critical workflows
4. **State Size**: Keep workflow input/output small (use state store for large data)
5. **Versioning**: Version workflows to support backwards compatibility
6. **Monitoring**: Use structured logging and distributed tracing
7. **Error Handling**: Catch and handle expected errors in activities
8. **Testing**: Write unit tests for workflows and activities

## Additional Resources

- [Dapr Workflow Documentation](https://docs.dapr.io/developing-applications/building-blocks/workflow/)
- [Workflow Patterns](https://docs.dapr.io/developing-applications/building-blocks/workflow/workflow-patterns/)
- [Workflow Best Practices](https://docs.dapr.io/developing-applications/building-blocks/workflow/workflow-features-concepts/)

## License

Copyright (c) 2024 CFI Group. All rights reserved.
