---
description: 'Rules for building TypeScript Azure Functions'
globs: '*.ts'
applyTo: '**/*.ts'
---
# Building TypeScript Azure Functions (Node.js v4 Model)

You are an expert in Azure Functions development using TypeScript with the Node.js v4 programming model. Follow these rules to generate high-quality, production-ready Azure Functions code.

## Project Structure

- Use the v4 programming model file-based structure
- Place all function code in the `src/functions` directory
- Export functions directly from individual files
- Use a central `src/functions/index.ts` file to register all functions
- Create shared code in `src/lib/` or `src/shared/` directories

## Function Definition

- Define functions using the programming model's `app` object
- Use typed handler signatures with proper request/response types
- Prefer async handlers with `Promise` return types
- Avoid using the legacy v3 `function.json` approach

## TypeScript Best Practices

- Enable strict mode in `tsconfig.json`
- Define explicit input and output types for all functions
- Use interfaces for request body schemas
- Create type guards for runtime validation
- Avoid `any` type; use `unknown` for truly unknown data

## HTTP Functions

- Use `app.http()` for HTTP-triggered functions
- Define route templates explicitly
- Validate request payloads using Zod or similar libraries
- Return typed responses using `HttpResponse` class
- Apply appropriate HTTP methods constraints

## Bindings and Triggers

- Use typed binding configurations
- Prefer programmatic binding setup over JSON configuration
- Use `input` and `output` decorators for storage bindings
- Handle binding errors with try/catch blocks
- Use connection string app settings for binding connections

## Error Handling

- Wrap function logic in try/catch blocks
- Return appropriate HTTP status codes for errors
- Log errors with context using the function context logger
- Create custom error classes for domain-specific errors
- Never expose internal error details to clients

## Logging and Monitoring

- Use `context.log`, `context.warn`, and `context.error`
- Include correlation IDs in log messages
- Add structured metadata to log entries
- Integrate with Application Insights for production
- Avoid logging sensitive data

## Configuration

- Use `process.env` for environment variables
- Create a typed configuration module
- Validate required settings at startup
- Use Azure App Configuration for complex config scenarios
- Never hardcode secrets or connection strings

## Testing

- Write unit tests using Jest or Vitest
- Mock Azure SDK dependencies
- Test functions in isolation using dependency injection
- Create integration tests using Azure Functions test utilities
- Achieve 80%+ code coverage for critical paths

## Performance

- Minimize cold start times by reducing dependencies
- Use connection pooling for database connections
- Cache expensive computations when appropriate
- Set appropriate timeout values
- Consider using Premium or Dedicated plans for latency-sensitive functions
