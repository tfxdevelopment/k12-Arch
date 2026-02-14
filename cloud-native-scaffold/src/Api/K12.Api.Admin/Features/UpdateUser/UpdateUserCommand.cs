using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;

namespace K12.Api.Admin.Features.UpdateUser;

/// <summary>
/// Command to update an existing user.
/// </summary>
public sealed record UpdateUserCommand : ICommand<Result>
{
    public Guid Id { get; init; }
    public string DisplayName { get; init; } = string.Empty;
    public bool IsActive { get; init; }
}
