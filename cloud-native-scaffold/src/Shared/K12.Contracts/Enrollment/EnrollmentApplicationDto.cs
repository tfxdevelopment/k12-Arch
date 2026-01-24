namespace K12.Contracts.Enrollment;

/// <summary>
/// Data transfer object for enrollment application information.
/// Shared contract used across API boundaries.
/// </summary>
public sealed record EnrollmentApplicationDto
{
    public Guid Id { get; init; }
    public Guid HouseholdId { get; init; }
    public Guid ProgramId { get; init; }
    public string ApplicationStatus { get; init; } = string.Empty;
    public DateTimeOffset SubmittedOn { get; init; }
    public string? PrimaryParentName { get; init; }
    public string? StudentName { get; init; }
    public decimal? AwardAmount { get; init; }
}
