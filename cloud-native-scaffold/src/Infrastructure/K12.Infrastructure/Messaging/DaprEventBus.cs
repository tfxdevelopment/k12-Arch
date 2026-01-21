using Dapr.Client;
using K12.BuildingBlocks.Events;
using K12.BuildingBlocks.Messaging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace K12.Infrastructure.Messaging;

/// <summary>
/// Implementation of IEventBus using Dapr Pub/Sub building block.
/// Provides cloud-agnostic messaging abstraction.
/// </summary>
public sealed class DaprEventBus : IEventBus
{
    private readonly DaprClient _daprClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<DaprEventBus> _logger;
    private readonly string _pubSubName;

    public DaprEventBus(
        DaprClient daprClient,
        IConfiguration configuration,
        ILogger<DaprEventBus> logger)
    {
        _daprClient = daprClient;
        _configuration = configuration;
        _logger = logger;
        _pubSubName = configuration["Dapr:PubSubName"] ?? "k12-pubsub";
    }

    public async Task PublishAsync<TEvent>(
        TEvent @event,
        CancellationToken cancellationToken = default)
        where TEvent : IIntegrationEvent
    {
        try
        {
            var topicName = @event.EventType;

            _logger.LogInformation(
                "Publishing event {EventType} with ID {EventId} to topic {TopicName}",
                @event.EventType,
                @event.EventId,
                topicName);

            await _daprClient.PublishEventAsync(
                _pubSubName,
                topicName,
                @event,
                cancellationToken);

            _logger.LogInformation(
                "Successfully published event {EventType} with ID {EventId}",
                @event.EventType,
                @event.EventId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Error publishing event {EventType} with ID {EventId}",
                @event.EventType,
                @event.EventId);
            throw;
        }
    }
}
