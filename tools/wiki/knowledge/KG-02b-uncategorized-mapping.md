# KG-02b — Uncategorized Wiki Mapping (v1)

This file maps the 48 previously uncategorized `tools/wiki/**/*.md` files into KG categories so ingestion can proceed deterministically.

## Mapping Rules Applied
- `Guides`: onboarding, project overview, development/testing guidance, navigation docs.
- `Knowledge`: standards, glossary, schema/reference content.
- `Ops`: deployment/pipeline/health-report operational artifacts.
- `ADR`: archived/proposed ADR artifacts.

## File Mapping

### Guides
- `.codex/AGENTS.md`
- `.gemini/GEMINI.md`
- `01-project-overview/_all.md`
- `01-project-overview/external-repositories.md`
- `01-project-overview/README.md`
- `01-project-overview/roadmap/README.md`
- `01-project-overview/roadmap/ROADMAP-01-current-sprint-features.md`
- `01-project-overview/roadmap/ROADMAP-02-feature-roadmap.md`
- `03-business-rules/RULES-01-nrules-implementation-guide.md`
- `05-development/README.md`
- `05-development/frontend/README.md`
- `05-development/frontend/FE-01-nx-monorepo-architecture-guide.md`
- `05-development/frontend/FE-02-shared-library-documentation.md`
- `05-development/frontend/FE-03-component-architecture-patterns.md`
- `05-development/frontend/FE-04-state-management-strategy.md`
- `05-development/frontend/FE-05-routing-strategy.md`
- `05-testing/LOAD-TEST.md`
- `README.md`
- `TABLE_OF_CONTENTS.md`
- `index.md`
- `apps/docs/README.md`
- `apps/docs/src/content/docs/guides/example.md`
- `apps/docs/src/content/docs/reference/example.md`
- `apps/portal/README.md`
- `markdown-examples.md`
- `api-examples.md`
- `apps/IDP-PLAN.md`

### Knowledge
- `04-standards/README.md`
- `04-standards/STD-01-frontend-coding-standards.md`
- `04-standards/STD-02-backend-coding-standards.md`
- `04-standards/STD-03-code-review-guidelines.md`
- `04-standards/STD-04-git-workflow.md`
- `GLOSSARY.md`
- `Database-Schema-Documentation.md`
- `_full.ai.ignore.md`
- `CLAUDE.md`
- `cline_rules.md`

### Ops
- `07-deployment/README.md`
- `07-deployment/DEPLOY-01-environment-topology.md`
- `07-deployment/DEPLOY-02-network-architecture.md`
- `07-deployment/DEPLOY-03-cicd-pipeline-architecture.md`
- `07-deployment/DEPLOY-04-infrastructure-monitoring.md`
- `PIPELINE-ARCHITECTURE.md`
- `PIPELINE-SUMMARY.md`
- `DOCUMENTATION-HEALTH-REPORT.md`
- `DOCUMENTATION-INCOMPLETENESS-SCAN.md`
- `BROKEN-LINK-FIX-PLAN.md`

### ADR
- `adr_archive/ADR-PROP-001-container-functions.md`

## Summary Counts (from this mapping)
- Guides: 27
- Knowledge: 10
- Ops: 10
- ADR: 1

Total mapped: 48

## Notes
- During KG-03, this mapping should be merged with path-based category rules from `KG-02-knowledge-graph-schema.md`.
- If any file has dual-use semantics, preserve primary category and add secondary tags in ingestion metadata.
