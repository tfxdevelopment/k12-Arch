using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;
using K12.Contracts.Admin;

namespace K12.Api.Admin.Features.GetUsers;

/// <summary>
/// Query to get all users with optional pagination.
/// </summary>
public sealed record GetUsersQuery : IQuery<Result<IReadOnlyList<UserDto>>>
{
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 10;
}
