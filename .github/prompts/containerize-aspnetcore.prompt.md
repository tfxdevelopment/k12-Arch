---
agent: 'agent'
description: 'Containerize an ASP.NET Core application with optimized multi-stage build'
---
# Containerize ASP.NET Core Application

Create an optimized Dockerfile for the ASP.NET Core application.

## Multi-Stage Build

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Restore dependencies first for caching
COPY ["*.csproj", "./"]
RUN dotnet restore

# Build application
COPY . .
RUN dotnet publish -c Release -o /app/publish --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS runtime
WORKDIR /app

# Create non-root user
RUN adduser -D -h /app appuser
USER appuser

COPY --from=build --chown=appuser:appuser /app/publish .

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Application.dll"]
```

## Best Practices

- Use Alpine-based images for smaller footprint
- Run as non-root user
- Implement health checks
- Layer optimization for build caching
- Multi-architecture support if needed

Generate the complete Dockerfile with docker-compose.yml.
