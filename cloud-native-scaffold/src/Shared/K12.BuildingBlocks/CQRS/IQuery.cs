using MediatR;

namespace K12.BuildingBlocks.CQRS;

/// <summary>
/// Marker interface for queries (read operations) in CQRS pattern.
/// Queries return data without side effects.
/// </summary>
/// <typeparam name="TResponse">The type of data returned by the query</typeparam>
public interface IQuery<out TResponse> : IRequest<TResponse>
{
}
