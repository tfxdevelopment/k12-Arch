using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;

namespace K12.Api.Programs.Features.UpdateProgram;

/// <summary>
/// Command to update an existing program.
/// </summary>
public sealed record UpdateProgramCommand : ICommand<Result>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public bool IsActive { get; init; }
}
