var builder = DistributedApplication.CreateBuilder(args);

var docs = builder.AddDockerfile("docs", "../../../tools/wiki/apps/docs")
    .WithEnvironment("HOST", "0.0.0.0")
    .WithEnvironment("PORT", "4321")
    .WithHttpEndpoint(name: "http", port: 4321, targetPort: 4321)
    .WithHttpHealthCheck("/");

var scalar = builder.AddDockerfile("scalar", "../../../tools/wiki/apps/scalar")
    .WithEnvironment("HOST", "0.0.0.0")
    .WithEnvironment("PORT", "5050")
    .WithHttpEndpoint(name: "http", port: 5050, targetPort: 5050)
    .WithHttpHealthCheck("/");

var storybook = builder.AddDockerfile("storybook", "../../../tools/wiki/apps/storybook")
    .WithEnvironment("HOST", "0.0.0.0")
    .WithEnvironment("PORT", "6006")
    .WithHttpEndpoint(name: "http", port: 6006, targetPort: 6006)
    .WithHttpHealthCheck("/");

var portal = builder.AddDockerfile("portal", "../../../tools/wiki/apps/portal")
    .WithEnvironment("HOST", "0.0.0.0")
    .WithEnvironment("PORT", "3000")
    .WithEnvironment("IDP_DOCS_UPSTREAM", docs.GetEndpoint("http"))
    .WithEnvironment("IDP_SCALAR_UPSTREAM", scalar.GetEndpoint("http"))
    .WithEnvironment("IDP_STORYBOOK_UPSTREAM", storybook.GetEndpoint("http"))
    .WithHttpEndpoint(name: "http", port: 3000, targetPort: 3000)
    .WithHttpHealthCheck("/")
    .WithExternalHttpEndpoints();

var app = builder.Build();

await app.RunAsync();
