using K12.ServiceDefaults;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddDaprClient();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new() { Title = "K12 Admin API", Version = "v1" });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.MapGet("/api/admin", () => Results.Ok(new { Message = "Admin API - Coming Soon" }))
   .WithName("GetAdmin")
   .WithTags("Admin")
   .WithOpenApi();

app.MapDefaultEndpoints();

await app.RunAsync();
