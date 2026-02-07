using K12.Api.Admin;
using K12.Api.Admin.Features.CreateUser;
using K12.Api.Admin.Features.GetUserById;
using K12.Api.Admin.Features.GetUsers;
using K12.Api.Admin.Features.UpdateUser;
using K12.ServiceDefaults;

var builder = WebApplication.CreateBuilder(args);

// ============================================================================
// ASPIRE SERVICE DEFAULTS
// Add observability, health checks, service discovery, and resilience
// ============================================================================
builder.AddServiceDefaults();

// ============================================================================
// DAPR INTEGRATION
// Add Dapr client and subscribe to pub/sub topics
// ============================================================================
builder.Services.AddDaprClient();
builder.Services.AddControllers().AddDapr();

// ============================================================================
// API CONFIGURATION
// OpenAPI, Swagger, and API documentation
// ============================================================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "K12 Admin API",
        Version = "v1",
        Description = "Cloud-native administration API for user and system management"
    });
});

// ============================================================================
// APPLICATION SERVICES
// MediatR, FluentValidation, Mapster
// ============================================================================
builder.Services.AddApplicationServices(builder.Configuration);

var app = builder.Build();

// ============================================================================
// MIDDLEWARE PIPELINE
// ============================================================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Map Dapr pub/sub endpoints
app.UseCloudEvents();
app.MapSubscribeHandler();

app.MapControllers();

// ============================================================================
// MAP FEATURE ENDPOINTS (Vertical Slice Architecture)
// ============================================================================
app.MapGetUsersEndpoint();
app.MapGetUserByIdEndpoint();
app.MapCreateUserEndpoint();
app.MapUpdateUserEndpoint();

// Map Aspire health check endpoints
app.MapDefaultEndpoints();

await app.RunAsync();
