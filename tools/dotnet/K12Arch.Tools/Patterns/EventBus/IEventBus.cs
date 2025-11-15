namespace K12Arch.Tools.Patterns.EventBus;

/// <summary>
/// Event bus interface for publish/subscribe pattern
/// </summary>
public interface IEventBus
{
    /// <summary>
    /// Subscribe to an event type
    /// </summary>
    void Subscribe<TEvent>(Func<TEvent, Task> handler) where TEvent : class;

    /// <summary>
    /// Unsubscribe from an event type
    /// </summary>
    void Unsubscribe<TEvent>(Func<TEvent, Task> handler) where TEvent : class;

    /// <summary>
    /// Publish an event asynchronously
    /// </summary>
    Task PublishAsync<TEvent>(TEvent @event, CancellationToken cancellationToken = default) where TEvent : class;
}

/// <summary>
/// In-memory implementation of event bus
/// </summary>
public class InMemoryEventBus : IEventBus
{
    private readonly Dictionary<Type, List<Delegate>> _subscribers = new();
    private readonly object _lock = new();

    /// <inheritdoc/>
    public void Subscribe<TEvent>(Func<TEvent, Task> handler) where TEvent : class
    {
        ArgumentNullException.ThrowIfNull(handler);

        lock (_lock)
        {
            var eventType = typeof(TEvent);
            if (!_subscribers.ContainsKey(eventType))
            {
                _subscribers[eventType] = new List<Delegate>();
            }

            _subscribers[eventType].Add(handler);
        }
    }

    /// <inheritdoc/>
    public void Unsubscribe<TEvent>(Func<TEvent, Task> handler) where TEvent : class
    {
        ArgumentNullException.ThrowIfNull(handler);

        lock (_lock)
        {
            var eventType = typeof(TEvent);
            if (_subscribers.ContainsKey(eventType))
            {
                _subscribers[eventType].Remove(handler);
                if (_subscribers[eventType].Count == 0)
                {
                    _subscribers.Remove(eventType);
                }
            }
        }
    }

    /// <inheritdoc/>
    public async Task PublishAsync<TEvent>(TEvent @event, CancellationToken cancellationToken = default) where TEvent : class
    {
        ArgumentNullException.ThrowIfNull(@event);

        List<Delegate> handlers;
        lock (_lock)
        {
            var eventType = typeof(TEvent);
            if (!_subscribers.ContainsKey(eventType))
            {
                return;
            }

            handlers = _subscribers[eventType].ToList();
        }

        var tasks = handlers
            .Cast<Func<TEvent, Task>>()
            .Select(handler => SafeInvokeHandler(handler, @event, cancellationToken));

        await Task.WhenAll(tasks);
    }

    private async Task SafeInvokeHandler<TEvent>(
        Func<TEvent, Task> handler,
        TEvent @event,
        CancellationToken cancellationToken) where TEvent : class
    {
        try
        {
            await handler(@event);
        }
        catch (Exception ex)
        {
            // Log error - in production, use proper logging
            Console.Error.WriteLine($"Error handling event {typeof(TEvent).Name}: {ex.Message}");
        }
    }

    /// <summary>
    /// Get subscriber count for event type
    /// </summary>
    public int GetSubscriberCount<TEvent>() where TEvent : class
    {
        lock (_lock)
        {
            var eventType = typeof(TEvent);
            return _subscribers.ContainsKey(eventType) ? _subscribers[eventType].Count : 0;
        }
    }

    /// <summary>
    /// Clear all subscribers
    /// </summary>
    public void Clear()
    {
        lock (_lock)
        {
            _subscribers.Clear();
        }
    }
}
