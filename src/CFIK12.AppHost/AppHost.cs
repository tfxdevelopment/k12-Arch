var builder = DistributedApplication.CreateBuilder(args);

var server = builder.AddProject<Projects.CFIK12_Server>("server")
    .WithHttpHealthCheck("/health")
    .WithExternalHttpEndpoints();

var webfrontend = builder.AddViteApp("webfrontend", "../frontend")
    .WithReference(server)
    .WaitFor(server);

server.PublishWithContainerFiles(webfrontend, "wwwroot");

builder.AddAzureFunctionsProject<Projects.CFIk12_Functions>("cfik12-functions");

builder.Build().Run();
