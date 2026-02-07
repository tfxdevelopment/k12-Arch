using Dapr.Client;
using K12.BuildingBlocks.CQRS;
using K12.BuildingBlocks.Results;

namespace K12.Api.Programs.Features.CreateProgram;

/// <summary>
/// Handler for CreateProgramCommand.
/// Creates a stub program for demonstration.
/// </summary>
public sealed class CreateProgramHandler
    : ICommandHandler<CreateProgramCommand, Result<Guid>>
{
    private readonly ILogger<CreateProgramHandler> _logger;
    private readonly DaprClient _daprClient;

    public CreateProgramHandler(
        ILogger<CreateProgramHandler> logger,
        DaprClient daprClient)
    {
        _logger = logger;
        _daprClient = daprClient;
    }

    public async Task<Result<Guid>> Handle(
        CreateProgramCommand command,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Creating program: {ProgramName}",
            command.Name);

        var programId = Guid.NewGuid();

        // Stub: Save to Dapr state store
        var programState = new
        {
            Id = programId,
            Name = command.Name,
            Description = command.Description,
            IsActive = true,
            CreatedOn = DateTimeOffset.UtcNow
        };

        await _daprClient.SaveStateAsync(
            "k12-statestore",
            $"program-{programId}",
            programState,
            cancellationToken: cancellationToken);

        _logger.LogInformation(
            "Created program {ProgramId}: {ProgramName}",
            programId,
            command.Name);

        return Result.Success(programId);
    }
}
