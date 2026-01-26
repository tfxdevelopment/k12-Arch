# Redirect: ADR-009 (archived)

This ADR is now maintained in the canonical ADR folder:

- [ADR-009-analytics-query-engine-abstraction.md](./../ADR-009-analytics-query-engine-abstraction.md)

This file is a redirect stub preserved for link compatibility.
# ADR-009: Analytics Query Engine Abstraction Layer

> **ARCHIVED** - This ADR has been superseded. See [ADR-014: Metabase as Unified Analytics Platform](./../ADR-014-metabase-analytics.md) for the current approach.

**Status:** Superseded
**Superseded By:** ADR-014
**Archived:** 2025-12-22
**Original Date:** 2025-12-08
**Deciders:** CFI Architecture Team, K12 Dev Team

---

## Summary

This ADR proposed an `IQueryEngine` interface to enable pluggable query engines (CubeJS, Data API Builder, Trino) for the K12 QueryBuilder analytics platform.

## Decision

The query engine abstraction layer was **superseded** by a simplified Metabase-only approach.

### Original Proposal
- `IQueryEngine` interface with multiple implementations
- CubeJS as primary engine (semantic layer, pre-aggregations)
- Data API Builder as fallback (zero-code REST/GraphQL)
- Trino for raw SQL federation

### Why Superseded
- **Complexity reduction**: Single analytics platform (Metabase) instead of 4 components
- **Operational simplicity**: One tool to manage, monitor, and maintain
- **Cost efficiency**: Metabase Cloud handles production hosting
- **Faster time-to-value**: No custom abstraction layer needed

## New Approach

See [ADR-014: Metabase as Unified Analytics Platform](./../ADR-014-metabase-analytics.md) for the current analytics strategy:
- **Local Dev**: Metabase container via .NET Aspire
- **Development**: Metabase cluster on Azure Container Apps
- **Production**: Metabase Cloud hosted service

---

*Archived: December 22, 2025*
