namespace K12.BuildingBlocks.Domain;

/// <summary>
/// Base interface for entities with identity.
/// Follows DDD principles where entities have continuity and identity.
/// </summary>
/// <typeparam name="TId">The type of the entity identifier</typeparam>
public interface IEntity<out TId>
{
    /// <summary>
    /// Unique identifier for the entity
    /// </summary>
    TId Id { get; }
}
