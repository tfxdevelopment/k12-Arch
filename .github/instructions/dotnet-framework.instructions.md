---
description: 'Guidelines for .NET Framework 4.8 and .NET Standard 2.0 code'
globs: '*.cs'
alwaysApply: false
applyTo: "**/*.cs"
---

# Development Guidelines for .NET Framework 4.8 and .NET Standard 2.0

This document provides coding guidelines tailored for .NET Framework 4.8 and .NET Standard 2.0 projects. Follow these conventions to ensure compatibility, maintainability, and performance within the constraints of these platforms.

> **Tip:** Run `dotnet build` or equivalent to verify compatibility after each change.

---

## C# Language Version

.NET Framework 4.8 and .NET Standard 2.0 typically support **C# 7.3**.

### Allowed Features (C# 7.3 and earlier)

- `var` keyword for local variable declaration
- Expression-bodied members: `public int Count => _count;`
- Auto-property initializers: `public string Name { get; set; } = "";`
- Null-conditional operators: `obj?.Property`
- Null-coalescing operator: `obj ?? defaultValue`
- String interpolation: `$"Hello, {name}"`
- Tuples: `(int x, int y) = GetPoint();`
- Local functions (C# 7.0+)
- Pattern matching (`is`, `switch` with type checks)
- `out` variable declarations: `int.TryParse(input, out var result)`
- `throw` expressions

### Avoid (C# 8.0+)

- Nullable reference types (`string?`, `#nullable enable`)
- Default interface implementations
- `switch` expressions
- `using` declarations (prefer `using` blocks)
- Async streams (`IAsyncEnumerable<T>`)
- Range/index expressions (`array[^1]`, `array[1..4]`)
- Records, init-only properties, top-level statements

---

## Null Handling

Since nullable reference types are not available, use these conventions:

### Null Checks

```csharp
// Explicit null checks
if (param == null)
    throw new ArgumentNullException(nameof(param));

// Guard clauses at method start
public void Process(Order order)
{
    if (order == null) throw new ArgumentNullException(nameof(order));
    // ...
}
```

### Document Nullability

Use XML documentation to indicate nullable returns or parameters:

```csharp
/// <summary>
/// Finds a customer by ID.
/// </summary>
/// <param name="id">The customer ID.</param>
/// <returns>The customer, or null if not found.</returns>
public Customer FindById(int id) { ... }
```

---

## Async/Await

Use the Task-based Asynchronous Pattern (TAP) without C# 8+ features.

### Patterns

```csharp
// Name async methods with "Async" suffix
public async Task<Order> GetOrderAsync(int id)
{
    var order = await _repository.FindAsync(id);
    return order;
}

// Use ConfigureAwait(false) in library code
var result = await SomeAsyncOperation().ConfigureAwait(false);
```

### Avoid

- `await foreach` (not available)
- `await using` (not available)

---

## Collections

### Prefer .NET Standard 2.0-compatible types

- Use `List<T>`, `Dictionary<TKey, TValue>`, `HashSet<T>`
- Use arrays for fixed-size collections
- Use `IEnumerable<T>` in method signatures for flexibility
- Use `IReadOnlyList<T>` and `IReadOnlyDictionary<TKey, TValue>` for read-only semantics

### Avoid

- `IAsyncEnumerable<T>` (not available)
- `Span<T>` and `Memory<T>` (limited support; requires extra packages)

---

## Dependency Injection

Use Microsoft.Extensions.DependencyInjection (compatible with .NET Standard 2.0):

```csharp
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddTransient<IOrderService, OrderService>();
        services.AddScoped<IDbContext, AppDbContext>();
        services.AddSingleton<IConfiguration>(Configuration);
    }
}
```

---

## Error Handling

### Exceptions

```csharp
// Throw specific exceptions
throw new InvalidOperationException("Order cannot be modified after shipment.");

// Use try-catch for expected failures
try
{
    var data = await LoadDataAsync();
}
catch (IOException ex)
{
    _logger.LogError(ex, "Failed to load data");
    throw;
}
```

### Avoid

- Using exceptions for flow control
- Catching generic `Exception` without logging

---

## Logging

Use `Microsoft.Extensions.Logging` (compatible with .NET Standard 2.0):

```csharp
public class OrderService
{
    private readonly ILogger<OrderService> _logger;

    public OrderService(ILogger<OrderService> logger)
    {
        _logger = logger;
    }

    public void ProcessOrder(Order order)
    {
        _logger.LogInformation("Processing order {OrderId}", order.Id);
        // ...
    }
}
```

---

## Configuration

Use `Microsoft.Extensions.Configuration`:

```csharp
public class AppSettings
{
    public string ConnectionString { get; set; }
    public int MaxRetries { get; set; }
}

// Bind configuration
var settings = new AppSettings();
Configuration.GetSection("App").Bind(settings);
```

---

## Entity Framework

For .NET Framework 4.8, use Entity Framework 6.x:

```csharp
public class AppDbContext : DbContext
{
    public DbSet<Order> Orders { get; set; }
    public DbSet<Customer> Customers { get; set; }

    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>()
            .HasKey(o => o.Id);
    }
}
```

### Notes

- EF Core 3.1 supports .NET Standard 2.0 but has limitations
- EF Core 2.x is fully compatible with .NET Standard 2.0

---

## Testing

Use xUnit, NUnit, or MSTest (all support .NET Framework 4.8):

```csharp
[Fact]
public async Task GetOrder_ReturnsOrder_WhenOrderExists()
{
    // Arrange
    var mockRepo = new Mock<IOrderRepository>();
    mockRepo.Setup(r => r.FindAsync(1)).ReturnsAsync(new Order { Id = 1 });
    var service = new OrderService(mockRepo.Object);

    // Act
    var result = await service.GetOrderAsync(1);

    // Assert
    Assert.NotNull(result);
    Assert.Equal(1, result.Id);
}
```

---

## Serialization

Use `Newtonsoft.Json` (widely compatible) or `System.Text.Json` (if using a compatibility package):

```csharp
// Newtonsoft.Json
var json = JsonConvert.SerializeObject(order);
var order = JsonConvert.DeserializeObject<Order>(json);

// System.Text.Json (with package)
var json = JsonSerializer.Serialize(order);
var order = JsonSerializer.Deserialize<Order>(json);
```

---

## Summary Checklist

| Feature | Use | Avoid |
| --- | --- | --- |
| Nullable Reference Types | Manual null checks + docs | `string?`, `#nullable enable` |
| Async/Await | TAP, `ConfigureAwait(false)` | `await foreach`, `await using` |
| Collections | `List<T>`, `IEnumerable<T>` | `Span<T>`, `IAsyncEnumerable<T>` |
| Pattern Matching | Basic (`is`, `switch`) | `switch` expressions |
| Records | Classes with equality | `record` keyword |
| Init-only Properties | Setters with validation | `init` keyword |
| Range/Index | Standard loops | `array[^1]`, `array[1..4]` |

---

This guide ensures compatibility with .NET Framework 4.8 and .NET Standard 2.0 while applying modern best practices where possible.
