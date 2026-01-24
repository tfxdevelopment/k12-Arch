---
agent: 'agent'
description: 'Containerize an ASP.NET Framework application for Windows containers'
---
# Containerize ASP.NET Framework Application

Create a Dockerfile to containerize the ASP.NET Framework application.

## Requirements

- Target Windows Server Core base image with IIS
- Install required .NET Framework version
- Configure IIS application pool
- Handle web.config transformations
- Implement health check endpoint

## Dockerfile Template

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/framework/sdk:4.8-windowsservercore-ltsc2022 AS build
WORKDIR /src
COPY . .
RUN nuget restore
RUN msbuild /p:Configuration=Release /p:DeployOnBuild=true /p:PublishProfile=Container

# Runtime stage
FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8-windowsservercore-ltsc2022
WORKDIR /inetpub/wwwroot
COPY --from=build /src/obj/Container/Package/PackageTmp .

# Configure IIS
RUN powershell -Command \
    Set-WebConfiguration -Filter /system.webServer/httpErrors -Value @{errorMode='Detailed'}

EXPOSE 80
```

## Configuration

- Environment-specific settings via environment variables
- Connection strings from container secrets
- Logging configuration for container output
- Health check endpoint at /health

Generate the complete containerization setup.
