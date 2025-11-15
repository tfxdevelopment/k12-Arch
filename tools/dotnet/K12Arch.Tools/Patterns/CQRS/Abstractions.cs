namespace K12Arch.Tools.Patterns.CQRS;

/// <summary>
/// Marker interface for commands
/// </summary>
public interface ICommand<out TResult>
{
}

/// <summary>
/// Command handler interface
/// </summary>
public interface ICommandHandler<in TCommand, TResult> where TCommand : ICommand<TResult>
{
    Task<TResult> Handle(TCommand command, CancellationToken cancellationToken);
}

/// <summary>
/// Marker interface for queries
/// </summary>
public interface IQuery<out TResult>
{
}

/// <summary>
/// Query handler interface
/// </summary>
public interface IQueryHandler<in TQuery, TResult> where TQuery : IQuery<TResult>
{
    Task<TResult> Handle(TQuery query, CancellationToken cancellationToken);
}

/// <summary>
/// Command result wrapper
/// </summary>
public class CommandResult<T>
{
    public bool Success { get; init; }
    public T? Data { get; init; }
    public string? Error { get; init; }
    public DateTime Timestamp { get; init; }

    private CommandResult() 
    { 
        Timestamp = DateTime.UtcNow;
    }

    public static CommandResult<T> SuccessResult(T data)
    {
        return new CommandResult<T>
        {
            Success = true,
            Data = data,
            Error = null
        };
    }

    public static CommandResult<T> FailureResult(string error)
    {
        return new CommandResult<T>
        {
            Success = false,
            Data = default,
            Error = error
        };
    }
}

/// <summary>
/// Base record for commands with common properties
/// </summary>
public abstract record Command : ICommand<CommandResult<Guid>>
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;
}

/// <summary>
/// Base record for queries with common properties
/// </summary>
public abstract record Query<TResult> : IQuery<TResult>
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;
}

/// <summary>
/// Paged result for queries
/// </summary>
public class PagedResult<T>
{
    public IEnumerable<T> Items { get; init; } = Array.Empty<T>();
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalCount { get; init; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;

    public PagedResult() { }

    public PagedResult(IEnumerable<T> items, int page, int pageSize, int totalCount)
    {
        Items = items;
        Page = page;
        PageSize = pageSize;
        TotalCount = totalCount;
    }
}
