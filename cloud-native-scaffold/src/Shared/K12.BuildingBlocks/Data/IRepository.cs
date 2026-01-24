using K12.BuildingBlocks.Domain;

namespace K12.BuildingBlocks.Data;

/// <summary>
/// Generic repository interface for aggregate roots.
/// Follows Repository pattern to abstract data access.
/// </summary>
/// <typeparam name="TAggregate">The aggregate root type</typeparam>
/// <typeparam name="TId">The identifier type</typeparam>
public interface IRepository<TAggregate, in TId>
    where TAggregate : IAggregateRoot<TId>
{
    /// <summary>
    /// Get an aggregate by its identifier
    /// </summary>
    Task<TAggregate?> GetByIdAsync(TId id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Add a new aggregate
    /// </summary>
    Task AddAsync(TAggregate aggregate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Update an existing aggregate
    /// </summary>
    void Update(TAggregate aggregate);

    /// <summary>
    /// Delete an aggregate
    /// </summary>
    void Delete(TAggregate aggregate);
}
