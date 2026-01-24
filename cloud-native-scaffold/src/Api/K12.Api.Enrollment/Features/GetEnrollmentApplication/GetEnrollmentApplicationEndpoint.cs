using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace K12.Api.Enrollment.Features.GetEnrollmentApplication;

/// <summary>
/// API endpoint for retrieving enrollment applications.
/// </summary>
public static class GetEnrollmentApplicationEndpoint
{
    public static IEndpointRouteBuilder MapGetEnrollmentApplicationEndpoint(this IEndpointRouteBuilder builder)
    {
        builder.MapGet("/api/enrollment/applications/{applicationId:guid}", async (
            [FromRoute] Guid applicationId,
            [FromServices] ISender sender,
            CancellationToken cancellationToken) =>
        {
            var query = new GetEnrollmentApplicationQuery(applicationId);

            var result = await sender.Send(query, cancellationToken);

            return result.IsSuccess
                ? Results.Ok(result.Value)
                : Results.NotFound(new { Error = result.Error.Message });
        })
        .WithName("GetEnrollmentApplication")
        .WithTags("Enrollment")
        .WithOpenApi(operation => new(operation)
        {
            Summary = "Get an enrollment application by ID",
            Description = "Retrieves detailed information about a specific enrollment application"
        })
        .Produces<object>(StatusCodes.Status200OK)
        .Produces<object>(StatusCodes.Status404NotFound);

        return builder;
    }
}
