---
agent: k12-docs-orchestrator
---

# /doc-complete - Complete Documentation

Complete incomplete documentation by filling in TBD/TODO markers with accurate content.

## Usage

```
/doc-complete [target]
```

## Targets

### Single File
```
/doc-complete wiki/02-architecture/backend/BE-01-layered-architecture-deep-dive.md
```

### Batch by Category
```
/doc-complete batch:BE      # Backend docs (4 files, 48 markers)
/doc-complete batch:DATA    # Data docs (4 files, 52 markers)
/doc-complete batch:OPS     # Operations docs (4 files, 43 markers)
/doc-complete batch:DEPLOY  # Deployment docs (4 files, 48 markers)
/doc-complete batch:STD     # Standards docs (4 files, 34 markers)
/doc-complete batch:FE      # Frontend docs (5 files, 30 markers)
```

### All Incomplete
```
/doc-complete batch:all     # All incomplete docs (priority order)
```

## Process

1. **Audit** - Identify TBD markers in target file(s)
2. **Research** - Gather context from related docs and sources
3. **Generate** - Write accurate content to replace markers
4. **Validate** - Verify completeness and accuracy

## Examples

### Complete a single backend doc
```
/doc-complete wiki/02-architecture/backend/BE-02-api-design-patterns.md
```

### Complete all data architecture docs
```
/doc-complete batch:DATA
```

## Output

- Updated file(s) with TBD markers resolved
- Summary of changes made
- Validation report
- Any remaining gaps noted
