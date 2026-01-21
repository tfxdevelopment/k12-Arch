using MediatR;

namespace K12.BuildingBlocks.CQRS;

/// <summary>
/// Marker interface for commands (write operations) in CQRS pattern.
/// Commands modify state and may return a result.
/// </summary>
/// <typeparam name="TResponse">The type of result returned by the command</typeparam>
public interface ICommand<out TResponse> : IRequest<TResponse>
{
}

/// <summary>
/// Marker interface for commands that don't return a value.
/// </summary>
public interface ICommand : IRequest
{
}
