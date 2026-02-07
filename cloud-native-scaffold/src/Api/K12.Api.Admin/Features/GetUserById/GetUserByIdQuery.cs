using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;
using K12.Contracts.Admin;

namespace K12.Api.Admin.Features.GetUserById;

/// <summary>
/// Query to get a user by their ID.
/// </summary>
public sealed record GetUserByIdQuery(Guid Id) : IQuery<Result<UserDto>>;
