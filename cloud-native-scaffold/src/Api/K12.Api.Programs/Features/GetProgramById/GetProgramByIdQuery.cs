using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;
using K12.Contracts.Programs;

namespace K12.Api.Programs.Features.GetProgramById;

/// <summary>
/// Query to get a program by its ID.
/// </summary>
public sealed record GetProgramByIdQuery(Guid Id) : IQuery<Result<ProgramDto>>;
