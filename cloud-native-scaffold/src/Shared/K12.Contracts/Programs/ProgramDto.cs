namespace K12.Contracts.Programs;

/// <summary>
/// Data transfer object for program information.
/// </summary>
public sealed record ProgramDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public bool IsActive { get; init; }
    public DateTimeOffset CreatedOn { get; init; }
}

/// <summary>
/// Request to create a new program.
/// </summary>
public sealed record CreateProgramRequest
{
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
}

/// <summary>
/// Request to update an existing program.
/// </summary>
public sealed record UpdateProgramRequest
{
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public bool IsActive { get; init; }
}
