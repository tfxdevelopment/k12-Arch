using K12.ServiceDefaults;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddDaprClient();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new() { Title = "K12 Programs API", Version = "v1" });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
        // TODO: Update Scalar API reference to use new API
    // app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.MapGet("/api/programs", () => Results.Ok(new { Message = "Programs API - Coming Soon" }))
   .WithName("GetPrograms")
   .WithTags("Programs")
   .WithOpenApi();

app.MapDefaultEndpoints();

await app.RunAsync();
