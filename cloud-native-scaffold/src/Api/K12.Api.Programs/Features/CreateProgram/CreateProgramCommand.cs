using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;

namespace K12.Api.Programs.Features.CreateProgram;

/// <summary>
/// Command to create a new program.
/// </summary>
public sealed record CreateProgramCommand : ICommand<Result<Guid>>
{
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
}
