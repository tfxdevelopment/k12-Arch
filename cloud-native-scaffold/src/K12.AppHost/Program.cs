var builder = DistributedApplication.CreateBuilder(args);

// ============================================================================
// INFRASTRUCTURE RESOURCES
// ============================================================================

// Azure SQL Database
var sqlPassword = builder.AddParameter("sql-password", secret: true);
var sqlServer = builder.AddSqlServer("sqlserver", sqlPassword, port: 1433)
    .WithLifetime(ContainerLifetime.Persistent)
    .WithDataVolume("k12-sqlserver-data");

var sqlDb = sqlServer.AddDatabase("k12db", "K12MyPortal");

// Redis Cache (for Dapr state store and distributed caching)
var redis = builder.AddRedis("redis", port: 6379)
    .WithLifetime(ContainerLifetime.Persistent)
    .WithDataVolume("k12-redis-data")
    .WithRedisCommander();

// Azure Service Bus (or Dapr Pub/Sub with Redis in local mode)
var messaging = builder.AddAzureServiceBus("messaging")
    .RunAsEmulator(configure => configure.WithLifetime(ContainerLifetime.Persistent));

// Azure Storage (Blob Storage for documents)
var storage = builder.AddAzureStorage("storage")
    .RunAsEmulator(configure => configure.WithLifetime(ContainerLifetime.Persistent));

var blobs = storage.AddBlobs("blobs");

// Azure Application Insights (optional for local development)
var appInsights = builder.AddAzureApplicationInsights("appinsights");

// ============================================================================
// DAPR CONFIGURATION
// ============================================================================

// Add Dapr support with sidecars for each service
builder.AddDapr(options =>
{
    options.EnableTelemetry = true;
    options.DaprPath = "dapr"; // Assumes dapr CLI is in PATH
});

// ============================================================================
// API SERVICES
// ============================================================================

// Enrollment API - handles enrollment application submissions and workflows
var enrollmentApi = builder.AddProject<Projects.K12_Api_Enrollment>("enrollment-api")
    .WithReference(sqlDb)
    .WithReference(redis)
    .WithReference(messaging)
    .WithReference(blobs)
    .WithReference(appInsights)
    .WithDaprSidecar("enrollment-api")
    .WithHttpHealthCheck("/health")
    .WithReplicas(1);

// Programs API - handles program management and award allocations
var programsApi = builder.AddProject<Projects.K12_Api_Programs>("programs-api")
    .WithReference(sqlDb)
    .WithReference(redis)
    .WithReference(messaging)
    .WithReference(blobs)
    .WithReference(appInsights)
    .WithDaprSidecar("programs-api")
    .WithHttpHealthCheck("/health")
    .WithReplicas(1);

// Admin API - handles administrative functions and reporting
var adminApi = builder.AddProject<Projects.K12_Api_Admin>("admin-api")
    .WithReference(sqlDb)
    .WithReference(redis)
        .WithReference(messaging)
    .WithReference(blobs)
    .WithReference(appInsights)
    .WithDaprSidecar("admin-api")
    .WithHttpHealthCheck("/health")
    .WithReplicas(1);

// ============================================================================
// BUILD AND RUN
// ============================================================================

var app = builder.Build();

await app.RunAsync();
