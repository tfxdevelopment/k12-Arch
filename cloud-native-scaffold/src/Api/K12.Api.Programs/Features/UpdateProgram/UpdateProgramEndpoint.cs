using K12.Contracts.Programs;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace K12.Api.Programs.Features.UpdateProgram;

/// <summary>
/// API endpoint for updating a program.
/// </summary>
public static class UpdateProgramEndpoint
{
    public static IEndpointRouteBuilder MapUpdateProgramEndpoint(this IEndpointRouteBuilder builder)
    {
        builder.MapPut("/api/programs/{id:guid}", async (
            Guid id,
            [FromBody] UpdateProgramRequest request,
            [FromServices] ISender sender,
            CancellationToken cancellationToken) =>
        {
            var command = new UpdateProgramCommand
            {
                Id = id,
                Name = request.Name,
                Description = request.Description,
                IsActive = request.IsActive
            };

            var result = await sender.Send(command, cancellationToken);

            return result.IsSuccess
                ? Results.NoContent()
                : Results.Problem(
                    detail: result.Error.Message,
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Bad Request");
        })
        .WithName("UpdateProgram")
        .WithTags("Programs")
        .WithOpenApi(operation => new(operation)
        {
            Summary = "Update a program",
            Description = "Updates an existing educational program"
        })
        .Produces(StatusCodes.Status204NoContent)
        .ProducesProblem(StatusCodes.Status400BadRequest);

        return builder;
    }
}
