using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;
using K12.Contracts.Admin;

namespace K12.Api.Admin.Features.GetUsers;

/// <summary>
/// Handler for GetUsersQuery.
/// Returns a stub list of users for demonstration.
/// </summary>
public sealed class GetUsersHandler
    : IQueryHandler<GetUsersQuery, Result<IReadOnlyList<UserDto>>>
{
    private readonly ILogger<GetUsersHandler> _logger;

    public GetUsersHandler(ILogger<GetUsersHandler> logger)
    {
        _logger = logger;
    }

    public Task<Result<IReadOnlyList<UserDto>>> Handle(
        GetUsersQuery query,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Getting users - Page {Page}, PageSize {PageSize}",
            query.Page,
            query.PageSize);

        // Stub data - in real implementation, query from database
        var users = new List<UserDto>
        {
            new()
            {
                Id = Guid.Parse("aaaa1111-1111-1111-1111-111111111111"),
                Email = "admin@k12.edu",
                DisplayName = "System Administrator",
                IsActive = true,
                CreatedOn = DateTimeOffset.UtcNow.AddMonths(-12)
            },
            new()
            {
                Id = Guid.Parse("bbbb2222-2222-2222-2222-222222222222"),
                Email = "coordinator@k12.edu",
                DisplayName = "Program Coordinator",
                IsActive = true,
                CreatedOn = DateTimeOffset.UtcNow.AddMonths(-6)
            },
            new()
            {
                Id = Guid.Parse("cccc3333-3333-3333-3333-333333333333"),
                Email = "reviewer@k12.edu",
                DisplayName = "Application Reviewer",
                IsActive = true,
                CreatedOn = DateTimeOffset.UtcNow.AddMonths(-3)
            }
        };

        return Task.FromResult(Result.Success<IReadOnlyList<UserDto>>(users));
    }
}
