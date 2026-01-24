using Dapr.Client;
using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Messaging;
using K12.BuildingBlocks.Results;
using K12.Contracts.Events;

namespace K12.Api.Enrollment.Features.SubmitEnrollment;

/// <summary>
/// Handler for SubmitEnrollmentCommand.
/// Implements the Command side of CQRS.
/// Follows Single Responsibility Principle - only handles enrollment submission.
/// </summary>
public sealed class SubmitEnrollmentHandler
    : ICommandHandler<SubmitEnrollmentCommand, Result<Guid>>
{
    private readonly ILogger<SubmitEnrollmentHandler> _logger;
    private readonly IEventBus _eventBus;
    private readonly DaprClient _daprClient;

    public SubmitEnrollmentHandler(
        ILogger<SubmitEnrollmentHandler> logger,
        IEventBus eventBus,
        DaprClient daprClient)
    {
        _logger = logger;
        _eventBus = eventBus;
        _daprClient = daprClient;
    }

    public async Task<Result<Guid>> Handle(
        SubmitEnrollmentCommand command,
        CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation(
                "Processing enrollment submission for Household {HouseholdId}, Program {ProgramId}, Student {StudentId}",
                command.HouseholdId,
                command.ProgramId,
                command.StudentId);

            // 1. Create enrollment application aggregate
            var applicationId = Guid.NewGuid();
            var submittedOn = DateTimeOffset.UtcNow;

            // In a real implementation, this would:
            // - Create an EnrollmentApplication aggregate
            // - Validate business rules
            // - Persist to database using repository
            // - Raise domain events

            // Example: Save to database using Dapper
            // await _repository.AddAsync(application, cancellationToken);
            // await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Example: Save application state to Dapr state store
            var applicationState = new
            {
                Id = applicationId,
                HouseholdId = command.HouseholdId,
                ProgramId = command.ProgramId,
                StudentId = command.StudentId,
                Status = "Submitted",
                SubmittedOn = submittedOn,
                Responses = command.Responses
            };

            await _daprClient.SaveStateAsync(
                "k12-statestore",
                $"enrollment-application-{applicationId}",
                applicationState,
                cancellationToken: cancellationToken);

            // 2. Publish integration event for other services to consume
            var integrationEvent = new EnrollmentApplicationSubmittedEvent
            {
                ApplicationId = applicationId,
                HouseholdId = command.HouseholdId,
                ProgramId = command.ProgramId,
                StudentId = command.StudentId,
                SubmittedOn = submittedOn
            };

            await _eventBus.PublishAsync(integrationEvent, cancellationToken);

            _logger.LogInformation(
                "Successfully submitted enrollment application {ApplicationId}",
                applicationId);

            return Result.Success(applicationId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Error submitting enrollment application for Household {HouseholdId}",
                command.HouseholdId);

            return Result.Failure<Guid>(
                Error.Failure(
                    "EnrollmentSubmission.Failed",
                    "Failed to submit enrollment application"));
        }
    }
}
