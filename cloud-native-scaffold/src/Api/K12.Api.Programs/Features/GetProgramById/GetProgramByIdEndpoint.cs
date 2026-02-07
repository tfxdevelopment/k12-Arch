using MediatR;

namespace K12.Api.Programs.Features.GetProgramById;

/// <summary>
/// API endpoint for getting a program by ID.
/// </summary>
public static class GetProgramByIdEndpoint
{
    public static IEndpointRouteBuilder MapGetProgramByIdEndpoint(this IEndpointRouteBuilder builder)
    {
        builder.MapGet("/api/programs/{id:guid}", async (
            Guid id,
            ISender sender,
            CancellationToken cancellationToken) =>
        {
            var query = new GetProgramByIdQuery(id);
            var result = await sender.Send(query, cancellationToken);

            return result.IsSuccess
                ? Results.Ok(result.Value)
                : Results.NotFound(new { Error = result.Error.Message });
        })
        .WithName("GetProgramById")
        .WithTags("Programs")
        .WithOpenApi(operation => new(operation)
        {
            Summary = "Get a program by ID",
            Description = "Returns the details of a specific program"
        })
        .Produces<object>(StatusCodes.Status200OK)
        .Produces<object>(StatusCodes.Status404NotFound);

        return builder;
    }
}
