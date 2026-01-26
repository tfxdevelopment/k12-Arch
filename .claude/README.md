# K12 Documentation & IDP Agents System

This directory contains a specialized agents system for completing K12 MyPortal documentation and configuring the Internal Developer Portal (Backstage).

## Quick Start

### Complete Documentation
```
/doc-complete batch:BE      # Complete backend docs
/doc-complete batch:DATA    # Complete data docs
/doc-complete batch:all     # Complete all incomplete docs
```

### Check Documentation Health
```
/doc-health full            # Full health audit
/doc-health full links      # Check broken links only
```

### Configure IDP
```
/idp-setup all              # Full IDP configuration
/idp-setup techdocs         # TechDocs integration only
/idp-setup catalog          # Software catalog only
```

### Add Catalog Components
```
/catalog-add k12-api-enrollment service --owner cfi-backend-team
```

## System Architecture

```
.claude/
├── agents/
│   ├── k12-docs-orchestrator.md      # Main orchestrator
│   └── subagents/
│       ├── doc-writer.md             # Documentation writer
│       ├── doc-health-auditor.md     # Health auditor
│       ├── backstage-configurator.md # Backstage config
│       ├── techdocs-integrator.md    # TechDocs setup
│       └── catalog-builder.md        # Catalog builder
├── context/
│   ├── k12-domain.md                 # Domain knowledge
│   ├── documentation-state.md        # Current doc state
│   └── idp-state.md                  # IDP current state
├── commands/
│   ├── doc-complete.md               # /doc-complete
│   ├── doc-health.md                 # /doc-health
│   ├── idp-setup.md                  # /idp-setup
│   └── catalog-add.md                # /catalog-add
└── README.md                         # This file
```

## Current State

### Documentation
| Metric | Value |
|--------|-------|
| Total Files | 184 |
| Broken Links | 16 |
| Incomplete Markers | 379 |

### Priority Batches
| Batch | Files | Markers |
|-------|-------|---------|
| BE (Backend) | 4 | 48 |
| DATA | 4 | 52 |
| OPS | 4 | 43 |
| DEPLOY | 4 | 48 |

### IDP Status
| Component | Status |
|-----------|--------|
| Backstage | Scaffolded |
| TechDocs | Basic stub |
| Catalog | Placeholder |
| Auth | Guest only |

## Workflows

### Documentation Completion Workflow
1. **Audit** - Run health check to identify gaps
2. **Prioritize** - Select batch by impact
3. **Generate** - Route to doc-writer for content
4. **Validate** - Verify completeness

### IDP Setup Workflow
1. **Configure** - Set up app-config.yaml
2. **TechDocs** - Integrate wiki documentation
3. **Catalog** - Build software catalog
4. **Validate** - Test all components

## Related Resources

- [Wiki Documentation](../tools/wiki)
- [Backstage IDP](../src/cfi-k12/k12-idp/)
- [Memory Bank](../memory-bank/)
- [Health Report](../tools/wiki/DOCUMENTATION-HEALTH-REPORT.md)
