# ASPIRE-01: .NET Aspire AppHost Setup

**Status:** 📋 Proposed - Week 1 Deliverable
**Date:** 2025-11-24
**Owner:** CFI Architecture Team
**Target Audience:** Development Teams, DevOps Engineers

---

## Executive Summary

This document describes how to set up **.NET Aspire** for local development of the K12 MyPortal multi-container architecture. Aspire transforms a **2-hour manual setup** (Docker Compose files, connection strings, service discovery) into a **5-minute F5 experience** that launches all 5 containers with automatic service discovery, observability, and deployment tooling.

### The Problem Aspire Solves

**Before Aspire (Current State):**
```bash
# Developer wants to run full stack locally
# Manual steps (2 hours):

1. Install Docker Desktop
2. Create docker-compose.yml (200 lines)
3. Configure connection strings for:
   - Azure SQL (local SQL Server)
   - Redis (local Redis container)
   - Azure Storage (Azurite emulator)
4. Start containers: docker-compose up -d
5. Wait for containers to be ready (health checks)
6. Start Functions: func start --port 7071
7. Start DAB: dab start --config dab-config.json
8. Start Trino: docker run trino:latest ...
9. Start CubeJS: docker run cubejs:latest ...
10. Configure service URLs in each container (hardcoded)
11. Debug: Attach to 5 different processes manually
12. Restart: Stop all, fix config, restart all (10 minutes)
```

**After Aspire (Proposed):**
```bash
# Developer wants to run full stack locally
# Aspire steps (5 minutes):

1. Install .NET 10 SDK (one-time)
2. Install Aspire workload: dotnet workload install aspire
3. Press F5 in Visual Studio (or: dotnet run --project K12.AppHost)
4. ✅ All 5 containers start automatically
5. ✅ Service discovery configured automatically
6. ✅ Aspire Dashboard opens: http://localhost:15888
7. ✅ Debug all containers in single IDE session
8. ✅ Hot reload works across all containers
```

**Time Savings:** 2 hours → 5 minutes = **96% reduction in setup time**

---

## What is .NET Aspire?

### Definition

**.NET Aspire** is a **cloud-native orchestration framework** for .NET applications that provides:

1. **AppHost** - Defines all services (containers, databases, caches) in C# code
2. **Service Discovery** - Automatic DNS resolution between containers (no hardcoded URLs)
3. **Observability Dashboard** - Real-time logs, traces, metrics at http://localhost:15888
4. **Azure Deployment** - `azd up` generates Bicep and deploys to Azure Container Apps
5. **Developer Experience** - F5 to launch everything, hot reload, unified debugging

### Conceptual Model

```
┌──────────────────────────────────────────────────────────────┐
│  K12.AppHost (Aspire Orchestrator)                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Program.cs (C# code defines all services)             │  │
│  │                                                        │  │
│  │ builder.AddContainer("k12-functions", ...)            │  │
│  │ builder.AddContainer("k12-dab", ...)                  │  │
│  │ builder.AddContainer("k12-trino", ...)                │  │
│  │ builder.AddContainer("k12-cubejs", ...)               │  │
│  │ builder.AddRedis("k12-redis")                         │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  When you press F5:                                          │
│  1. Starts Aspire Dashboard (http://localhost:15888)        │
│  2. Pulls/builds container images                           │
│  3. Starts all containers with health checks                │
│  4. Configures service discovery (automatic)                │
│  5. Wires up distributed tracing (OpenTelemetry)            │
│  6. Exposes logs/metrics in dashboard                       │
└──────────────────────────────────────────────────────────────┘
```

---

## Installation

### Prerequisites

1. **Windows 10/11 or macOS** (Linux supported)
2. **.NET 10 SDK** (LTS, released Nov 11, 2025)
3. **Docker Desktop** (for running containers locally)
4. **Visual Studio 2022 17.12+** or **VS Code + C# DevKit**

### Step 1: Install .NET 10 SDK

```bash
# Windows (winget)
winget install Microsoft.DotNet.SDK.10

# macOS (Homebrew)
brew install dotnet@10

# Linux (Ubuntu)
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 10.0

# Verify installation
dotnet --version
# Output: 10.0.0
```

### Step 2: Install Aspire Workload

```bash
# Install Aspire workload (includes templates, tooling, runtime)
dotnet workload install aspire

# Verify installation
dotnet workload list
# Output:
# Installed Workload Id      Manifest Version      Installation Source
# ------------------------------------------------------------------------
# aspire                     9.5.0                 SDK 10.0.0

# Check available Aspire templates
dotnet new list aspire
# Output:
# Template Name                 Short Name       Language
# -----------------------------------------------------------
# .NET Aspire Application       aspire           [C#]
# .NET Aspire App Host          aspire-apphost   [C#]
```

