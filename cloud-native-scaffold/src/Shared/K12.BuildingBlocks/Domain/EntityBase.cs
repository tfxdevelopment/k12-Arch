namespace K12.BuildingBlocks.Domain;

/// <summary>
/// Base class for domain entities with domain event support.
/// Entities are objects that have identity and continuity throughout their lifecycle.
/// </summary>
/// <typeparam name="TId">The type of the entity identifier</typeparam>
public abstract class EntityBase<TId> : IEntity<TId>
{
    private readonly List<IDomainEvent> _domainEvents = [];

    public TId Id { get; protected init; } = default!;

    /// <summary>
    /// Domain events raised by this entity
    /// </summary>
    public IReadOnlyList<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    /// <summary>
    /// Add a domain event to be dispatched
    /// </summary>
    protected void RaiseDomainEvent(IDomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    /// <summary>
    /// Clear all domain events (typically after they've been dispatched)
    /// </summary>
    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}
