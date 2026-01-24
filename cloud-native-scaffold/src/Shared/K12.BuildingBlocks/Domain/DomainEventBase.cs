namespace K12.BuildingBlocks.Domain;

/// <summary>
/// Base class for domain events with common properties.
/// </summary>
public abstract record DomainEventBase : IDomainEvent
{
    public Guid EventId { get; init; } = Guid.NewGuid();
    public DateTimeOffset OccurredOn { get; init; } = DateTimeOffset.UtcNow;
}