---

## AppHost Project Structure

### Create AppHost Project

```bash
# Navigate to solution root
cd c:/Projects/CFI/K12/k12-api-enrollment

# Create Aspire AppHost project
dotnet new aspire-apphost -n K12.AppHost

# Add to solution
dotnet sln add K12.AppHost/K12.AppHost.csproj

# Project structure:
# K12.AppHost/
# ├── K12.AppHost.csproj          (Project file)
# ├── Program.cs                   (Service definitions)
# ├── appsettings.json             (Configuration)
# └── Properties/
#     └── launchSettings.json      (Debug settings)
```

### AppHost Project File

```xml
<!-- K12.AppHost.csproj -->
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <OutputType>Exe</OutputType>
    <IsAspireHost>true</IsAspireHost>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Aspire.Hosting" Version="9.5.0" />
    <PackageReference Include="Aspire.Hosting.Azure.ApplicationInsights" Version="9.5.0" />
    <PackageReference Include="Aspire.Hosting.Azure.ContainerApps" Version="9.5.0" />
    <PackageReference Include="Aspire.Hosting.Dapr" Version="9.5.0" />
  </ItemGroup>

  <!-- Reference to Functions project (for building) -->
  <ItemGroup>
    <ProjectReference Include="..\K12.API\K12.API.csproj" />
  </ItemGroup>
</Project>
```

---

## Program.cs: Complete AppHost Configuration

### Full Code Example

```csharp
using Aspire.Hosting;
using Aspire.Hosting.Azure;
using Aspire.Hosting.Dapr;

var builder = DistributedApplication.CreateBuilder(args);

// ─────────────────────────────────────────────────────────────────
// 1. Shared Services (Redis, SQL, Storage)
// ─────────────────────────────────────────────────────────────────

// Azure SQL Database (local: SQL Server container, Azure: Azure SQL)
var sqlServer = builder.AddSqlServer("sql-server")
    .WithDataVolume()  // Persist data between restarts
    .AddDatabase("k12-database", "K12");

// Redis Cache (local: Redis container, Azure: Azure Cache for Redis)
var redis = builder.AddRedis("k12-redis")
    .WithDataVolume()
    .WithRedisCommander();  // Web UI at http://localhost:8081

// Azure Storage (local: Azurite emulator, Azure: Azure Storage Account)
var storage = builder.AddAzureStorage("k12-storage")
    .RunAsEmulator()
    .AddBlobs("documents");

// Application Insights (local: OpenTelemetry, Azure: App Insights)
var appInsights = builder.AddAzureApplicationInsights("k12-appinsights");

// ─────────────────────────────────────────────────────────────────
// 2. Container: k12-functions (.NET 10 Azure Functions)
// ─────────────────────────────────────────────────────────────────

var functions = builder.AddProject<Projects.K12_API>("k12-functions")
    .WithReference(sqlServer)
    .WithReference(redis)
    .WithReference(storage)
    .WithReference(appInsights)
    .WithEnvironment("ASPNETCORE_ENVIRONMENT", "Development")
    .WithEnvironment("AzureFunctionsJobHost__Logging__Console__IsEnabled", "true")
    .WithHttpEndpoint(port: 7071, name: "http")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();  // Build Dockerfile on F5

// ─────────────────────────────────────────────────────────────────
// 3. Container: k12-dab (Data API Builder - REST + GraphQL)
// ─────────────────────────────────────────────────────────────────

var dab = builder.AddContainer("k12-dab", "mcr.microsoft.com/dotnet/aspnet", "8.0")
    .WithReference(sqlServer)
    .WithReference(redis)
    .WithBindMount("../k12-dab-config", "/app/config")  // Mount DAB config
    .WithArgs("dotnet", "tool", "run", "dab", "start", "--config", "/app/config/dab-config.json")
    .WithHttpEndpoint(port: 5000, name: "http")
    .WithEnvironment("DATABASE_CONNECTION_STRING", sqlServer.Resource.ConnectionStringExpression)
    .WaitFor(sqlServer);  // Don't start until SQL is ready

// ─────────────────────────────────────────────────────────────────
// 4. Container: k12-trino (SQL Federation for Analytics)
// ─────────────────────────────────────────────────────────────────

var trino = builder.AddContainer("k12-trino", "trinodb/trino", "latest")
    .WithReference(sqlServer)
    .WithReference(storage)
    .WithBindMount("../k12-trino-config", "/etc/trino")  // Mount Trino config
    .WithHttpEndpoint(port: 8080, name: "http")
    .WithEnvironment("CATALOG_SQLSERVER_CONNECTION_URL", sqlServer.Resource.ConnectionStringExpression)
    .WaitFor(sqlServer);

// ─────────────────────────────────────────────────────────────────
// 5. Container: k12-cubejs (Semantic Layer + Pre-Aggregations)
// ─────────────────────────────────────────────────────────────────

var cubejs = builder.AddContainer("k12-cubejs", "cubejs/cube", "latest")
    .WithReference(trino)
    .WithReference(redis)
    .WithBindMount("../k12-cubejs-config", "/cube/conf")  // Mount CubeJS schema
    .WithHttpEndpoint(port: 4000, name: "http")
    .WithEnvironment("CUBEJS_DB_TYPE", "trino")
    .WithEnvironment("CUBEJS_DB_HOST", "k12-trino")
    .WithEnvironment("CUBEJS_DB_PORT", "8080")
    .WithEnvironment("CUBEJS_REDIS_URL", redis.Resource.ConnectionStringExpression)
    .WaitFor(trino)
    .WaitFor(redis);

// ─────────────────────────────────────────────────────────────────
// 6. Dapr Integration (Service Mesh)
// ─────────────────────────────────────────────────────────────────

builder.AddDapr(dapr =>
{
    // Add Dapr state store (Redis)
    dapr.AddStateStore("statestore", "state.redis", options =>
    {
        options.Metadata.Add("redisHost", redis.Resource.ConnectionStringExpression);
        options.Metadata.Add("redisPassword", "");  // No password for local Redis
    });

    // Add Dapr pub/sub (Redis Streams)
    dapr.AddPubSub("pubsub", "pubsub.redis", options =>
    {
        options.Metadata.Add("redisHost", redis.Resource.ConnectionStringExpression);
    });

    // Enable Dapr for Functions container
    functions.WithDaprSidecar("k12-functions");

    // Enable Dapr for DAB container
    dab.WithDaprSidecar("k12-dab");
});

// ─────────────────────────────────────────────────────────────────
// 7. Build and Run
// ─────────────────────────────────────────────────────────────────

var app = builder.Build();
await app.RunAsync();
```

