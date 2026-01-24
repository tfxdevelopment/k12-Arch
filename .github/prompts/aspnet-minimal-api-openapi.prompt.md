---
agent: 'agent'
description: 'Generate ASP.NET Minimal API endpoint with OpenAPI support'
---
# ASP.NET Minimal API with OpenAPI

Generate a new ASP.NET Core Minimal API endpoint for ${input:EndpointName} that:

1. Uses TypedResults for OpenAPI schema generation
2. Implements proper HTTP method semantics
3. Returns appropriate status codes
4. Uses endpoint filters for validation
5. Groups related endpoints using MapGroup

## Requirements

- Use `Results<T1, T2>` union types for multiple response types
- Add XML documentation for OpenAPI descriptions
- Implement input validation using endpoint filters
- Use `[FromBody]`, `[FromQuery]` attributes for clear model binding
- Configure route with proper HTTP method constraints

## Example Structure

```csharp
app.MapGroup("/api/v1/${input:ResourceName}")
   .WithTags("${input:ResourceName}")
   .MapGet("/", Get${input:ResourceName}s)
   .MapGet("/{id}", Get${input:ResourceName}ById)
   .MapPost("/", Create${input:ResourceName})
   .MapPut("/{id}", Update${input:ResourceName})
   .MapDelete("/{id}", Delete${input:ResourceName});
```

Generate the complete implementation following these patterns.
