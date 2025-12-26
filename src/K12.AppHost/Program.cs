var builder = DistributedApplication.CreateBuilder(args);

// Add Dapr for function orchestration
builder.AddDapr();

// Add optional Docs API (serves markdown metadata)
var docsApi = builder.AddProject<Projects.K12_Docs_Api>("docs-api");

// Add Angular documentation site (NX workspace) - optional
// var docsSite = builder.AddNpmApp("docs-site", "../docs-site", "start")
//     .WithHttpEndpoint(port: 4200, env: "PORT")
//     .WithExternalHttpEndpoints()
//     .PublishAsDockerFile();

builder.Build().Run();