---

## Service Definitions Breakdown

### 1. AddProject (Functions Container)

**Purpose:** Build and run the K12.API Functions project as a container

```csharp
var functions = builder.AddProject<Projects.K12_API>("k12-functions")
    .WithReference(sqlServer)      // Inject SQL connection string
    .WithReference(redis)           // Inject Redis connection string
    .WithReference(storage)         // Inject Azure Storage connection string
    .WithReference(appInsights)     // Inject App Insights instrumentation key
    .WithHttpEndpoint(port: 7071, name: "http")  // Expose HTTP on port 7071
    .PublishAsDockerFile();         // Build Dockerfile on startup
```

**What Happens:**
1. Aspire finds `K12.API/Dockerfile`
2. Builds container image: `docker build -t k12-api:latest`
3. Starts container: `docker run -p 7071:80 k12-api:latest`
4. Injects environment variables (connection strings)
5. Registers in service discovery: `http://k12-functions`

### 2. AddContainer (DAB Container)

**Purpose:** Run Data API Builder from pre-built container image

```csharp
var dab = builder.AddContainer("k12-dab", "mcr.microsoft.com/dotnet/aspnet", "8.0")
    .WithBindMount("../k12-dab-config", "/app/config")  // Mount local config
    .WithArgs("dotnet", "tool", "run", "dab", "start", "--config", "/app/config/dab-config.json")
    .WithHttpEndpoint(port: 5000, name: "http")
    .WaitFor(sqlServer);  // Don't start until SQL is ready
```

**What Happens:**
1. Aspire pulls image: `docker pull mcr.microsoft.com/dotnet/aspnet:8.0`
2. Mounts local config: `-v c:/Projects/CFI/K12/k12-dab-config:/app/config`
3. Starts container with custom command: `dotnet tool run dab start ...`
4. Waits for SQL health check before starting
5. Registers in service discovery: `http://k12-dab`

### 3. AddSqlServer (SQL Database)

**Purpose:** Run local SQL Server for development (Azure SQL in production)

```csharp
var sqlServer = builder.AddSqlServer("sql-server")
    .WithDataVolume()  // Persist data in Docker volume (survives restarts)
    .AddDatabase("k12-database", "K12");  // Create K12 database
```

