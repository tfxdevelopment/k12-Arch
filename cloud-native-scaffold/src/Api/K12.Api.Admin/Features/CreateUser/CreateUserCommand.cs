using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;

namespace K12.Api.Admin.Features.CreateUser;

/// <summary>
/// Command to create a new user.
/// </summary>
public sealed record CreateUserCommand : ICommand<Result<Guid>>
{
    public string Email { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
}
