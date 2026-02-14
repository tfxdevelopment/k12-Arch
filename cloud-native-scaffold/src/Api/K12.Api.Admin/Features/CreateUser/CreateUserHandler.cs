using Dapr.Client;
using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;

namespace K12.Api.Admin.Features.CreateUser;

/// <summary>
/// Handler for CreateUserCommand.
/// Creates a stub user for demonstration.
/// </summary>
public sealed class CreateUserHandler
    : ICommandHandler<CreateUserCommand, Result<Guid>>
{
    private readonly ILogger<CreateUserHandler> _logger;
    private readonly DaprClient _daprClient;

    public CreateUserHandler(
        ILogger<CreateUserHandler> logger,
        DaprClient daprClient)
    {
        _logger = logger;
        _daprClient = daprClient;
    }

    public async Task<Result<Guid>> Handle(
        CreateUserCommand command,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Creating user: {Email}",
            command.Email);

        var userId = Guid.NewGuid();

        // Stub: Save to Dapr state store
        var userState = new
        {
            Id = userId,
            Email = command.Email,
            DisplayName = command.DisplayName,
            IsActive = true,
            CreatedOn = DateTimeOffset.UtcNow
        };

        await _daprClient.SaveStateAsync(
            "k12-statestore",
            $"user-{userId}",
            userState,
            cancellationToken: cancellationToken);

        _logger.LogInformation(
            "Created user {UserId}: {Email}",
            userId,
            command.Email);

        return Result.Success(userId);
    }
}