**What Happens:**
1. Aspire starts SQL Server container: `mcr.microsoft.com/mssql/server:2022-latest`
2. Creates volume: `docker volume create k12-sql-data`
3. Mounts volume: `-v k12-sql-data:/var/opt/mssql`
4. Creates database: `CREATE DATABASE K12`
5. Connection string auto-generated: `Server=localhost,1433;Database=K12;User=sa;Password=...`

### 4. AddRedis (Redis Cache)

**Purpose:** Run local Redis for caching and Dapr state store

```csharp
var redis = builder.AddRedis("k12-redis")
    .WithDataVolume()
    .WithRedisCommander();  // Optional: Web UI at http://localhost:8081
```

**What Happens:**
1. Aspire starts Redis container: `redis:latest`
2. Starts Redis Commander (web UI): `rediscommander/redis-commander:latest`
3. Connection string auto-generated: `localhost:6379`

### 5. Service Dependencies (WaitFor)

**Purpose:** Ensure containers start in correct order

```csharp
var dab = builder.AddContainer("k12-dab", ...)
    .WaitFor(sqlServer);  // Wait for SQL health check

var cubejs = builder.AddContainer("k12-cubejs", ...)
    .WaitFor(trino)
    .WaitFor(redis);
```

**Startup Order:**
```
1. SQL Server (health check: port 1433 responds)
2. Redis (health check: PING returns PONG)
3. Azure Storage Emulator (health check: blob endpoint responds)
4. k12-functions (depends on SQL + Redis + Storage)
5. k12-dab (depends on SQL)
6. k12-trino (depends on SQL + Storage)
7. k12-cubejs (depends on Trino + Redis)
```

---

## Environment Variables and Service Discovery

### Automatic Service Discovery

**Without Aspire (Hardcoded URLs):**
```csharp
// In k12-functions code
var httpClient = new HttpClient();
var response = await httpClient.GetAsync("http://localhost:5000/api/students");
//                                         ↑ Problem: Hardcoded URL breaks in production
```

**With Aspire (Service Discovery):**
```csharp
// In k12-functions code
var httpClient = new HttpClient();
var response = await httpClient.GetAsync("http://k12-dab/api/students");
//                                         ↑ Resolved automatically:
//                                           Local: http://localhost:5000
//                                           Azure: https://k12-dab.internal.azurecontainerapps.io
```

**How It Works:**
```csharp
// AppHost injects environment variable
functions.WithEnvironment("services__k12-dab__http__0", "http://localhost:5000");

// Functions code reads from configuration
builder.Services.AddHttpClient("k12-dab", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["services:k12-dab:http:0"]);
});
```

### Connection String Injection

**Automatic Connection Strings:**
```csharp
// AppHost
var sqlServer = builder.AddSqlServer("sql-server").AddDatabase("k12-database", "K12");
var functions = builder.AddProject<Projects.K12_API>("k12-functions")
    .WithReference(sqlServer);

// Generates environment variable (injected into k12-functions):
// ConnectionStrings__k12-database=Server=localhost,1433;Database=K12;User=sa;Password=...

// Functions code (no changes needed):
var connectionString = builder.Configuration.GetConnectionString("k12-database");
```

---

## Aspire Dashboard

### What is the Aspire Dashboard?

**URL:** http://localhost:15888 (auto-opens on F5)

The Aspire Dashboard is a **real-time observability UI** showing:
- **Resources** - All running containers, databases, caches
- **Logs** - Live logs from all containers (filterable)
- **Traces** - Distributed traces (request flows across containers)
- **Metrics** - CPU, memory, request count, error rate
- **Environment** - Connection strings, service URLs

### Dashboard Tabs

**1. Resources Tab:**
```
┌─────────────────────────────────────────────────────────────┐
│ Resources (5 running)                                       │
├─────────────┬───────────┬─────────┬────────┬───────────────┤
│ Name        │ Type      │ Status  │ Port   │ Health        │
├─────────────┼───────────┼─────────┼────────┼───────────────┤
│ k12-functions│ Project  │ Running │ 7071   │ Healthy ✓     │
│ k12-dab     │ Container │ Running │ 5000   │ Healthy ✓     │
│ k12-trino   │ Container │ Running │ 8080   │ Starting...   │
│ k12-cubejs  │ Container │ Running │ 4000   │ Healthy ✓     │
│ k12-redis   │ Container │ Running │ 6379   │ Healthy ✓     │
└─────────────┴───────────┴─────────┴────────┴───────────────┘
```

