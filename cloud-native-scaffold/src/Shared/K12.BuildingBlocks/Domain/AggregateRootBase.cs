namespace K12.BuildingBlocks.Domain;

/// <summary>
/// Base class for aggregate roots with domain event support.
/// </summary>
/// <typeparam name="TId">The type of the aggregate root identifier</typeparam>
public abstract class AggregateRootBase<TId> : EntityBase<TId>, IAggregateRoot<TId>
{
}
