---
applyTo: 'Dockerfile,docker-compose.yml,**/*.dockerfile'
---
# Docker Containerization Best Practices

When creating or modifying Docker configurations, follow these best practices:

## Multi-Stage Builds

Always use multi-stage builds to minimize final image size:

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Project.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Project.dll"]
```

## Base Images

- Use official images from verified publishers
- Prefer Alpine or slim variants for smaller footprints
- Always specify exact version tags, never use `latest`
- Use distroless images for production when possible

## Layer Optimization

- Order commands from least to most frequently changing
- Combine related RUN commands with `&&`
- Use `.dockerignore` to exclude unnecessary files
- Place COPY of dependency files before COPY of source code

## Security

- Run containers as non-root user
- Don't store secrets in images
- Remove build tools from final image
- Scan images for vulnerabilities
- Set read-only file systems where possible

## Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
```

## Labels and Metadata

```dockerfile
LABEL org.opencontainers.image.source="https://github.com/org/repo"
LABEL org.opencontainers.image.description="Application description"
LABEL org.opencontainers.image.version="1.0.0"
```

## Environment Variables

- Use ARG for build-time variables
- Use ENV for runtime variables
- Never hardcode secrets or credentials
- Provide sensible defaults

## Docker Compose

```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: runtime
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
    ports:
      - "8080:8080"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```