**2. Logs Tab:**
```
┌─────────────────────────────────────────────────────────────┐
│ Logs (All Services) [Filter: ERROR]                        │
├──────────────┬──────────────────────────────────────────────┤
│ 12:45:32 PM  │ k12-functions: HTTP GET /api/students/123   │
│ 12:45:32 PM  │ k12-dab: Query executed in 45ms             │
│ 12:45:33 PM  │ k12-trino: ERROR: Connection timeout        │
│ 12:45:34 PM  │ k12-cubejs: Cache hit for enrollment query  │
└──────────────┴──────────────────────────────────────────────┘
```

**3. Traces Tab:**
```
┌─────────────────────────────────────────────────────────────┐
│ Distributed Trace: POST /api/applications (250ms)          │
├─────────────────────────────────────────────────────────────┤
│ ▼ k12-functions (150ms)                                     │
│   ├─ EntraAuthenticationMiddleware (25ms)                  │
│   ├─ HTTP GET http://k12-dab/api/students/123 (50ms)       │
│   │   └─ k12-dab: SQL SELECT FROM Students (45ms)          │
│   ├─ NRules Eligibility (45ms)                             │
│   └─ SQL INSERT INTO Applications (30ms)                   │
└─────────────────────────────────────────────────────────────┘
```

### Accessing Container UIs

**From Dashboard:**
- **k12-functions:** http://localhost:7071/api/swagger (Swagger UI)
- **k12-dab:** http://localhost:5000/graphql (GraphQL Playground)
- **k12-trino:** http://localhost:8080 (Trino Web UI)
- **k12-cubejs:** http://localhost:4000 (CubeJS Playground)
- **Redis Commander:** http://localhost:8081 (Redis Web UI)

---

## Running Locally

### Option 1: Visual Studio (Recommended)

```
1. Open solution: K12.sln
2. Set K12.AppHost as startup project (right-click → Set as Startup Project)
3. Press F5 (or: Debug → Start Debugging)
4. Aspire Dashboard opens in browser: http://localhost:15888
5. Wait for all containers to be "Healthy" (30-60 seconds)
6. Test endpoints:
   - Functions: http://localhost:7071/api/health
   - DAB: http://localhost:5000/api/students
   - Trino: http://localhost:8080
   - CubeJS: http://localhost:4000/playground
```

### Option 2: Command Line

```bash
# Navigate to AppHost project
cd c:/Projects/CFI/K12/k12-api-enrollment/K12.AppHost

# Run AppHost
dotnet run

# Output:
# info: Aspire.Hosting.DistributedApplication[0]
#       Aspire version: 9.5.0
# info: Aspire.Hosting.DistributedApplication[0]
#       Dashboard: http://localhost:15888
# info: Aspire.Hosting.DistributedApplication[0]
#       Building container: k12-functions
# info: Aspire.Hosting.DistributedApplication[0]
#       Starting container: k12-redis
# info: Aspire.Hosting.DistributedApplication[0]
#       Starting container: sql-server
# ...
# info: Aspire.Hosting.DistributedApplication[0]
#       All resources healthy. Application ready.
```

### Option 3: VS Code

```bash
# Install C# Dev Kit extension
code --install-extension ms-dotnettools.csdevkit

# Open solution
code c:/Projects/CFI/K12/k12-api-enrollment

# Press F5 (or: Run → Start Debugging)
# Select: ".NET Aspire" launch configuration
```

---

## Debugging

### Multi-Container Debugging

**Visual Studio automatically attaches debuggers to all containers:**

1. Set breakpoints in any project:
   - `K12.API/Functions/GetStudentById.cs` (Functions)
   - `K12.Application/AdminApp.cs` (Business logic)

2. Press F5 to start debugging

3. Send HTTP request: `GET http://localhost:7071/api/students/123`

4. Debugger hits breakpoint in Functions code

5. Step through code (F10), inspect variables

6. Code calls k12-dab: `await httpClient.GetAsync("http://k12-dab/api/students/123")`

7. If DAB had source code, debugger would step into DAB (cross-container debugging)

**Benefits:**
- ✅ Single F5 press debugs all containers
- ✅ Set breakpoints across multiple projects
- ✅ Inspect variables in any container
- ✅ Step through distributed calls

### Hot Reload

**Changes to code auto-reload without restart:**

