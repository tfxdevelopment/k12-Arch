namespace K12.BuildingBlocks.Events;

/// <summary>
/// Base class for integration events with common properties.
/// </summary>
public abstract record IntegrationEventBase : IIntegrationEvent
{
    protected IntegrationEventBase()
    {
        EventId = Guid.NewGuid();
        OccurredOn = DateTimeOffset.UtcNow;
        EventType = GetType().Name;
    }

    public Guid EventId { get; init; }
    public DateTimeOffset OccurredOn { get; init; }
    public string EventType { get; init; }
}
