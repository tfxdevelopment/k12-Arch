using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;
using K12.Contracts.Admin;

namespace K12.Api.Admin.Features.GetUserById;

/// <summary>
/// Handler for GetUserByIdQuery.
/// Returns a stub user for demonstration.
/// </summary>
public sealed class GetUserByIdHandler
    : IQueryHandler<GetUserByIdQuery, Result<UserDto>>
{
    private readonly ILogger<GetUserByIdHandler> _logger;

    public GetUserByIdHandler(ILogger<GetUserByIdHandler> logger)
    {
        _logger = logger;
    }

    public Task<Result<UserDto>> Handle(
        GetUserByIdQuery query,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting user by ID: {UserId}", query.Id);

        // Stub data - in real implementation, query from database
        var user = new UserDto
        {
            Id = query.Id,
            Email = "user@k12.edu",
            DisplayName = "Sample User",
            IsActive = true,
            CreatedOn = DateTimeOffset.UtcNow.AddMonths(-1)
        };

        return Task.FromResult(Result.Success(user));
    }
}