```csharp
// Change this code:
[Function("GetStudentById")]
public async Task<IActionResult> GetStudentById(...)
{
    _logger.LogInformation("Fetching student {StudentId}", id);
    //                      ↑ Change log message
}

// Save file (Ctrl+S)
// ✅ Aspire detects change
// ✅ Rebuilds container in background
// ✅ Reloads container (no restart needed)
// ✅ Next request uses new code (2-3 seconds)
```

**Supported for:**
- ✅ .NET projects (Functions, APIs)
- ✅ Configuration files (appsettings.json)
- ⚠️ Dockerfile changes (requires full rebuild)

---

## Deployment Options

Aspire supports multiple deployment approaches:

| Approach | Use Case | CI/CD Integration |
|----------|----------|-------------------|
| **`azd up`** | Quick dev deployments | Interactive, manual |
| **`azd pipeline config`** | Azure Pipelines/GitHub Actions | Automated, enterprise |
| **Manifest + Custom Pipeline** | Full control | Custom Azure Pipelines |

---

## Deployment with Azure Pipelines (Recommended for Production)

### Aspire Manifest Generation

For enterprise CI/CD, generate an Aspire manifest as a **build artifact** that can be used by deployment stages:

```bash
# Generate manifest during CI build
dotnet run --project K12.AppHost \
  --publisher manifest \
  --output-path $(Build.ArtifactStagingDirectory)/aspire-manifest.json
```

### Azure Pipelines Integration

Use `azd pipeline config --provider azdo` to auto-configure Azure Pipelines:

```bash
# One-time setup (creates pipeline YAML + service connection)
cd K12.AppHost
azd pipeline config --provider azdo

# This generates:
# - .azdo/pipelines/azure-dev.yml
# - Service connection to Azure subscription
# - Pipeline variables for secrets
```

### Custom Azure Pipeline with Manifest Artifact

For full control, use a custom pipeline that saves the manifest as an artifact:

```yaml
# azure-pipelines-k12-aspire.yml
trigger:
  branches:
    include:
      - development
      - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  containerRegistry: 'k12acr.azurecr.io'
  resourceGroup: 'rg-k12-analytics-$(environment)'

stages:
  # ═══════════════════════════════════════════════════════════════
  # Stage 1: Build & Generate Manifest
  # ═══════════════════════════════════════════════════════════════
  - stage: Build
    displayName: 'Build & Publish Artifacts'
    jobs:
      - job: BuildAndPublish
        steps:
          # Install .NET 10 SDK
          - task: UseDotNet@2
            inputs:
              version: '10.x'
              includePreviewVersions: true
            displayName: 'Install .NET 10 SDK'

          # Install Aspire workload
          - script: dotnet workload install aspire
            displayName: 'Install Aspire Workload'

          # Restore & Build
          - script: |
              dotnet restore
              dotnet build --configuration Release --no-restore
            displayName: 'Build Solution'

          # ───────────────────────────────────────────────────────
          # Generate Aspire Manifest (Key Step!)
          # ───────────────────────────────────────────────────────
          - script: |
              dotnet run --project K12.AppHost/K12.AppHost.csproj \
                --publisher manifest \
                --output-path $(Build.ArtifactStagingDirectory)/aspire-manifest.json
            displayName: 'Generate Aspire Manifest'

          # Build container images with .NET SDK
          - script: |
              dotnet publish K12.QueryBuilder.API/K12.QueryBuilder.API.csproj \
                --os linux --arch x64 \
                -p:ContainerRegistry=$(containerRegistry) \
                -p:ContainerImageTag=$(Build.BuildId) \
                -p:ContainerImageName=k12-query-api
            displayName: 'Build Container Image'

          # Login to Azure Container Registry
          - task: Docker@2
            inputs:
              containerRegistry: 'K12-ACR-Connection'
              command: 'login'
            displayName: 'Login to ACR'

          # Push images to ACR
          - script: |
              docker push $(containerRegistry)/k12-query-api:$(Build.BuildId)
              docker tag $(containerRegistry)/k12-query-api:$(Build.BuildId) \
                         $(containerRegistry)/k12-query-api:latest
              docker push $(containerRegistry)/k12-query-api:latest
            displayName: 'Push Images to ACR'

          # ───────────────────────────────────────────────────────
          # Publish Manifest as Build Artifact
          # ───────────────────────────────────────────────────────
          - publish: $(Build.ArtifactStagingDirectory)/aspire-manifest.json
            artifact: 'aspire-manifest'
            displayName: 'Publish Manifest Artifact'

          # Publish Bicep/ARM templates (if using azd infra synth)
          - publish: $(Build.ArtifactStagingDirectory)/infra
            artifact: 'infrastructure'
            displayName: 'Publish Infrastructure Templates'

  # ═══════════════════════════════════════════════════════════════
  # Stage 2: Deploy to Development
  # ═══════════════════════════════════════════════════════════════
  - stage: DeployDev
    displayName: 'Deploy to Development'
    dependsOn: Build
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/development'))
    variables:
      environment: 'dev'
    jobs:
      - deployment: DeployToContainerApps
        environment: 'k12-analytics-dev'
        strategy:
          runOnce:
            deploy:
              steps:
                # Download artifacts
                - download: current
                  artifact: 'aspire-manifest'

                - download: current
                  artifact: 'infrastructure'

                # Deploy using Azure CLI
                - task: AzureCLI@2
                  inputs:
                    azureSubscription: 'K12-Azure-Subscription'
                    scriptType: 'bash'
                    scriptLocation: 'inlineScript'
                    inlineScript: |
                      # Update Container App with new image
                      az containerapp update \
                        --name k12-query-api \
                        --resource-group $(resourceGroup) \
                        --image $(containerRegistry)/k12-query-api:$(Build.BuildId) \
                        --set-env-vars "BUILD_ID=$(Build.BuildId)"
                  displayName: 'Deploy to Container Apps'

  # ═══════════════════════════════════════════════════════════════
  # Stage 3: Deploy to Production (Manual Approval)
  # ═══════════════════════════════════════════════════════════════
  - stage: DeployProd
    displayName: 'Deploy to Production'
    dependsOn: Build
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    variables:
      environment: 'prod'
    jobs:
      - deployment: DeployToProduction
        environment: 'k12-analytics-prod'  # Requires manual approval
        strategy:
          runOnce:
            deploy:
              steps:
                - download: current
                  artifact: 'aspire-manifest'

                - task: AzureCLI@2
                  inputs:
                    azureSubscription: 'K12-Azure-Subscription-Prod'
                    scriptType: 'bash'
                    scriptLocation: 'inlineScript'
                    inlineScript: |
                      az containerapp update \
                        --name k12-query-api \
                        --resource-group rg-k12-analytics-prod \
                        --image $(containerRegistry)/k12-query-api:$(Build.BuildId)
                  displayName: 'Deploy to Production'
```

