namespace K12.Contracts.Enrollment;

/// <summary>
/// Request contract for submitting a new enrollment application.
/// </summary>
public sealed record SubmitEnrollmentRequest
{
    public Guid HouseholdId { get; init; }
    public Guid ProgramId { get; init; }
    public Guid StudentId { get; init; }
    public Dictionary<string, object> Responses { get; init; } = [];
}
