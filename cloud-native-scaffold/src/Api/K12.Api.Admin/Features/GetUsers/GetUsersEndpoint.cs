using MediatR;

namespace K12.Api.Admin.Features.GetUsers;

/// <summary>
/// API endpoint for getting all users.
/// </summary>
public static class GetUsersEndpoint
{
    public static IEndpointRouteBuilder MapGetUsersEndpoint(this IEndpointRouteBuilder builder)
    {
        builder.MapGet("/api/admin/users", async (
            int? page,
            int? pageSize,
            ISender sender,
            CancellationToken cancellationToken) =>
        {
            var query = new GetUsersQuery
            {
                Page = page ?? 1,
                PageSize = pageSize ?? 10
            };

            var result = await sender.Send(query, cancellationToken);

            return result.IsSuccess
                ? Results.Ok(result.Value)
                : Results.Problem(
                    detail: result.Error.Message,
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Bad Request");
        })
        .WithName("GetUsers")
        .WithTags("Admin")
        .WithOpenApi(operation => new(operation)
        {
            Summary = "Get all users",
            Description = "Returns a paginated list of all system users"
        })
        .Produces<IReadOnlyList<object>>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest);

        return builder;
    }
}
