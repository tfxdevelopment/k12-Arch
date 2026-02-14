using K12.Contracts.Admin;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace K12.Api.Admin.Features.CreateUser;

/// <summary>
/// API endpoint for creating a new user.
/// </summary>
public static class CreateUserEndpoint
{
    public static IEndpointRouteBuilder MapCreateUserEndpoint(this IEndpointRouteBuilder builder)
    {
        builder.MapPost("/api/admin/users", async (
            [FromBody] CreateUserRequest request,
            [FromServices] ISender sender,
            CancellationToken cancellationToken) =>
        {
            var command = request.Adapt<CreateUserCommand>();
            var result = await sender.Send(command, cancellationToken);

            return result.IsSuccess
                ? Results.Created($"/api/admin/users/{result.Value}", new { UserId = result.Value })
                : Results.BadRequest(new { Error = result.Error.Message });
        })
        .WithName("CreateUser")
        .WithTags("Admin")
        .WithOpenApi(operation => new(operation)
        {
            Summary = "Create a new user",
            Description = "Creates a new system user"
        })
        .Produces<object>(StatusCodes.Status201Created)
        .Produces<object>(StatusCodes.Status400BadRequest);

        return builder;
    }
}
