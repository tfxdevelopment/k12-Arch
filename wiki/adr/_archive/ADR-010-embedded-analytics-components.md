# Redirect: ADR-010 (archived)

This ADR is now maintained in the canonical ADR folder:

- [ADR-010-embedded-analytics-components.md](../ADR-010-embedded-analytics-components.md)

This file is a redirect stub preserved for link compatibility.
# ADR-010: Embedded Analytics Component Strategy

> **ARCHIVED** - This ADR has been superseded. See [ADR-014: Metabase as Unified Analytics Platform](../ADR-014-metabase-analytics.md) for the current approach.

**Status:** Superseded
**Superseded By:** ADR-014
**Archived:** 2025-12-22
**Original Date:** 2025-12-08
**Deciders:** CFI Architecture Team, K12 Dev Team

---

## Summary

This ADR proposed building custom Angular components using Cube.js APIs (`@cubejs-client/ngx`) for embedded analytics in the K12 Admin Portal, with an optional evolution path to a PostgreSQL-enhanced architecture.

## Decision

The embedded analytics component strategy was **superseded** by Metabase's native embedding capabilities.

### Original Proposal
- **Option 3 (Chosen)**: Custom Angular Components + Cube.js
- **Option 6 (Recommended Evolution)**: Cube.js + PostgreSQL with reimplemented Metabase-like components
- Features: QueryBuilder, DrillDown Table, ChartWrapper, Dashboard Container
- `@cubejs-client/ngx` for Observable-based Angular integration

### Why Superseded
- **Reduced development effort**: Metabase provides pre-built components
- **No React dependency**: Metabase iframe embedding works with Angular
- **Simpler maintenance**: One vendor solution vs. custom component library
- **Faster delivery**: Built-in visualizations instead of custom charting

## New Approach

See [ADR-014: Metabase as Unified Analytics Platform](../ADR-014-metabase-analytics.md) for the current embedding strategy:
- Metabase iframe embedding for complex dashboards
- Metabase REST API for data consumption
- Azure SQL direct queries (no PostgreSQL analytics layer)

---

*Archived: December 22, 2025*
