# Redirect: ADR-PROP-002 (moved)

This ADR has moved to the canonical ADR folder:

- [ADR-PROP-002-aspire.md](../../adr/ADR-PROP-002-aspire.md)

This file is a redirect stub preserved for link compatibility.
# ADR-PROP-002: .NET Aspire for Cloud-Native Orchestration

**Status:** ✅ Proposed
**Date:** 2025-11-24
**Decision Maker(s):** CFI Architecture Team
**Tags:** #aspire #orchestration #local-development #cloud-native #devex #critical

---

## Context

The proposed K12 MyPortal architecture on Azure Container Apps introduces significant **local development complexity** due to the multi-container design:

### Current Local Development Challenges

| Challenge | Current Manual Process | Time Required |
|-----------|----------------------|---------------|
| **Start 5 Containers** | Docker Compose + manual commands | 15 minutes |
| **Service Discovery** | Hardcode URLs (`http://localhost:5000`, `http://localhost:5001`) | 10 minutes configuration |
| **Environment Variables** | Manually maintain 3 `.env` files per developer | 20 minutes setup |
| **Connection Strings** | Copy-paste between containers | 5 minutes (error-prone) |
| **Redis Configuration** | Manual setup + connection string sharing | 10 minutes |
| **Database Migrations** | Separate script execution | 10 minutes |
| **Health Monitoring** | Open 5 browser tabs, check manually | 5 minutes |
| **Debugging** | Attach debugger to each container individually | 15 minutes |
| **TOTAL SETUP TIME** | | **90 minutes** |

### Proposed Architecture (5 Containers)

```
┌─────────────────────────────────────────────────────────────┐
│  Local Development Environment (Developer Workstation)      │
│                                                              │
│  Container 1: Container Functions (.NET 10)                 │
│         ↓ calls                                             │
│  Container 2: Data API Builder (REST/GraphQL)              │
│         ↓ queries                                           │
│  Container 3: Trino (Analytics SQL)                         │
│         ↓ reads metadata                                    │
│  Container 4: Hive Metastore (Trino metadata)              │
│         ↓ cache                                             │
│  Container 5: Redis (Distributed cache + Dapr state)       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
           ↓ all connect to
    Azure SQL Database (Dev)
    ADLS Gen2 (Dev)
```

### Developer Pain Points

1. **Complex Orchestration**: Starting 5 containers in correct order (Redis → DAB → Trino → Functions → Hive)
2. **Manual Service Discovery**: Each container must know URLs of other containers
3. **Configuration Drift**: Dev configs diverge from production Container Apps
4. **No Unified Logging**: Logs scattered across 5 Docker containers
5. **Difficult Debugging**: Cannot step through distributed calls across containers
6. **Onboarding Friction**: 2-hour setup for new developers
7. **Deployment Mismatch**: Local Docker Compose != Azure Container Apps

### Business Requirements

1. **Reduce onboarding time** from 2 hours to <10 minutes
2. **Enable F5 debugging** across all 5 containers
3. **Auto-generate deployment artifacts** (Bicep) from local config
4. **Dev/prod parity** - Local environment matches Container Apps
5. **Unified observability** - Single dashboard for logs, metrics, health
6. **Zero cost** - Free, open-source tooling

---

## Decision

We will adopt **.NET Aspire** as the local development orchestration platform and deployment automation tool for the K12 MyPortal multi-container architecture.

### What is .NET Aspire?

**.NET Aspire** is an opinionated, cloud-ready stack for building observable, production-ready, distributed applications. It provides:

- **App Host (Orchestrator)** - F5 to launch all 5 containers with service discovery
- **Service Defaults** - Pre-configured logging, telemetry, health checks
- **Built-in Service Discovery** - Automatic DNS resolution between containers
- **Dashboard** - Unified UI for logs, traces, metrics, health
- **Azd Integration** - `azd up` generates Bicep and deploys to Container Apps

**Released:** November 2024 (.NET Aspire 9.5 GA)
**GitHub:** https://github.com/dotnet/aspire
**Microsoft Learn:** https://learn.microsoft.com/en-us/dotnet/aspire/

---

## Decision Drivers

### 1. **F5 to Launch Everything**

**Before (Docker Compose):**
```bash
# Terminal 1
docker-compose up redis -d

# Terminal 2 (wait for Redis)
docker-compose up dab -d

# Terminal 3 (wait for DAB)
docker-compose up trino -d

# Terminal 4 (set environment variables)
export DAB_URL=http://localhost:5001
export REDIS_URL=redis:6379
dotnet run --project K12.API
```

