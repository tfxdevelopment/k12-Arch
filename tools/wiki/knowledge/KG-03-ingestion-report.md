# KG-03 — Wiki to Knowledge Graph Ingestion Report

**Date:** 2026-02-27
**Status:** Complete (targeted corpus ingested to JSON graph artifacts)

## 1) Ingestion scope
To avoid pulling generated/vendor markdown noise, ingestion scope is constrained to schema-aligned wiki paths:

- `adr/`, `adr_archive/`
- `02-architecture/`, `diagrams/`
- `guides/`, `05-development/`, `05-testing/`, `01-project-overview/`
- `notes/`, `principles/`, `lessons/`, `06-operations/`, `07-deployment/`
- `knowledge/`, `patterns/`, `04-standards/`
- `09-proposed-architecture/`
- plus key root docs (`README.md`, `TABLE_OF_CONTENTS.md`, `index.md`, glossary/pipeline/health docs)

## 2) Corpus size
- **Targeted total files:** `277` markdown files

## 3) Extracted graph metrics (targeted corpus)
Node and edge artifacts were generated from the targeted corpus using `tools/wiki/knowledge/kg03_export.py`.

### Node counts
- `NODES_TOTAL`: 277
- `NODES_ADR`: 39
- `NODES_Architecture`: 47
- `NODES_Diagrams`: 17
- `NODES_Guides`: 18
- `NODES_Knowledge`: 27
- `NODES_Lessons`: 1
- `NODES_Notes`: 8
- `NODES_Ops`: 12
- `NODES_Proposed`: 98
- `NODES_Uncategorized`: 10

### Edge counts
- `EDGES_CITES_TOTAL`: 709

### Output artifacts
- `tools/wiki/knowledge/KG-03-nodes.json`
- `tools/wiki/knowledge/KG-03-edges.json`

## 4) Category model in use
KG-03 uses `KG-02-knowledge-graph-schema.md` + `KG-02b-uncategorized-mapping.md`:
- Node classes: `Document`, `Section`, `Decision`, `Control`, `Gap`
- Core edges: `BELONGS_TO`, `CITES`, `DERIVES_FROM`, `IMPLEMENTS`, `INFORMS`, `SUPERSEDES`, `HAS_GAP`, `BLOCKED_BY`

## 5) Remaining follow-ups
1. Add explicit `BELONGS_TO` edges using CAF/WAF section mappings.
2. Add `Gap` nodes for unresolved mappings in Proposed docs.
3. Incrementally expand relationship extraction beyond `CITES` (`DERIVES_FROM`, `IMPLEMENTS`).
