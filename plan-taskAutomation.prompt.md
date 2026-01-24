## Plan: Automate Task Generation System

This plan outlines an event-driven and scheduled approach to eliminate 80-90% of manual task creation by automating task generation for schools, parents, and providers based on business events and compliance deadlines.

### Steps

1. **Build Task Generation Service Foundation** - Create `ITaskGenerationService` in [`CFIK12.Application`](g:\Projects\CFI\K12\k12-api-enrollment\CFIK12.Application) with methods `GenerateTaskFromTemplate` and `GenerateTasksForEvent` that use [`TaskTypeRepository`](g:\Projects\CFI\K12\k12-api-enrollment\CFIK12.Infrastructure\Repository\TaskTypeRepository.cs) to fetch task templates and [`TaskRepository.CreateTask`](g:\Projects\CFI\K12\k12-api-enrollment\CFIK12.Infrastructure\Repository\TaskRepository.cs) to generate tasks with subtasks.

2. **Implement Scheduled Jobs for Time-Based Tasks** - Add Azure Functions Timer Triggers in [`Enrollment`](g:\Projects\CFI\K12\k12-api-enrollment\Enrollment) folder for: (a) School Certification tasks (August 1, cron: `"0 0 6 1 8 *"`), (b) Fall/Spring Parent Endorsement tasks (August 15 / January 15), pulling date windows from `ESALotterySettings`/`OSLotterySettings` tables and generating tasks for all eligible schools/parents.

3. **Create Domain Events and Event Handlers** - Define domain events (`AwardOfferMadeEvent`, `ApplicationSubmittedEvent`, `ProviderRegistrationSubmittedEvent`) and implement event handlers using MediatR that call `ITaskGenerationService` when awards are offered, applications are submitted with missing documents, or providers register.

4. **Integrate with Existing Workflows** - Publish events from existing business logic in [`TaskApp`](g:\Projects\CFI\K12\k12-api-enrollment\CFIK12.Application\TaskApp.cs), Award services, and [`WorkflowOrchestration`](g:\Projects\CFI\K12\k12-api-enrollment\Enrollment\Workflow\WorkflowOrchestration.cs) so task generation happens automatically as part of enrollment, award, and registration workflows.

5. **Add Monitoring and Audit Trail** - Enhance [`TaskRepository.CreateTask`](g:\Projects\CFI\K12\k12-api-enrollment\CFIK12.Infrastructure\Repository\TaskRepository.cs) to log automated task generation (source event, timestamp, metadata) and create a monitoring dashboard for task generation job status and completion metrics.

### Further Considerations

1. **Prioritization Strategy** - Start with Tier 1 high-ROI items (school certification, parent endorsement, award acceptance tasks) which impact 10,000+ users annually and are on the critical payment path. Should we implement all Tier 1 tasks simultaneously or phase them sequentially to manage risk?

2. **Event Publishing Infrastructure** - MediatR (in-process) vs Azure Service Bus (distributed). MediatR is simpler for MVP but Service Bus provides better scalability and retry handling. Which approach fits your architecture preferences?

3. **Task Template Management** - Current [`TaskType`](g:\Projects\CFI\K12\k12-api-enrollment\CFIK12.Domain\Models\TaskType.cs) system requires manual admin creation of templates. Should we seed default task types (e.g., "Annual School Certification") via database migrations to ensure consistency?