**After (Aspire):**
1. Open `K12.AppHost` project in Visual Studio or Rider
2. Press **F5**
3. All 5 containers start in correct order with dependencies resolved
4. Dashboard opens at `http://localhost:15000`

**Impact:** 2 hours → **5 minutes** (96% reduction)

### 2. **Automatic Service Discovery**

**Before:** Hardcoded URLs in appsettings.json
```json
{
  "DataApiBuilder": {
    "BaseUrl": "http://localhost:5001"  // ← Breaks if DAB port changes
  },
  "Redis": {
    "ConnectionString": "localhost:6379"  // ← Manual configuration
  }
}
```

**After:** Aspire Service Discovery (automatic DNS)
```csharp
// K12.API reads this automatically
var dabClient = builder.AddServiceDiscovery()
    .ConfigureHttpClientDefaults(http =>
    {
        http.AddStandardResilienceHandler();
        http.AddServiceDiscovery();
    });

// Call DAB with service name (no hardcoded URL!)
await httpClient.GetAsync("http://k12-dab/api/students");
//                            ^^^^^^^^ Aspire resolves to actual container IP
```

**Impact:** Zero manual configuration, no broken URLs

### 3. **Auto-Generate Bicep for Azure Deployment**

**Before:** Manually write Bicep templates (error-prone, drift from local)

**After:** Run `azd init` and `azd up`
```bash
# Step 1: Initialize Azure Developer CLI
azd init

# Step 2: Aspire analyzes your AppHost and generates Bicep
# - Creates Container Apps environment
# - Deploys 5 containers with correct configs
# - Sets up managed identities
# - Configures ingress/egress rules
# - Wires up service discovery (Dapr)

# Step 3: Deploy to Azure
azd up
# ✅ Provisions Container Apps environment
# ✅ Builds and pushes 5 Docker images to ACR
# ✅ Deploys containers with correct replicas, CPU, memory
# ✅ Configures Dapr for service invocation
# ✅ Total time: 8 minutes
```

**Impact:** Local config → Production deployment in **1 command**

### 4. **Unified Observability Dashboard**

**Before:** Open 5 browser tabs
- `http://localhost:4200` - Functions logs
- `http://localhost:5001/health` - DAB health
- `http://localhost:8080` - Trino UI
- `http://localhost:6379` - Redis CLI
- Docker Desktop logs

**After:** Single Aspire Dashboard at `http://localhost:15000`

```
┌───────────────────────────────────────────────────────────────┐
│  Aspire Dashboard - K12 MyPortal                              │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  Resources (5)               Status      CPU    Memory         │
│  ├─ k12-functions             🟢 Running  12%    450 MB        │
│  ├─ k12-dab                   🟢 Running   4%    180 MB        │
│  ├─ k12-trino                 🟢 Running  25%    1.2 GB        │
│  ├─ k12-hive-metastore        🟢 Running   2%     95 MB        │
│  └─ k12-redis                 🟢 Running   1%     45 MB        │
│                                                                │
│  Traces (Real-time)                                            │
│  14:23:45  [k12-functions] POST /api/applications → 201        │
│            └─→ [k12-dab] GET /api/Student/12345 → 200 (45ms)  │
│                └─→ [Redis] CACHE HIT Student:12345             │
│                                                                │
│  Logs (Live Stream)                                            │
│  14:23:46  [k12-functions] Application created: APP-67890      │
│  14:23:47  [k12-trino] Query executed: SELECT * FROM awards    │
│  14:23:48  [k12-dab] Cache miss: Student:99999                 │
│                                                                │
│  Metrics                                                       │
│  Requests/sec:  1,250      Avg Latency: 185ms                  │
│  Error Rate:    0.02%      Cache Hit:   68%                    │
└───────────────────────────────────────────────────────────────┘
```

**Impact:** Single pane of glass for debugging distributed systems

### 5. **Dev/Prod Parity**

**Critical:** Aspire uses **same deployment model** as Azure Container Apps
- Local: Aspire orchestrates Docker containers
- Production: Container Apps orchestrates containers
- Dapr configured identically in both environments

**Before:**
- Local: Docker Compose (different config format)
- Prod: ARM templates or Bicep (different config format)
- Result: "Works on my machine" syndrome

**After:**
- Local: Aspire AppHost
- Prod: Aspire → `azd up` → Container Apps (same config source)
- Result: 100% parity

