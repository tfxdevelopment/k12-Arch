var builder = DistributedApplication.CreateBuilder(args);

// Add Dapr for function orchestration
builder.AddDapr(options =>
{
    options.DaprGrpcPort = 50001;
    options.DaprHttpPort = 3500;
    options.EnableTelemetry = true;
});

// Add local APIM emulator (using Azure API Management emulator container)
var apim = builder.AddContainer("apim-emulator", "mcr.microsoft.com/azure-api-management/gateway", "2.6.0")
    .WithHttpEndpoint(port: 8080, targetPort: 8080, name: "http")
    .WithEnvironment("config.service.endpoint", "http://localhost:8081")
    .WithBindMount("./apim-config", "/app/config");

// Add Angular documentation site (NX workspace)
var docsSite = builder.AddNpmApp("docs-site", "../docs-site", "start")
    .WithHttpEndpoint(port: 4200, env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

// Add optional Docs API (serves markdown metadata)
var docsApi = builder.AddProject<Projects.K12_Docs_Api>("docs-api")
    .WithReference(apim)
    .WithDaprSidecar();

// Configure APIM to route to docs site and API
apim.WithEnvironment("DOCS_SITE_URL", docsSite.GetEndpoint("http"))
    .WithEnvironment("DOCS_API_URL", docsApi.GetEndpoint("http"));

builder.Build().Run();
