using Markdig;

var builder = WebApplication.CreateBuilder(args);
builder.AddServiceDefaults();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowDocs", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();
app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowDocs");

// API to list all markdown files
app.MapGet("/api/docs/list", () =>
{
    var wikiPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "wiki");
    var files = Directory.GetFiles(wikiPath, "*.md", SearchOption.AllDirectories)
        .Select(f => new
        {
            Path = f.Replace(wikiPath, "").Replace("\\", "/").TrimStart('/'),
            Title = Path.GetFileNameWithoutExtension(f)
        });
    return Results.Ok(files);
});

// API to get markdown content by path
app.MapGet("/api/docs/{*path}", (string path) =>
{
    var wikiPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "wiki", path);
    if (!File.Exists(wikiPath))
        return Results.NotFound();

    var markdown = File.ReadAllText(wikiPath);
    var html = Markdown.ToHtml(markdown);
    return Results.Ok(new { Markdown = markdown, Html = html });
});

app.Run();
