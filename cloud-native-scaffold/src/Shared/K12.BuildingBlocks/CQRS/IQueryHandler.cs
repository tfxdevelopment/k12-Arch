using MediatR;

namespace K12.BuildingBlocks.CQRS;

/// <summary>
/// Handler for query operations (read-only).
/// Implements the Query side of CQRS pattern.
/// </summary>
/// <typeparam name="TQuery">The query type</typeparam>
/// <typeparam name="TResponse">The response type</typeparam>
public interface IQueryHandler<in TQuery, TResponse> : IRequestHandler<TQuery, TResponse>
    where TQuery : IQuery<TResponse>
{
}
