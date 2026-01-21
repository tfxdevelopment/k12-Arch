namespace K12.BuildingBlocks.Events;

/// <summary>
/// Marker interface for integration events.
/// Integration events are used for communication between different bounded contexts or microservices.
/// They are published to a message bus (e.g., Azure Service Bus via Dapr).
/// </summary>
public interface IIntegrationEvent
{
    /// <summary>
    /// Unique identifier for this event instance
    /// </summary>
    Guid EventId { get; }

    /// <summary>
    /// When the event occurred
    /// </summary>
    DateTimeOffset OccurredOn { get; }

    /// <summary>
    /// The name of the event type (used for routing in message bus)
    /// </summary>
    string EventType { get; }
}
