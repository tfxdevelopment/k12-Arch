using Dapr.Client;
using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;
using K12.Contracts.Enrollment;

namespace K12.Api.Enrollment.Features.GetEnrollmentApplication;

/// <summary>
/// Handler for GetEnrollmentApplicationQuery.
/// Implements the Query side of CQRS - read-only operation.
/// Can be optimized independently from write operations.
/// </summary>
public sealed class GetEnrollmentApplicationHandler
    : IQueryHandler<GetEnrollmentApplicationQuery, Result<EnrollmentApplicationDto>>
{
    private readonly ILogger<GetEnrollmentApplicationHandler> _logger;
    private readonly DaprClient _daprClient;

    public GetEnrollmentApplicationHandler(
        ILogger<GetEnrollmentApplicationHandler> logger,
        DaprClient daprClient)
    {
        _logger = logger;
        _daprClient = daprClient;
    }

    public async Task<Result<EnrollmentApplicationDto>> Handle(
        GetEnrollmentApplicationQuery query,
        CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation(
                "Retrieving enrollment application {ApplicationId}",
                query.ApplicationId);

            // In a real implementation, this would query from a read model
            // optimized for queries (potentially a different database or cache)

            // Example: Read from Dapr state store
            var applicationState = await _daprClient.GetStateAsync<dynamic>(
                "k12-statestore",
                $"enrollment-application-{query.ApplicationId}",
                cancellationToken: cancellationToken);

            if (applicationState == null)
            {
                return Result.Failure<EnrollmentApplicationDto>(
                    Error.NotFound(
                        "EnrollmentApplication.NotFound",
                        $"Enrollment application {query.ApplicationId} not found"));
            }

            // Map to DTO
            var dto = new EnrollmentApplicationDto
            {
                Id = applicationState.Id,
                HouseholdId = applicationState.HouseholdId,
                ProgramId = applicationState.ProgramId,
                ApplicationStatus = applicationState.Status,
                SubmittedOn = applicationState.SubmittedOn
            };

            return Result.Success(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Error retrieving enrollment application {ApplicationId}",
                query.ApplicationId);

            return Result.Failure<EnrollmentApplicationDto>(
                Error.Failure(
                    "EnrollmentApplication.RetrievalFailed",
                    "Failed to retrieve enrollment application"));
        }
    }
}
