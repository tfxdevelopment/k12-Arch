using DbUp;
using Microsoft.Extensions.Configuration;

Console.WriteLine("K12 Database Migrations Runner");
Console.WriteLine("==============================");

// Build configuration
var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: true)
    .AddEnvironmentVariables()
    .Build();

// Get connection string
var connectionString = configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("CONNECTION_STRING")
    ?? "Server=localhost;Database=K12CloudNative;Trusted_Connection=True;TrustServerCertificate=True;";

Console.WriteLine($"Connection: {MaskConnectionString(connectionString)}");
Console.WriteLine();

// Configure DbUp
var upgrader = DeployChanges.To
    .SqlDatabase(connectionString)
    .WithScriptsFromFileSystem(
        Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Scripts"))
    .LogToConsole()
    .Build();

// Check if database needs upgrading
var scriptsToExecute = upgrader.GetScriptsToExecute();

if (scriptsToExecute.Count == 0)
{
    Console.WriteLine("No new migrations to apply.");
    return 0;
}

Console.WriteLine($"Found {scriptsToExecute.Count} migration(s) to apply:");
foreach (var script in scriptsToExecute)
{
    Console.WriteLine($"  - {script.Name}");
}
Console.WriteLine();

// Perform upgrade
var result = upgrader.PerformUpgrade();

if (!result.Successful)
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine("Migration failed!");
    Console.WriteLine(result.Error);
    Console.ResetColor();
    return -1;
}

Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("Database migrations completed successfully!");
Console.ResetColor();

return 0;

// Helper function to mask connection string for logging
static string MaskConnectionString(string connectionString)
{
    if (connectionString.Contains("Password=", StringComparison.OrdinalIgnoreCase))
    {
        var start = connectionString.IndexOf("Password=", StringComparison.OrdinalIgnoreCase);
        var end = connectionString.IndexOf(';', start);
        if (end == -1) end = connectionString.Length;
        return connectionString[..start] + "Password=****" + connectionString[end..];
    }
    return connectionString;
}
