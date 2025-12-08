# Claude Agents Quick Reference

## 🎯 Slash Commands

| Command | Purpose | Usage |
|---------|---------|-------|
| `/adr` | Create Architecture Decision Record | `/adr` → Choose ADR number |
| `/diagram` | Create C4 architecture diagram | `/diagram` → Choose diagram level |
| `/migrate` | Migrate from Confluence | `/migrate` → Provide page ID or content |
| `/progress` | Check documentation progress | `/progress` |

## 🧠 Knowledge Graph Commands

**Search the graph:**
```
Search the knowledge graph for "Azure"
Search the knowledge graph for "security"
```

**View entire graph:**
```
Show me the entire knowledge graph
```

**View specific entities:**
```
Show me details for NRules and Entra-ID-B2C
```

**Query relationships:**
```
What technologies does K12-Enrollment-System use?
What integrations are documented?
```

## 📝 Quick Tasks

**Start with quick wins:**
```
/adr
→ Create ADR-005 (NRules) - 15 minutes
```

**Create first diagram:**
```
/diagram
→ Create C4-01 (System Context) - 30 minutes
```

**Check your progress:**
```
/progress
```

**Migrate high-priority doc:**
```
/migrate
→ RULES-01 from Confluence 4420075531
```

## 🗂️ File Structure

```
.claude/
├── agents/              # Agent definitions
│   ├── adr-writer.md
│   ├── diagram-generator.md
│   └── doc-migrator.md
└── commands/            # Slash commands
    ├── adr.md
    ├── diagram.md
    ├── migrate.md
    └── progress.md

wiki/
├── adr/                # Architecture Decision Records
├── diagrams/           # C4 diagrams
├── security/           # Security docs
├── integrations/       # Integration docs
├── frontend/           # Frontend architecture
├── backend/            # Backend architecture
└── standards/          # Development standards
```

## 📊 Documentation Goals

- **Total**: 43 documents
- **Priority 1**: 15 documents (~13 hours)
- **Priority 2**: 17 documents (~18 hours)
- **Priority 3**: 14 documents (~19 hours)
- **Priority 4**: 8 documents (~12 hours)

## 🚀 Getting Started

1. Check progress: `/progress`
2. Start with quick wins: `/adr` → ADR-005
3. Create first diagram: `/diagram` → C4-01
4. View knowledge graph: "Show me the entire knowledge graph"

## 📖 Full Documentation

See [CLAUDE-AGENTS-SETUP.md](CLAUDE-AGENTS-SETUP.md) for complete guide.
