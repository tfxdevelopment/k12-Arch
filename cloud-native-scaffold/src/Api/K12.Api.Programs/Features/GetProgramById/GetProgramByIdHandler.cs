using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;
using K12.Contracts.Programs;

namespace K12.Api.Programs.Features.GetProgramById;

/// <summary>
/// Handler for GetProgramByIdQuery.
/// Returns a stub program for demonstration.
/// </summary>
public sealed class GetProgramByIdHandler
    : IQueryHandler<GetProgramByIdQuery, Result<ProgramDto>>
{
    private readonly ILogger<GetProgramByIdHandler> _logger;

    public GetProgramByIdHandler(ILogger<GetProgramByIdHandler> logger)
    {
        _logger = logger;
    }

    public Task<Result<ProgramDto>> Handle(
        GetProgramByIdQuery query,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting program by ID: {ProgramId}", query.Id);

        // Stub data - in real implementation, query from database
        var program = new ProgramDto
        {
            Id = query.Id,
            Name = "Sample Program",
            Description = "This is a stub program for demonstration",
            IsActive = true,
            CreatedOn = DateTimeOffset.UtcNow.AddMonths(-1)
        };

        return Task.FromResult(Result.Success(program));
    }
}
