using K12.Api.Programs;
using K12.Api.Programs.Features.CreateProgram;
using K12.Api.Programs.Features.GetProgramById;
using K12.Api.Programs.Features.GetPrograms;
using K12.Api.Programs.Features.UpdateProgram;
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
        Title = "K12 Programs API",
        Version = "v1",
        Description = "Cloud-native programs management API for educational offerings"
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
app.MapGetProgramsEndpoint();
app.MapGetProgramByIdEndpoint();
app.MapCreateProgramEndpoint();
app.MapUpdateProgramEndpoint();

// Map Aspire health check endpoints
app.MapDefaultEndpoints();

await app.RunAsync();
