using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;

namespace K12.Api.Enrollment.Features.SubmitEnrollment;

/// <summary>
/// Command to submit a new enrollment application.
/// Part of the CQRS pattern - represents a write operation.
/// </summary>
public sealed record SubmitEnrollmentCommand : ICommand<Result<Guid>>
{
    public Guid HouseholdId { get; init; }
    public Guid ProgramId { get; init; }
    public Guid StudentId { get; init; }
    public Dictionary<string, object> Responses { get; init; } = [];
}
