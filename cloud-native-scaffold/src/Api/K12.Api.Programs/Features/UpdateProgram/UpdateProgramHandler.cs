using Dapr.Client;
using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;

namespace K12.Api.Programs.Features.UpdateProgram;

/// <summary>
/// Handler for UpdateProgramCommand.
/// Updates a stub program for demonstration.
/// </summary>
public sealed class UpdateProgramHandler
    : ICommandHandler<UpdateProgramCommand, Result>
{
    private readonly ILogger<UpdateProgramHandler> _logger;
    private readonly DaprClient _daprClient;

    public UpdateProgramHandler(
        ILogger<UpdateProgramHandler> logger,
        DaprClient daprClient)
    {
        _logger = logger;
        _daprClient = daprClient;
    }

    public async Task<Result> Handle(
        UpdateProgramCommand command,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Updating program {ProgramId}: {ProgramName}",
            command.Id,
            command.Name);

        // Stub: Save to Dapr state store
        var programState = new
        {
            Id = command.Id,
            Name = command.Name,
            Description = command.Description,
            IsActive = command.IsActive,
            UpdatedOn = DateTimeOffset.UtcNow
        };

        await _daprClient.SaveStateAsync(
            "k12-statestore",
            $"program-{command.Id}",
            programState,
            cancellationToken: cancellationToken);

        _logger.LogInformation("Updated program {ProgramId}", command.Id);

        return Result.Success();
    }
}
