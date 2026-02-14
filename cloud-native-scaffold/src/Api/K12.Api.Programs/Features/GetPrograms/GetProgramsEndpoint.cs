using MediatR;

namespace K12.Api.Programs.Features.GetPrograms;

/// <summary>
/// API endpoint for getting all programs.
/// Uses Minimal API pattern with endpoint-per-feature organization.
/// </summary>
public static class GetProgramsEndpoint
{
    public static IEndpointRouteBuilder MapGetProgramsEndpoint(this IEndpointRouteBuilder builder)
    {
        builder.MapGet("/api/programs", async (
            int? page,
            int? pageSize,
            ISender sender,
            CancellationToken cancellationToken) =>
        {
            var query = new GetProgramsQuery
            {
                Page = page ?? 1,
                PageSize = pageSize ?? 10
            };

            var result = await sender.Send(query, cancellationToken);

            return result.IsSuccess
                ? Results.Ok(result.Value)
                : Results.BadRequest(new { Error = result.Error.Message });
        })
        .WithName("GetPrograms")
        .WithTags("Programs")
        .WithOpenApi(operation => new(operation)
        {
            Summary = "Get all programs",
            Description = "Returns a paginated list of all available programs"
        })
        .Produces<IReadOnlyList<object>>(StatusCodes.Status200OK)
        .Produces<object>(StatusCodes.Status400BadRequest);

        return builder;
    }
}
