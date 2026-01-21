namespace K12.BuildingBlocks.Domain;

/// <summary>
/// Marker interface for aggregate roots in DDD.
/// An aggregate is a cluster of domain objects that can be treated as a single unit.
/// The aggregate root is the only member of the aggregate that outside objects are allowed to hold references to.
/// </summary>
/// <typeparam name="TId">The type of the aggregate root identifier</typeparam>
public interface IAggregateRoot<out TId> : IEntity<TId>
{
}
