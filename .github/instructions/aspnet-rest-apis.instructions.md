---
description: Rules for developing REST APIs using ASP.NET Core minimal APIs
globs: "*.cs"
applyTo: '**/*.cs'
---

# Developing REST APIs with ASP.NET Core Minimal APIs

## Core Design Principles

- Follow RESTful resource-oriented design using plural nouns (e.g., /users, /orders)
- Implement proper HTTP method semantics (GET, POST, PUT, DELETE, PATCH)
- Use appropriate HTTP status codes consistently
- Version APIs using URL path versioning (e.g., /api/v1/resources)

## Implementation Patterns

### Architecture

- Use vertical slice architecture to organize code by feature, not layer
- Separate business logic from endpoint definitions
- Use extension methods on `IEndpointRouteBuilder` to group related endpoints
- Prefer dependency injection via parameters rather than constructor injection for filters
- Keep endpoint handlers focused and testable

### Endpoint Organization

- Create endpoint groups using `MapGroup()` for related routes
- Apply shared filters, authentication, and metadata at the group level
- Use meaningful route prefixes that reflect resource hierarchy
- Implement endpoint filters for cross-cutting concerns (logging, validation)

## Code Patterns

- Use `TypedResults` for response type inference in OpenAPI/Swagger
- Prefer `Results<T1, T2>` union types over dynamic results
- Implement `IResult` for custom response handling
- Use `AsParametersAttribute` for clean parameter grouping
- Apply `[FromBody]`, `[FromQuery]`, etc. for explicit model binding

## Naming Conventions

- Use `Get{Resource}`, `Create{Resource}`, `Update{Resource}`, `Delete{Resource}` for handler methods
- Suffix filter classes with `Filter` (e.g., `ValidationFilter`)
- Name endpoint groups using `{Resource}Endpoints` pattern
- Use descriptive route parameter names that match domain concepts

## Error Handling

- Return RFC 9457 `ProblemDetails` for all errors
- Create consistent error response structures using `Results.Problem()`
- Include correlation IDs in error responses for traceability
- Avoid exposing internal exception details in production responses
- Use global exception handling middleware for unhandled exceptions

## Performance Best Practices

- Implement `IAsyncEnumerable<T>` for streaming large datasets
- Use response caching with appropriate cache headers
- Apply compression using built-in compression middleware
- Consider output caching for frequently accessed, static data
- Use cancellation tokens to support request cancellation

## Security Implementation

- Apply `RequireAuthorization()` at appropriate levels
- Use policy-based authorization for complex permission scenarios
- Implement CORS correctly using `AddCors()` and `RequireCors()`
- Apply rate limiting with `RateLimiterPolicy` per endpoint or group
- Validate all inputs using built-in validation or FluentValidation

## Testing Approach

- Use `WebApplicationFactory<T>` for integration testing endpoints
- Test endpoint filters in isolation using mock `EndpointFilterInvocationContext`
- Verify HTTP status codes and response structures
- Test authentication and authorization scenarios explicitly
- Mock external dependencies using the DI container overrides
