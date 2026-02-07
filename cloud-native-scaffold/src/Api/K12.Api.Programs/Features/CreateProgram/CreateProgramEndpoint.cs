using K12.Contracts.Programs;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace K12.Api.Programs.Features.CreateProgram;

/// <summary>
/// API endpoint for creating a new program.
/// </summary>
public static class CreateProgramEndpoint
{
    public static IEndpointRouteBuilder MapCreateProgramEndpoint(this IEndpointRouteBuilder builder)
    {
        builder.MapPost("/api/programs", async (
            [FromBody] CreateProgramRequest request,
            [FromServices] ISender sender,
            CancellationToken cancellationToken) =>
        {
            var command = request.Adapt<CreateProgramCommand>();
            var result = await sender.Send(command, cancellationToken);

            return result.IsSuccess
                ? Results.Created($"/api/programs/{result.Value}", new { ProgramId = result.Value })
                : Results.Problem(
                    detail: result.Error.Message,
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Bad Request");
        })
        .WithName("CreateProgram")
        .WithTags("Programs")
        .WithOpenApi(operation => new(operation)
        {
            Summary = "Create a new program",
            Description = "Creates a new educational program"
        })
        .Produces<object>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest);

        return builder;
    }
}
