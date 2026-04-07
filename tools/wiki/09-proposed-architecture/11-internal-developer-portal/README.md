# Internal Developer Platform (IDP) Architecture

This section documents the design and usage of the customized **K12 Internal Developer Platform (IDP)**. Based on the decision outlined in [ADR-016](../../adr/ADR-016-custom-idp-aspire-integration.md), the K12 architecture moved away from a massive Backstage installation in favor of a lean, custom-built Nuxt application orchestrating specialized documentation tools.

## Architecture Overview

The IDP acts as the primary focal point during application development and acts as a central hub for deployed enterprise documentation in the cloud.

### 1. The IDP Shell (Nuxt 4 / Nitro)
Located at `tools/wiki/apps/portal`, the primary IDP shell is built with **Nuxt**. Instead of migrating all documentation into a monolithic frontend, the Nuxt app acts as a smart UI shell and **Reverse Proxy**:
- It uses Nitro server routes (`h3` middleware) to proxy requests seamlessly.
- Examples: 
  - `/_docs/**` reverse-proxies to a running **Astro 5** instance serving `tools/wiki/apps/docs`.
  - `/_api-reference/**` reverse-proxies to a **Scalar** node server reading OpenAPI schemas.
  - `/_storybook/**` proxies to our UI Component Catalog.

### 2. .NET Aspire Orchestration (Local Development)
The key driver for this architecture is a "run once, have everything" developer experience natively woven into the .NET ecosystem.
The IDP portal is treated as another managed resource inside the `src/K12.AppHost/Program.cs` orchestrator. 

```csharp
// Inside K12.AppHost/Program.cs
// Example Configuration

// 1. Stand up Astro Docs
var docsApp = builder.AddNpmApp("docs-app", "../../tools/wiki/apps/docs", "dev")
    .WithHttpEndpoint(port: 4321, targetPort: 4321);

// 2. Stand up IDP Portal (Nuxt)
var portalApp = builder.AddNpmApp("idp-portal", "../../tools/wiki/apps/portal", "dev")
    .WithReference(docsApp) // Injects the URL for docs App into Nuxt
    .WithHttpEndpoint(port: 3000, targetPort: 3000);
```

When a developer runs `dotnet watch run` from the AppHost, Aspire spins up Dapr components, the SQL databases, Redis, K12 APIs, alongside the IDP portal accessible instantly at `localhost:3000`.

### 3. Docker Compose (Fallback Dev Environment)
For teams modifying primarily frontend elements without requiring the full .NET SDK, `docker-compose.yml` acts as the lightweight backup. The containers run the same commands pre-packaged in Node matching the proxy layout.

### 4. Cloud Native Deployment (Azure Container Apps - ACA)
In staging and production integration environments, the IDP is bundled along with its documentation microservices. 

- **Hosting Form Factor:** Packaged as standard OCI Linux Containers.
- **PaaS Target:** Deployed to **Azure Container Apps (ACA)**. 
- **Networking:** The Nuxt shell is the primary ingestion point on an ACA exposed ingress. VNet configurations restrict access such that internal proxy services (Astro Docs, Scalar) cannot be reached via the public internet directly, forcing traffic securely through the Nuxt shell.
- **Identity:** Entra ID Authentication is enforced at the Azure Container App environment boundary (Easy Auth) or handled via middleware in the Nuxt application, preventing unauthorized corporate access to architecture schematics.

## Content Management (CAF & WAF)
Documents authored locally adhering to the **Microsoft Cloud Adoption Framework (CAF)** and **Well-Architected Framework (WAF)** are authored in pure Markdown within `tools/wiki/`. Dedicated scripts synthesize these Markdown files, generate AST components, and pass them into the `docs` Astro site rendering layer.

## References
- **Configuration Design:** `docs/plans/2026-02-18-caf-waf-idp-integration-design.md`
- **Component App Details:** `tools/wiki/apps/IDP-PLAN.md`