### Container Registry Configuration

Images are stored in **Azure Container Registry (ACR)**:

| Image | Purpose | Registry Path |
|-------|---------|---------------|
| `k12-query-api` | Query API (.NET 10) | `k12acr.azurecr.io/k12-query-api` |
| `k12-cubejs` | Cube.js semantic layer | `k12acr.azurecr.io/k12-cubejs` |
| `k12-trino` | Trino query federation | `k12acr.azurecr.io/k12-trino` |

**ACR Setup:**
```bash
# Create ACR (one-time)
az acr create --name k12acr --resource-group rg-k12-shared --sku Standard

# Enable admin access for CI/CD
az acr update --name k12acr --admin-enabled true

# Get credentials for Azure Pipelines service connection
az acr credential show --name k12acr
```

---

## Deployment with azd (Quick Dev Deployments)

### What is Azure Developer CLI (azd)?

**azd** is a CLI tool that deploys Aspire applications to Azure with a **single command**.

**What `azd up` does:**
1. Reads AppHost Program.cs
2. Generates Bicep templates (Infrastructure-as-Code)
3. Provisions Azure resources (Container Apps, SQL, Redis, Storage)
4. Builds container images
5. Pushes images to Azure Container Registry
6. Deploys containers to Azure Container Apps
7. Configures networking, DNS, secrets

**Time:** 10-15 minutes (first deployment), 2-3 minutes (updates)

### Install azd

```bash
# Windows (winget)
winget install Microsoft.AzureDeveloperCLI

# macOS (Homebrew)
brew tap azure/azd && brew install azd

# Linux
curl -fsSL https://aka.ms/install-azd.sh | bash

# Verify installation
azd version
# Output: azd version 1.12.0 (commit abc123)
```

### Deploy to Azure

