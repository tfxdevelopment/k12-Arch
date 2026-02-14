using MediatR;

namespace K12.Api.Admin.Features.GetUserById;

/// <summary>
/// API endpoint for getting a user by ID.
/// </summary>
public static class GetUserByIdEndpoint
{
    public static IEndpointRouteBuilder MapGetUserByIdEndpoint(this IEndpointRouteBuilder builder)
    {
        builder.MapGet("/api/admin/users/{id:guid}", async (
            Guid id,
            ISender sender,
            CancellationToken cancellationToken) =>
        {
            var query = new GetUserByIdQuery(id);
            var result = await sender.Send(query, cancellationToken);

            return result.IsSuccess
                ? Results.Ok(result.Value)
                : Results.NotFound(new { Error = result.Error.Message });
        })
        .WithName("GetUserById")
        .WithTags("Admin")
        .WithOpenApi(operation => new(operation)
        {
            Summary = "Get a user by ID",
            Description = "Returns the details of a specific user"
        })
        .Produces<object>(StatusCodes.Status200OK)
        .Produces<object>(StatusCodes.Status404NotFound);

        return builder;
    }
}
