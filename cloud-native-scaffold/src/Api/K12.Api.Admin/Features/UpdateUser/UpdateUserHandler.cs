using Dapr.Client;
using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;

namespace K12.Api.Admin.Features.UpdateUser;

/// <summary>
/// Handler for UpdateUserCommand.
/// Updates a stub user for demonstration.
/// </summary>
public sealed class UpdateUserHandler
    : ICommandHandler<UpdateUserCommand, Result>
{
    private readonly ILogger<UpdateUserHandler> _logger;
    private readonly DaprClient _daprClient;

    public UpdateUserHandler(
        ILogger<UpdateUserHandler> logger,
        DaprClient daprClient)
    {
        _logger = logger;
        _daprClient = daprClient;
    }

    public async Task<Result> Handle(
        UpdateUserCommand command,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Updating user {UserId}: {DisplayName}",
            command.Id,
            command.DisplayName);

        // Stub: Save to Dapr state store
        var userState = new
        {
            Id = command.Id,
            DisplayName = command.DisplayName,
            IsActive = command.IsActive,
            UpdatedOn = DateTimeOffset.UtcNow
        };

        await _daprClient.SaveStateAsync(
            "k12-statestore",
            $"user-{command.Id}",
            userState,
            cancellationToken: cancellationToken);

        _logger.LogInformation("Updated user {UserId}", command.Id);

        return Result.Success();
    }
}
