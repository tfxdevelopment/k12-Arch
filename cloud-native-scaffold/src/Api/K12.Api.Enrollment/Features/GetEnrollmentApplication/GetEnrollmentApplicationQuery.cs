using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;
using K12.Contracts.Enrollment;

namespace K12.Api.Enrollment.Features.GetEnrollmentApplication;

/// <summary>
/// Query to retrieve an enrollment application by ID.
/// Part of the CQRS pattern - represents a read operation.
/// </summary>
public sealed record GetEnrollmentApplicationQuery(Guid ApplicationId)
    : IQuery<Result<EnrollmentApplicationDto>>;
