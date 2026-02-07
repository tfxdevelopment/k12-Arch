using K12.Contracts.Enrollment;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace K12.Api.Enrollment.Features.SubmitEnrollment;

/// <summary>
/// API endpoint for submitting enrollment applications.
/// Uses Minimal API pattern with endpoint-per-feature organization.
/// </summary>
public static class SubmitEnrollmentEndpoint
{
    public static IEndpointRouteBuilder MapSubmitEnrollmentEndpoint(this IEndpointRouteBuilder builder)
    {
        builder.MapPost("/api/enrollment/applications", async (
            [FromBody] SubmitEnrollmentRequest request,
            [FromServices] ISender sender,
            CancellationToken cancellationToken) =>
        {
            var command = request.Adapt<SubmitEnrollmentCommand>();

            var result = await sender.Send(command, cancellationToken);

            return result.IsSuccess
                ? Results.Ok(new { ApplicationId = result.Value })
                : Results.Problem(
                    detail: result.Error.Message,
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Bad Request");
        })
        .WithName("SubmitEnrollment")
        .WithTags("Enrollment")
        .WithOpenApi(operation => new(operation)
        {
            Summary = "Submit a new enrollment application",
            Description = "Creates a new enrollment application for a student in a household for a specific program"
        })
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest);

        return builder;
    }
}
