# ADR-016: Custom Internal Developer Platform (IDP) using Nuxt and Aspire Orchestration

**Status:** Accepted
**Date:** 2026-03-15
**Deciders:** Architecture Team
**Technical Story:** IDP Modernization and Developer Experience

## Context and Problem Statement

As the K12 ecosystem grows in complexity—encompassing .NET minimal APIs, Dapr sidecars, an Nx-based Angular frontend monorepo, and comprehensive architecture documents aligning with Microsoft CAF and WAF—developers need a central portal to navigate these resources. 

Initially, a **Backstage** instance was scaffolded (`src/cfi-k12/k12-idp/`) to serve as our Internal Developer Platform (IDP). However, Backstage introduces significant friction:
1. **Maintenance Overhead:** It requires maintaining complex React/Node.js structures, custom plugins, and heavy backend entities.
2. **Ecosystem Mismatch:** Our primary backend orchestration leverages **.NET Aspire** and Azure Container Apps (ACA). Backstage’s heavyweight nature felt disproportionate for our needs.
3. **Dispersed Tools:** We already have mature, specialized docs tools (e.g., Astro for Markdown, Scalar for OpenAPI specs, Storybook for component catalogs) that we prefer not to rebuild as Backstage plugins.

We need an IDP that integrates cleanly into our **.NET Aspire** local environment, respects our cloud-native Azure endpoints (ACA), and supports fallback to simple `docker-compose` workflows.

## Decision Drivers

* **Time to Value:** Rapidly assembling a unified developer portal without steep framework learning curves.
* **Developer Experience (DX):** Portal should spin up automatically alongside standard API services when a developer runs the Aspire `AppHost`.
* **Modularity:** Let "best-in-class" tools (Astro, Scalar, Storybook) do their jobs while the IDP acts as an aggregator/proxy.
* **Deployment Synergy:** The IDP must deploy smoothly via our existing Azure Bicep/Terraform pipelines to Azure Container Apps or Azure Static Web Apps.

## Considered Options

* **Option 1: Continue with Backstage IDP.** Utilize the existing scaffold and invest engineering hours in writing custom Backstage plugins for .NET Aspire metrics, telemetry, and external site proxies.
* **Option 2: Microsoft Dev Box / Azure Deployment Environments.** Rely strictly on Azure-hosted portal catalogs, abandoning local portal deployments.
* **Option 3: Custom IDP Shell with Nuxt, integrated into Aspire.** Treat the portal as a standard Node project (Nuxt + Nitro proxy) that Aspire spins up. Proxy traffic to standalone services (Astro Docs, Scalar APIs).

## Decision Outcome

**Chosen option: "Option 3: Custom IDP Shell with Nuxt, integrated into Aspire"**, because it drastically simplifies maintenance while providing a seamlessly orchestrated local environment. 

### Implementation Details:
1. **Shell and Framework:** The custom portal uses **Nuxt 4 / Vue 3**. It offers a polished UI that proxies other dedicated tools through Nitro server routes (e.g., `/_docs/` → Astro docs, `/_api-reference/` → Scalar UI).
2. **Aspire Orchestration:** The `K12.AppHost/Program.cs` file is modified to declare the IDP and its proxied components (using `.AddNpmApp()` or Container images). Running `dotnet watch run` brings up the local environment, telemetry dashboard, database scaffolding, Dapr, and the IDP itself.
3. **Docker Compose fallback:** A lightweight `docker-compose-idp.yml` offers an alternative path for non-.NET devs who only need the portal and mock APIs.
4. **Cloud-Native Deployment:** Deployed primarily as Docker containers to **Azure Container Apps** alongside the microservices ecosystem. It pulls identity and RBAC controls via Entra ID natively via Azure.

### Consequences

#### Good
- Integrates out-of-the-box with `.NET Aspire`, offering developers a "one-click" setup.
- Enables dropping in existing, functional Astro documentation and Storybook libraries without adapting them to Backstage's plugin system.
- Radically smaller footprint; easily containerized for ACA.

#### Bad
- We lose Backstage's deep out-of-the-box Software Catalog graphing natively (must build a custom `components` view or rely on Aspire Dashboard for live resource tracking).
- The team has to maintain the Nitro proxy logic explicitly, handling edge cases such as trailing slashes and upstream errors.

#### Neutral
- Discarding the existing Backstage scaffold.

## References
- [Cloud Adoption Framework (CAF) Integration Designs](../docs/plans/2026-02-18-caf-waf-idp-integration-design.md)
- [.NET Aspire AppHost Integration Guidelines](../09-proposed-architecture/02-aspire/ASPIRE-01-apphost-setup.md)
