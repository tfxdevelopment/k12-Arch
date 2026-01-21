using K12.BuildingBlocks.Events;

namespace K12.BuildingBlocks.Messaging;

/// <summary>
/// Event bus abstraction for publishing integration events.
/// Implementation uses Dapr Pub/Sub building block.
/// </summary>
public interface IEventBus
{
    /// <summary>
    /// Publish an integration event to the message bus
    /// </summary>
    /// <typeparam name="TEvent">The event type</typeparam>
    /// <param name="event">The event to publish</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task PublishAsync<TEvent>(TEvent @event, CancellationToken cancellationToken = default)
        where TEvent : IIntegrationEvent;
}
