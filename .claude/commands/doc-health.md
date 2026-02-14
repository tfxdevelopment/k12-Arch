---
agent: k12-docs-orchestrator
---

# /doc-health - Documentation Health Audit

Run documentation health audit to identify broken links, incomplete content, and structural issues.

## Usage

```
/doc-health [scope] [type]
```

## Scopes

```
/doc-health full                    # Full wiki audit
/doc-health wiki/02-architecture/   # Specific section
/doc-health wiki/file.md            # Single file
```

## Types

```
/doc-health full all       # All checks (default)
/doc-health full links     # Broken links only
/doc-health full markers   # Incomplete markers only
/doc-health full orphans   # Orphaned files only
/doc-health full structure # Structure validation only
```

## Examples

### Full health check
```
/doc-health full
```

### Check architecture section for broken links
```
/doc-health wiki/02-architecture/ links
```

### Validate single file
```
/doc-health wiki/05-development/README.md
```

## Output

```markdown
## Documentation Health Report

**Generated:** 2026-01-24
**Scope:** full

### Summary
| Metric | Value | Change |
|--------|-------|--------|
| Total Files | 184 | - |
| Broken Links | 16 | -184 |
| Incomplete Markers | 379 | - |

### Issues Found
...

### Recommendations
1. ...
2. ...
```

## Related Commands

- `/doc-complete` - Fix incomplete documentation
- `/idp-setup techdocs` - Regenerate TechDocs after fixes
