using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;
using K12.Contracts.Programs;

namespace K12.Api.Programs.Features.GetPrograms;

/// <summary>
/// Query to get all programs with optional pagination.
/// Part of CQRS pattern - read operation.
/// </summary>
public sealed record GetProgramsQuery : IQuery<Result<IReadOnlyList<ProgramDto>>>
{
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 10;
}