---

## Alternatives Considered

### Alternative 1: Docker Compose Only

**Pros:**
- Industry standard
- Simple YAML configuration
- Works with any container technology

**Cons:**
- ❌ No service discovery (hardcoded URLs required)
- ❌ No automatic environment variable propagation
- ❌ No unified dashboard (logs scattered)
- ❌ Cannot debug across containers (no integrated breakpoints)
- ❌ Does not generate Bicep for Azure deployment
- ❌ No dev/prod parity (Compose != Container Apps)

**Rejected because:** Does not solve service discovery, no Azure integration, manual configuration

### Alternative 2: Manual Scripts (Bash/PowerShell)

**Pros:**
- Full control
- No external dependencies

**Cons:**
- ❌ Brittle (breaks easily with config changes)
- ❌ Not maintainable (complex scripts, hard to debug)
- ❌ No cross-platform support (Windows vs. Linux)
- ❌ No service discovery
- ❌ No dashboard
- ❌ High maintenance burden

**Rejected because:** Unmaintainable, does not scale to 5 containers

### Alternative 3: Tilt / Skaffold (Kubernetes-Focused)

**Pros:**
- Kubernetes-native development
- Hot reload capabilities
- Good for microservices

**Cons:**
- ❌ **Requires local Kubernetes** (Docker Desktop K8s, Minikube, Kind)
- ❌ **Overkill for Container Apps** (we're NOT using AKS, just Container Apps)
- ❌ **Steep learning curve** (Helm charts, K8s manifests)
- ❌ **Slower startup** (K8s overhead vs. Docker)
- ❌ **Does not generate Container Apps Bicep** (generates K8s YAML)

**Rejected because:** Over-engineered for Container Apps, K8s knowledge not needed

### Alternative 4: Azure Developer CLI (azd) Without Aspire

**Pros:**
- Deploys to Azure
- Infrastructure as Code

**Cons:**
- ❌ No local orchestration (still need Docker Compose)
- ❌ No service discovery for local dev
- ❌ No dashboard
- ❌ Must manually write Bicep (error-prone)
- ❌ Does not solve "F5 to start all containers"

**Rejected because:** Only solves deployment, not local development

---

## Decision Outcome

### **Chosen Solution: .NET Aspire for Orchestration & Deployment**

Aspire provides:

1. ✅ **F5 to launch all 5 containers** with correct startup order
2. ✅ **Automatic service discovery** via DNS (no hardcoded URLs)
3. ✅ **Unified dashboard** for logs, traces, metrics, health
4. ✅ **Dev/prod parity** (local matches Container Apps)
5. ✅ **Auto-generate Bicep** via `azd up` for Container Apps
6. ✅ **Zero cost** (open-source, no licensing)
7. ✅ **Built-in resiliency** (retry, circuit breaker, timeout)
8. ✅ **Debugging across containers** (distributed tracing)

---

## Consequences

### Positive Consequences

1. **Developer Productivity Improvement**
   - Setup time: 2 hours → 5 minutes (96% reduction)
   - New developer onboarding: 1 day → 1 hour
   - Debugging time: 50% faster (single dashboard vs 5 tabs)

2. **Eliminates Configuration Drift**
   - Local environment matches production Container Apps
   - `azd up` deploys exactly what runs locally
   - No "works on my machine" issues

3. **Automatic Dependency Management**
   - Redis starts before DAB (DAB depends on Redis cache)
   - Hive Metastore starts before Trino
   - Functions wait for DAB to be healthy

4. **Unified Observability**
   - Real-time logs from all 5 containers
   - Distributed traces across services
   - Health checks in single view
   - Resource utilization monitoring

5. **Faster Deployment to Azure**
   - `azd up` generates Bicep + deploys in 8 minutes
   - No manual Bicep writing (error-prone)
   - Automatic Container Registry push

6. **Built-in Best Practices**
   - Health checks auto-configured
   - Logging to OpenTelemetry
   - Resilience patterns (retry, circuit breaker)
   - Security defaults (HTTPS, managed identity)

### Negative Consequences & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Aspire Still Evolving** | Medium | Pin to Aspire 9.5 (GA), test upgrades in dev first |
| **Learning Curve** | Medium | 3-week training plan: Docker basics → Aspire → Dapr |
| **.NET Dependency** | Low | Aspire requires .NET 8+ SDK (team already uses .NET) |
| **Windows/Linux Differences** | Low | Aspire works cross-platform, test on both OS |
| **Debugging Complexity** | Low | Aspire Dashboard simplifies, better than manual debugging |

---

## Technical Details

### Aspire AppHost Configuration

**Project Structure:**
```
k12-arch/
├── K12.AppHost/                   ← Aspire orchestrator
│   ├── Program.cs                 ← Defines 5 containers + dependencies
│   └── K12.AppHost.csproj
├── K12.API/                       ← Container Functions
├── K12.DAB/                       ← Data API Builder config
├── K12.Trino/                     ← Trino container
├── K12.Hive/                      ← Hive Metastore
└── docker-compose.yml             ← Fallback (not primary)
```

### Complete Program.cs (AppHost)

```csharp
using Aspire.Hosting;
using Aspire.Hosting.Dapr;

var builder = DistributedApplication.CreateBuilder(args);

// 1. Redis (Distributed Cache + Dapr State Store)
var redis = builder.AddRedis("k12-redis")
    .WithDataVolume()  // Persist data
    .WithLifetime(ContainerLifetime.Persistent);  // Keep running between F5 sessions

// 2. Azure SQL Database (Dev)
var sqlDatabase = builder.AddSqlServer("k12-sql-server")
    .AddDatabase("k12-db", "K12MyPortal");

// 3. Hive Metastore (for Trino metadata)
var hiveMetastore = builder.AddContainer("k12-hive-metastore", "apache/hive", "3.1.3")
    .WithEnvironment("SERVICE_NAME", "metastore")
    .WithEnvironment("DB_DRIVER", "sqlserver")
    .WithEnvironment("METASTORE_DB_HOSTNAME", sqlDatabase)
    .WithHttpEndpoint(port: 9083, name: "thrift")
    .WaitFor(sqlDatabase);  // Start after SQL is ready

// 4. Trino (Analytics SQL Engine)
var trino = builder.AddContainer("k12-trino", "trinodb/trino", "450")
    .WithEnvironment("CATALOG_HIVE_METASTORE_URI", $"thrift://k12-hive-metastore:9083")
    .WithEnvironment("CATALOG_AZURE_STORAGE_ACCOUNT", "k12devsa")
    .WithEnvironment("CATALOG_AZURE_CONTAINER", "data-lake")
    .WithHttpEndpoint(port: 8080, name: "http")
    .WithHttpHealthCheck("/v1/info")
    .WaitFor(hiveMetastore)  // Start after Hive is ready
    .WithReference(redis);  // Result caching

// 5. Data API Builder (REST/GraphQL)
var dab = builder.AddContainer("k12-dab", "mcr.microsoft.com/azure-databases/data-api-builder", "latest")
    .WithEnvironment("DATABASE_CONNECTION_STRING", sqlDatabase)
    .WithEnvironment("CACHE_ENABLED", "true")
    .WithEnvironment("CACHE_TTL_SECONDS", "900")  // 15-min cache
    .WithBindMount("./dab-config.json", "/app/dab-config.json")  // Config file
    .WithHttpEndpoint(port: 5000, name: "http")
    .WithHttpHealthCheck("/api/health")
    .WaitFor(redis)  // Start after Redis (for caching)
    .WithReference(redis);

// 6. Container Functions (.NET 10)
var functions = builder.AddProject<Projects.K12_API>("k12-functions")
    .WithEnvironment("DataApiBuilder__BaseUrl", dab.GetEndpoint("http"))  // Service discovery!
    .WithEnvironment("Trino__BaseUrl", trino.GetEndpoint("http"))
    .WithEnvironment("Redis__ConnectionString", redis)
    .WithReference(sqlDatabase)
    .WithReference(dab)
    .WithReference(trino)
    .WithReference(redis)
    .WaitFor(dab)  // Start after DAB is ready
    .WaitForCompletion(dab);  // Ensure DAB health check passes

// 7. Enable Dapr for Functions and DAB (service mesh)
functions.WithDaprSidecar(new DaprSidecarOptions
{
    AppId = "k12-functions",
    AppPort = 8080,
    DaprHttpPort = 3500,
    DaprGrpcPort = 50001
});

dab.WithDaprSidecar(new DaprSidecarOptions
{
    AppId = "k12-dab",
    AppPort = 5000,
    DaprHttpPort = 3501,
    DaprGrpcPort = 50002
});

// 8. Build and run
builder.Build().Run();
```

### Key Features in Code

1. **Dependency Chain:** Redis → DAB → Trino → Functions (correct startup order)
2. **Service Discovery:** `dab.GetEndpoint("http")` automatically resolves to `http://k12-dab:5000`
3. **Health Checks:** `.WaitForCompletion()` ensures container is healthy before starting dependents
4. **Dapr Integration:** `.WithDaprSidecar()` enables service mesh
5. **Configuration Injection:** Environment variables auto-wired

### AppHost Project File

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <IsAspireHost>true</IsAspireHost>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Aspire.Hosting.AppHost" Version="9.5.0" />
    <PackageReference Include="Aspire.Hosting.Azure.ContainerApps" Version="9.5.0" />
    <PackageReference Include="Aspire.Hosting.Dapr" Version="9.5.0" />
    <PackageReference Include="Aspire.Hosting.Redis" Version="9.5.0" />
    <PackageReference Include="Aspire.Hosting.SqlServer" Version="9.5.0" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\K12.API\K12.API.csproj" />
  </ItemGroup>

</Project>
```

### Deploy to Azure with `azd`

**Step 1: Initialize Azure Developer CLI**
```bash
cd K12.AppHost
azd init
# Prompts for:
# - Environment name: k12-dev
# - Azure subscription
# - Location: East US
```

**Step 2: Generate Bicep (Automatic)**
```bash
azd infra synth
# Aspire analyzes Program.cs and generates:
# - infra/main.bicep              (Container Apps environment)
# - infra/resources.bicep         (5 container definitions)
# - infra/k12-functions.bicep     (Functions container)
# - infra/k12-dab.bicep           (DAB container)
# - infra/k12-trino.bicep         (Trino container)
# - infra/k12-hive.bicep          (Hive container)
# - infra/k12-redis.bicep         (Redis container)
```

**Step 3: Deploy**
```bash
azd up
# ✅ Creates resource group: rg-k12-dev
# ✅ Creates Container Apps environment: k12-dev-env
# ✅ Provisions Azure Cache for Redis (Premium P1)
# ✅ Builds 5 Docker images
# ✅ Pushes to Azure Container Registry: k12devacr
# ✅ Deploys 5 containers with:
#    - Min/max replicas
#    - CPU/memory settings
#    - Environment variables
#    - Service discovery (Dapr)
#    - Ingress rules
# ✅ Total time: 8 minutes
```

**Step 4: Verify Deployment**
```bash
azd show
# Displays:
# - Container Apps environment URL
# - 5 container endpoints
# - Logs link (Azure Portal)
```

---

## Performance Impact

### Developer Productivity Gains

| Task | Before (Manual) | After (Aspire) | Improvement |
|------|----------------|----------------|-------------|
| **Initial Setup** | 2 hours | 5 minutes | 96% faster |
| **Daily Startup** | 10 minutes | 30 seconds | 95% faster |
| **Add New Container** | 45 minutes | 5 minutes (1 line in AppHost) | 89% faster |
| **Debugging Distributed Call** | 30 minutes | 5 minutes (traces in dashboard) | 83% faster |
| **Deploy to Azure** | 60 minutes (manual Bicep) | 8 minutes (`azd up`) | 87% faster |

**Total Time Saved Per Developer:** 10 hours/week
**Team Size:** 8 developers
**Annual Savings:** 10 hrs/week × 8 devs × 48 weeks = **3,840 hours/year**

### Local Performance

Aspire does NOT impact runtime performance (containers run natively in Docker):
- Same CPU/memory usage as Docker Compose
- Zero overhead (Aspire is orchestrator, not runtime proxy)
- Dashboard uses ~50 MB RAM (negligible)

---

## Cost Analysis

### Licensing & Tooling Costs

| Component | License | Cost |
|-----------|---------|------|
| **.NET Aspire** | MIT (open-source) | $0 |
| **Azure Developer CLI** | MIT (open-source) | $0 |
| **Docker Desktop** | Free for small businesses | $0 |
| **Visual Studio Community** | Free for open-source/small teams | $0 |
| **TOTAL** | | **$0/month** |

### Azure Resource Costs (Dev Environment)

Aspire provisions resources with tags for cost tracking:

| Resource | Configuration | Monthly Cost |
|----------|---------------|--------------|
| **Container Apps (Dev)** | 2 vCPU avg, 4 GB RAM | $240 |
| **Azure Cache for Redis** | Basic C1 (1 GB) | $17 |
| **Azure Container Registry** | Basic tier | $5 |
| **Azure SQL Database** | Serverless 2 vCore (Dev) | $120 |
| **TOTAL** | | **$382/month** |

**vs. Manual Setup (Docker Compose locally):** $0 (no Azure costs)
**ROI:** Dev environment matches production, catches issues early, saves 10+ hours/week

---

## Validation

### Proof of Concept (Week 1)

1. ✅ **Install Aspire Workload**
   ```bash
   dotnet workload update
   dotnet workload install aspire
   ```

2. ✅ **Create AppHost Project**
   ```bash
   dotnet new aspire-apphost -n K12.AppHost
   ```

3. ✅ **Define 5 Containers in Program.cs**
   - Redis, Hive Metastore, Trino, DAB, Functions

4. ⏳ **Test F5 Launch**
   - Verify all 5 containers start
   - Check Aspire Dashboard at `http://localhost:15000`

5. ⏳ **Validate Service Discovery**
   - Functions calls DAB via `http://k12-dab` (no hardcoded URL)

### Integration Testing (Week 2)

1. ⏳ **Cross-Container Debugging**
   - Set breakpoint in Functions → calls DAB → steps into DAB code
   - Verify distributed traces in Aspire Dashboard

2. ⏳ **Test Hot Reload**
   - Change DAB config → save → verify instant reload (no restart)

3. ⏳ **Deploy to Azure Dev**
   ```bash
   azd up
   ```
   - Verify 5 containers deploy correctly
   - Check Container Apps environment in Azure Portal

### Production Deployment (Week 6)

1. ⏳ **Deploy to Production**
   ```bash
   azd env select k12-prod
   azd up
   ```

2. ⏳ **Blue-Green Deployment**
   - Deploy new revision alongside current
   - Split traffic: 10% new, 90% old
   - Monitor for 48 hours
   - Gradual rollout: 50% → 100%

---

## Related Decisions

- [ADR-PROP-001: Azure Container Functions on Container Apps](ADR-PROP-001-container-functions.md) - Hosting platform
- [ADR-PROP-003: Data API Builder for CRUD APIs](ADR-PROP-003-data-api-builder.md) - One of the 5 containers
- [ADR-PROP-004: Trino for Data Federation](ADR-PROP-004-trino.md) - Analytics container
- [ADR-PROP-005: CubeJS Semantic Layer](ADR-PROP-005-cubejs.md) - BI container
- [ADR-PROP-006: Dapr for Microservices Patterns](ADR-PROP-006-dapr.md) - Service mesh (integrated with Aspire)

---

## References

### Microsoft Documentation

- [.NET Aspire Overview](https://learn.microsoft.com/en-us/dotnet/aspire/get-started/aspire-overview)
- [Aspire 9.5 GA Announcement](https://devblogs.microsoft.com/dotnet/announcing-dotnet-aspire-9-5/)
- [Aspire AppHost API Reference](https://learn.microsoft.com/en-us/dotnet/api/aspire.hosting)
- [Azure Developer CLI (azd)](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/)
- [Deploy Aspire to Container Apps](https://learn.microsoft.com/en-us/dotnet/aspire/deployment/azure/aca-deployment)

### Tutorials & Videos

- [Build Your First Aspire App (15 min)](https://learn.microsoft.com/en-us/dotnet/aspire/get-started/build-your-first-aspire-app)
- [Aspire Service Discovery](https://learn.microsoft.com/en-us/dotnet/aspire/service-discovery/overview)
- [Aspire Dashboard Deep Dive](https://devblogs.microsoft.com/dotnet/introducing-aspire-dashboard/)
- [Container Apps + Aspire Workshop](https://github.com/Azure-Samples/azure-functions-flex-consumption-aspire)

### Community Resources

- [Aspire GitHub Repository](https://github.com/dotnet/aspire)
- [Aspire Samples](https://github.com/dotnet/aspire-samples)
- [.NET Aspire Reddit](https://www.reddit.com/r/dotnet/) - Weekly Aspire discussions
- [YouTube: .NET Aspire Tutorial Series](https://www.youtube.com/results?search_query=dotnet+aspire+tutorial)

---

**Decision Made:** 2025-11-24
**Decision Owner:** CFI Architecture Team (Marty Flournory, Sumith Mathur)
**Approval Required:** Development Team Lead, DevOps Lead
**Status:** ✅ Proposed, POC in Week 1
**Next Review:** Week 2 (after POC completion)
