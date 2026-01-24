# K12 Architecture (Docs + Architecture Hub)

This repository is the **architecture and delivery hub** for the K12 platform. It contains:

- The architecture wiki under `wiki/`
- Pipeline guidance and deployment docs (Aspire -> Azure)
- A docs site under `k12-docs/`

> Important: most application source code may live in separate repos. Some wiki pages include cross-repo references.

## Start Here

### Docs navigation

- Wiki home: `wiki/README.md`
- How docs are organized: `DOCUMENTATION_GUIDE.md`
- Pipelines (index): `PIPELINE-INDEX.md`

### Target .NET structure (in progress)

- Project structure: `wiki/02-architecture/PROJECT-STRUCTURE.md`
- BFF / orchestrators: `wiki/02-architecture/BFF-ORCHESTRATORS.md`
- Shared contracts: `wiki/02-architecture/CONTRACTS.md`
- Repo org issues: `wiki/02-architecture/REPO-ORGANIZATION-ISSUES.md`
- Sensei PDF concerns checklist: `wiki/02-architecture/SENSEI-PDF-CONCERNS.md`

## What This Repo Is / Is Not

- **Is**: architecture documentation, pipelines, and reference implementation scaffolding.
- **Is not**: a guaranteed monorepo of all K12 application code (yet).

## Reference Links (curated)

### Architecture examples

- https://github.com/dotnet-architecture/eShopOnContainers
- https://github.com/kgrzybek/modular-monolith-with-ddd

### Aspire

- https://aspire.dev/testing/overview/
- https://github.com/dotnet/aspire-samples/tree/main/samples/aspire-with-azure-functions
- https://github.com/dotnet/aspire-samples/tree/main/samples/aspire-shop
- https://github.com/dotnet/aspire-samples/tree/main/samples/database-migrations
- https://github.com/CommunityToolkit/Aspire
- https://github.com/CommunityToolkit/Aspire/tree/main/examples

### CLI tooling

- https://github.com/spectreconsole/spectre.console

### UI framework

- https://github.com/unoplatform/uno

### SCIM / Identity reference

- https://github.com/ToolJet/ToolJet/blob/develop/docs/openapi/scim/index.openapi.yaml

### Document management notes

We currently use PandaDoc for document management/signing. The long-term goal is a document management abstraction.

- PandaDoc (embedded signing): https://developers.pandadoc.com/docs/embedded-signing
- iText: https://github.com/itext/itext-dotnet
- Documenso: https://github.com/documenso/documenso
- DocuSeal: https://github.com/docusealco/docuseal
- OpenSign: https://github.com/OpenSignLabs/OpenSign/tree/staging/apps/OpenSignServer

### Messaging

- https://github.com/BrighterCommand/Brighter
 