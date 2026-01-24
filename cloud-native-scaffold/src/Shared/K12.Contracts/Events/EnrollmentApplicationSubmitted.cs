namespace K12.Contracts.Events;

/// <summary>
/// Integration event published when an enrollment application is submitted.
/// This event can be consumed by other services (e.g., Programs API for award allocation).
/// </summary>
public sealed record EnrollmentApplicationSubmittedEvent
{
    public Guid EventId { get; init; } = Guid.NewGuid();
    public DateTimeOffset OccurredOn { get; init; } = DateTimeOffset.UtcNow;
    public string EventType { get; init; } = nameof(EnrollmentApplicationSubmittedEvent);

    public Guid ApplicationId { get; init; }
    public Guid HouseholdId { get; init; }
    public Guid ProgramId { get; init; }
    public Guid StudentId { get; init; }
    public DateTimeOffset SubmittedOn { get; init; }
}
