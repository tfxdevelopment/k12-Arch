# KG-02 — Knowledge Graph Schema (v1)

> **⚠️ DEPRECATED:** ContextStream MCP is not compatible with Windows. This schema is retained for reference only.

## Purpose
Define a consistent schema for ingesting `tools/wiki/**/*.md` into a searchable, linked knowledge graph that supports CAF/WAF document generation.

## Scope
- Source corpus: `tools/wiki/**/*.md`
- Initial focus categories: `ADR`, `Architecture`, `Diagrams`, `Guides`, `Notes`, `Knowledge`, `Ops`, `Proposed`

## Node Types

### 1) `Document`
Canonical node for every markdown file.

**Required fields**
- `id` (string, stable) — e.g., normalized relative path
- `title` (string)
- `path` (string)
- `category` (enum): `ADR|Architecture|Diagrams|Guides|Notes|Knowledge|Ops|Proposed|Uncategorized`
- `status` (enum): `active|draft|archived|tbd`
- `updated_at` (datetime)

**Optional fields**
- `summary` (string)
- `owner` (string)
- `tags` (string[])
- `source_system` (string, default: `wiki`)

### 2) `Section`
Logical knowledge area used for grouping and navigation.

**Required fields**
- `id` (string)
- `name` (string)
- `section_type` (enum): `CAF|WAF|Architecture|Engineering|Operations|Governance`

### 3) `Decision`
Architecture decision/ADR semantic node.

**Required fields**
- `id` (string)
- `decision_id` (string) — e.g., `ADR-004`
- `title` (string)
- `status` (enum): `accepted|proposed|superseded|deprecated`

### 4) `Control`
WAF/CAF control or recommendation element.

**Required fields**
- `id` (string)
- `framework` (enum): `CAF|WAF`
- `pillar_or_phase` (string)
- `name` (string)

### 5) `Gap`
Known content gap identified during mapping.

**Required fields**
- `id` (string)
- `title` (string)
- `severity` (enum): `high|medium|low`
- `status` (enum): `open|in_progress|closed`

## Relationship Types
- `BELONGS_TO` (`Document -> Section`)
- `CITES` (`Document -> Document`)
- `DERIVES_FROM` (`Document -> Document`) for generated CAF/WAF docs
- `IMPLEMENTS` (`Document -> Control`)
- `INFORMS` (`Decision -> Document`)
- `SUPERSEDES` (`Decision -> Decision`)
- `HAS_GAP` (`Section -> Gap`)
- `BLOCKED_BY` (`Gap -> Document`)

## Category Mapping Rules (v1)
- `tools/wiki/adr/**` -> `ADR`
- `tools/wiki/02-architecture/**` -> `Architecture` (except `c4-diagrams` -> `Diagrams`)
- `tools/wiki/diagrams/**` or `**/c4-diagrams/**` -> `Diagrams`
- `tools/wiki/guides/**` and `tools/wiki/05-development/**` -> `Guides`
- `tools/wiki/notes/**` and `tools/wiki/principles/**` -> `Notes`
- `tools/wiki/knowledge/**`, `tools/wiki/patterns/**`, `tools/wiki/04-standards/**` -> `Knowledge`
- `tools/wiki/06-operations/**`, `tools/wiki/07-deployment/**` -> `Ops`
- `tools/wiki/09-proposed-architecture/**` -> `Proposed`
- otherwise -> `Uncategorized`

## CAF/WAF Target Section Taxonomy

### CAF (Application-specific)
- `CAF-Strategy`
- `CAF-Plan`
- `CAF-Ready`
- `CAF-Adopt`
- `CAF-Govern`
- `CAF-Manage`

### WAF (All pillars)
- `WAF-Reliability`
- `WAF-Security`
- `WAF-CostOptimization`
- `WAF-OperationalExcellence`
- `WAF-PerformanceEfficiency`

## Ingestion Metadata Contract
Every `Document` node must include:
- `path`
- `category`
- `status` inferred by content markers:
  - contains `# TBD` or `Detailed content pending` -> `tbd`
  - contains `archive` path -> `archived`
  - under `09-proposed-architecture` -> default `draft`
  - otherwise `active`

## Validation Rules
- No duplicate `id`
- No empty `title`
- Every generated CAF/WAF doc must have at least one `DERIVES_FROM` edge
- Every `Proposed` doc should map to at least one CAF or WAF section (or create `Gap`)

## Deliverables for KG-03
1. Load all `Document` nodes
2. Apply category mapping
3. Create `Section` nodes for CAF/WAF taxonomy
4. Build `BELONGS_TO` and `CITES` edges
5. Emit gap list for unmapped/uncategorized sources

## Versioning
- Schema version: `kg-schema-v1`
- Owner: `ContextStream migration workstream`
- Effective date: `2026-02-27`
