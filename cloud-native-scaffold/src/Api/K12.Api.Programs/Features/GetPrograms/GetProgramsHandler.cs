using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;
using K12.Contracts.Programs;

namespace K12.Api.Programs.Features.GetPrograms;

/// <summary>
/// Handler for GetProgramsQuery.
/// Returns a stub list of programs for demonstration.
/// </summary>
public sealed class GetProgramsHandler
    : IQueryHandler<GetProgramsQuery, Result<IReadOnlyList<ProgramDto>>>
{
    private readonly ILogger<GetProgramsHandler> _logger;

    public GetProgramsHandler(ILogger<GetProgramsHandler> logger)
    {
        _logger = logger;
    }

    public Task<Result<IReadOnlyList<ProgramDto>>> Handle(
        GetProgramsQuery query,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Getting programs - Page {Page}, PageSize {PageSize}",
            query.Page,
            query.PageSize);

        // Stub data - in real implementation, query from database
        var programs = new List<ProgramDto>
        {
            new()
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Name = "Early Childhood Education",
                Description = "Programs for children ages 3-5",
                IsActive = true,
                CreatedOn = DateTimeOffset.UtcNow.AddMonths(-6)
            },
            new()
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "K-12 Core Curriculum",
                Description = "Standard K-12 educational programs",
                IsActive = true,
                CreatedOn = DateTimeOffset.UtcNow.AddMonths(-3)
            },
            new()
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Name = "Special Education Services",
                Description = "Specialized learning support programs",
                IsActive = true,
                CreatedOn = DateTimeOffset.UtcNow.AddMonths(-1)
            }
        };

        return Task.FromResult(Result.Success<IReadOnlyList<ProgramDto>>(programs));
    }
}
