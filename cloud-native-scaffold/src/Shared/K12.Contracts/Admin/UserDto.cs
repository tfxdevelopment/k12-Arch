namespace K12.Contracts.Admin;

/// <summary>
/// Data transfer object for user information.
/// </summary>
public sealed record UserDto
{
    public Guid Id { get; init; }
    public string Email { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public bool IsActive { get; init; }
    public DateTimeOffset CreatedOn { get; init; }
}

/// <summary>
/// Request to create a new user.
/// </summary>
public sealed record CreateUserRequest
{
    public string Email { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
}

/// <summary>
/// Request to update an existing user.
/// </summary>
public sealed record UpdateUserRequest
{
    public string DisplayName { get; init; } = string.Empty;
    public bool IsActive { get; init; }
}
