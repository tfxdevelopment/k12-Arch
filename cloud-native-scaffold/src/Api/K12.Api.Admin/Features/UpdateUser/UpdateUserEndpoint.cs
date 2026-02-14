using K12.Contracts.Admin;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace K12.Api.Admin.Features.UpdateUser;

/// <summary>
/// API endpoint for updating a user.
/// </summary>
public static class UpdateUserEndpoint
{
    public static IEndpointRouteBuilder MapUpdateUserEndpoint(this IEndpointRouteBuilder builder)
    {
        builder.MapPut("/api/admin/users/{id:guid}", async (
            Guid id,
            [FromBody] UpdateUserRequest request,
            [FromServices] ISender sender,
            CancellationToken cancellationToken) =>
        {
            var command = new UpdateUserCommand
            {
                Id = id,
                DisplayName = request.DisplayName,
                IsActive = request.IsActive
            };

            var result = await sender.Send(command, cancellationToken);

            return result.IsSuccess
                ? Results.NoContent()
                : Results.BadRequest(new { Error = result.Error.Message });
        })
        .WithName("UpdateUser")
        .WithTags("Admin")
        .WithOpenApi(operation => new(operation)
        {
            Summary = "Update a user",
            Description = "Updates an existing system user"
        })
        .Produces(StatusCodes.Status204NoContent)
        .Produces<object>(StatusCodes.Status400BadRequest);

        return builder;
    }
}