```bash
# Navigate to AppHost project
cd c:/Projects/CFI/K12/k12-api-enrollment/K12.AppHost

# Login to Azure
azd auth login

# Initialize azd (one-time setup)
azd init

# Output:
# ? Enter a new environment name: k12-dev
# ? Select an Azure Subscription: CFI Production Subscription
# ? Select an Azure location: East US

# Deploy to Azure
azd up

# Output:
# Packaging services (azd package)
# ├─ k12-functions: Building container image
# ├─ k12-dab: Building container image
# ├─ k12-trino: Building container image
# └─ k12-cubejs: Building container image
#
# Provisioning Azure resources (azd provision)
# ├─ Creating resource group: rg-k12-dev
# ├─ Creating Container Apps environment: k12-dev-env
# ├─ Creating Azure SQL Database: k12-dev-sql
# ├─ Creating Azure Cache for Redis: k12-dev-redis
# └─ Creating Application Insights: k12-dev-appinsights
#
# Deploying application (azd deploy)
# ├─ Pushing container images to ACR
# ├─ Deploying k12-functions to Container Apps
# ├─ Deploying k12-dab to Container Apps
# ├─ Deploying k12-trino to Container Apps
# └─ Deploying k12-cubejs to Container Apps
#
# SUCCESS: Your application is running at:
# - k12-functions: https://k12-functions.azurecontainerapps.io
# - k12-dab: https://k12-dab.azurecontainerapps.io
```

### Generated Bicep Files

**azd generates Bicep templates in `infra/` folder:**

```
K12.AppHost/infra/
├── main.bicep                    (Main orchestration)
├── resources.bicep               (All Azure resources)
├── containerApps.bicep           (Container Apps definitions)
├── appInsights.bicep             (Application Insights)
├── sqlServer.bicep               (Azure SQL)
└── redis.bicep                   (Azure Cache for Redis)
```

**You can customize these files** for production (firewall rules, private endpoints, etc.)

---

## Benefits Summary

### Developer Benefits

| Benefit | Before Aspire | After Aspire |
|---------|--------------|-------------|
| **Local Setup Time** | 2 hours (manual Docker Compose) | 5 minutes (F5) |
| **Service Discovery** | Hardcoded URLs | Automatic DNS resolution |
| **Connection Strings** | Manual configuration | Auto-injected |
| **Debugging** | Attach to 5 processes manually | Single F5 debugs all |
| **Hot Reload** | Restart all containers (10 min) | Auto-reload (3 sec) |
| **Observability** | Check 5 log files | Unified dashboard |

### DevOps Benefits

| Benefit | Before Aspire | After Aspire |
|---------|--------------|-------------|
| **Infrastructure Definition** | 500 lines of Terraform | 100 lines of C# (AppHost) |
| **Deployment** | Manual (30 min) | `azd up` (10 min) |
| **Environment Parity** | Dev ≠ Prod (config drift) | Dev = Prod (same AppHost) |
| **Resource Cleanup** | Manual (orphaned resources) | `azd down` (deletes all) |

---

## Related Decisions

- [ADR-PROP-002: .NET Aspire for Orchestration](../07-adr-proposed/ADR-PROP-002-aspire.md) - ADR for Aspire decision
- [CONT-01: Container Functions Architecture](../01-container-apps/CONT-01-container-functions-architecture.md) - Functions container
- [CONT-02: Environment Design](../01-container-apps/CONT-02-environment-design.md) - Multi-container environment
- [ASPIRE-02: Local Development Workflow](ASPIRE-02-local-development.md) - Day-to-day development

---

## References

### Microsoft Documentation

- [.NET Aspire Overview](https://learn.microsoft.com/en-us/dotnet/aspire/get-started/aspire-overview)
- [Build Your First Aspire App](https://learn.microsoft.com/en-us/dotnet/aspire/get-started/build-your-first-aspire-app)
- [Aspire Service Discovery](https://learn.microsoft.com/en-us/dotnet/aspire/service-discovery/overview)
- [Deploy Aspire to Azure Container Apps](https://learn.microsoft.com/en-us/dotnet/aspire/deployment/azure/aca-deployment)
- [Azure Developer CLI (azd)](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/overview)

### Tutorials

- [Aspire Dashboard Deep Dive](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/dashboard)
- [Service-to-Service Communication](https://learn.microsoft.com/en-us/dotnet/aspire/service-discovery/overview)
- [Debugging Aspire Apps](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/debugging)

### Community Resources

- [.NET Aspire Samples](https://github.com/dotnet/aspire-samples)
- [Aspire + Dapr Integration](https://github.com/dapr/dotnet-sdk/tree/master/examples/Aspire)
- [.NET Aspire YouTube Playlist](https://www.youtube.com/playlist?list=PLdo4fOcmZ0oULyHSPBx-tQzePOYlhvrAU)

---

**Document Status:** 📋 Week 1 Deliverable - Ready for Leadership Review
**Last Updated:** 2025-11-24
**Next Review:** After developer onboarding (Week 2)
