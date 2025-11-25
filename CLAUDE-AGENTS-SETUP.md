# Claude Agents & Knowledge Base Setup

**Purpose**: Guide for using Claude agents and local memory/knowledge base for K12 architecture documentation.

**Created**: November 24, 2025
**Status**: Ready to Use

---

## 🎯 Overview

This setup provides specialized Claude agents and a persistent knowledge graph to help manage the K12 architecture documentation effort. The system includes:

1. **MCP Servers** for memory and knowledge management
2. **Specialized Agents** for different documentation tasks
3. **Slash Commands** for quick access to agents
4. **Knowledge Graph** for tracking relationships and progress

---

## 📦 Installed Components

### MCP Servers

| Server | Purpose | Status |
|--------|---------|--------|
| **memory** | Knowledge graph for storing entities and relationships | ✅ Active |
| **sqlite-mcp-server** | Advanced SQLite with analytics and search | ✅ Active |
| **simplechecklist** | Task management system | ✅ Active |

### Specialized Agents

| Agent | File | Purpose |
|-------|------|---------|
| **ADR Writer** | `.claude/agents/adr-writer.md` | Create Architecture Decision Records |
| **Diagram Generator** | `.claude/agents/diagram-generator.md` | Create C4 diagrams with Mermaid |
| **Doc Migrator** | `.claude/agents/doc-migrator.md` | Migrate content from Confluence |

### Slash Commands

| Command | Purpose |
|---------|---------|
| `/adr` | Launch ADR Writer agent |
| `/diagram` | Launch Diagram Generator agent |
| `/migrate` | Launch Documentation Migrator agent |
| `/progress` | Check documentation progress |

---

## 🚀 Quick Start

### Using Slash Commands

Simply type the command to activate the specialized agent:

```
/adr
```

The agent will activate and ask which ADR you want to create.

```
/diagram
```

The agent will ask which C4 diagram you want to generate.

```
/migrate
```

The agent will ask which Confluence page to migrate.

```
/progress
```

Get a summary of documentation progress and recommendations.

### Using Agents Directly

You can also reference agent files directly in your prompts:

```
@.claude/agents/adr-writer.md Create ADR-001 for Azure Government Cloud Selection
```

---

## 🧠 Knowledge Graph Usage

The knowledge graph (via the **memory** MCP server) stores entities and relationships about your architecture.

### Key Entity Types

- **ArchitectureDecision**: ADRs and key decisions
- **Diagram**: C4 diagrams and other visuals
- **Documentation**: Migrated docs and guides
- **Technology**: Technologies and frameworks used
- **Integration**: External system integrations
- **Component**: System components and services

### Example: Querying the Knowledge Graph

Ask Claude to search the knowledge graph:

```
Search the knowledge graph for all ADRs related to Azure
```

```
Show me all entities related to security
```

```
What components are documented in the knowledge graph?
```

### Example: Adding to Knowledge Graph

When you create new documentation, you can manually add it:

```
Add to knowledge graph: ADR-001 about Azure Government Cloud selection,
related to FedRAMP compliance and Entra ID
```

Or, the agents will automatically update the knowledge graph when they create documentation.

---

## 📝 Documentation Workflow

### Workflow 1: Create an ADR

1. **Launch agent**: Type `/adr`
2. **Select ADR**: Choose from the list (e.g., "ADR-001")
3. **Agent creates ADR**: Follows template, gathers context, creates file
4. **Agent updates knowledge graph**: Stores decision and relationships
5. **Agent updates checklist**: Marks ADR as complete

**Example conversation:**
```
You: /adr
Agent: Which ADR would you like to create? [Lists available ADRs]
You: ADR-005 for NRules
Agent: [Creates comprehensive ADR following template]
Agent: [Updates knowledge graph with decision details]
Agent: [Marks ADR-005 as complete in checklist]
```

### Workflow 2: Generate a Diagram

1. **Launch agent**: Type `/diagram`
2. **Select diagram**: Choose from C4 levels (e.g., "C4-01 System Context")
3. **Agent creates diagram**: Uses Mermaid syntax, adds context
4. **Agent updates knowledge graph**: Stores diagram relationships
5. **Agent updates checklist**: Marks diagram as complete

**Example conversation:**
```
You: /diagram
Agent: Which diagram would you like to create? [Lists available diagrams]
You: C4-01 System Context Diagram
Agent: [Creates Mermaid C4 diagram]
Agent: [Adds supporting text]
Agent: [Updates knowledge graph]
Agent: [Saves to wiki/diagrams/C4-01-System-Context.md]
```

### Workflow 3: Migrate Documentation

1. **Launch agent**: Type `/migrate`
2. **Provide source**: Give Confluence page ID or paste content
3. **Agent converts**: Transforms to markdown, enhances with examples
4. **Agent updates knowledge graph**: Stores doc relationships
5. **Agent updates checklist**: Marks documentation as complete

**Example conversation:**
```
You: /migrate
Agent: Which documentation would you like to migrate? [Lists priority docs]
You: RULES-01 - NRules Implementation from Confluence page 4420075531
Agent: [If you have the content, paste it, or I can work from the page ID]
You: [Pastes Confluence content]
Agent: [Converts to markdown]
Agent: [Adds code examples and diagrams]
Agent: [Updates knowledge graph]
Agent: [Saves to wiki/business-rules/RULES-01-NRules-Implementation.md]
```

---

## 🎯 Best Practices

### 1. Use Slash Commands for Quick Tasks

Slash commands are the fastest way to activate specialized agents:
- `/adr` when you want to create an ADR
- `/diagram` when you need a diagram
- `/migrate` when migrating from Confluence

### 2. Keep Knowledge Graph Updated

The knowledge graph is your documentation memory:
- Agents update it automatically
- You can query it to understand relationships
- It helps maintain consistency across docs

### 3. Check Progress Regularly

Use `/progress` to:
- See what's been completed
- Identify what to work on next
- Track overall progress toward goals

### 4. Cross-Reference Documentation

When creating docs:
- Link to related ADRs
- Reference relevant diagrams
- Connect to source code
- Cite Confluence sources

### 5. Follow the Priority Order

The checklist has 4 priority levels:
1. **Priority 1 (Critical)**: ADRs, basic diagrams, security docs
2. **Priority 2 (High)**: Component diagrams, integrations, standards
3. **Priority 3 (Medium)**: Data architecture, deployment, backend
4. **Priority 4 (Low)**: Advanced diagrams, operational docs

---

## 🔧 Advanced Usage

### Creating Custom Agents

You can create your own agents by adding files to `.claude/agents/`:

```markdown
# My Custom Agent

**Purpose**: [What this agent does]

## Your Role
[Agent's role and expertise]

## Context
[Project context and key information]

## Your Process
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Templates
[Any templates or examples]

## Quality Checklist
- [ ] Item 1
- [ ] Item 2
```

Then create a slash command in `.claude/commands/`:

```markdown
# My Custom Command

You are now the **My Custom Agent**. Load and follow the instructions from:
`.claude/agents/my-custom-agent.md`

[Any additional context or prompts]
```

### Querying Knowledge Graph with MCP Tools

You can directly use MCP memory tools:

**Search for nodes:**
```
Use the search_nodes tool to find all entities related to "security"
```

**Read entire graph:**
```
Use the read_graph tool to show me the entire knowledge graph
```

**Open specific nodes:**
```
Use the open_nodes tool to show me details for "ADR-001" and "ADR-002"
```

---

## 📊 Progress Tracking

### Current Status

You can always check:
- [K12-Architecture-Documentation-Checklist.md](K12-Architecture-Documentation-Checklist.md) - Manual tracking
- Knowledge graph via `/progress` command - Automated tracking with relationships

### Weekly Goals

The checklist includes weekly targets:
- **Week 1**: Complete Priority 1 (15 docs, ~13 hours)
- **Week 2**: Complete Priority 2 (17 docs, ~18 hours)
- **Week 3**: Complete Priority 3 (14 docs, ~19 hours)
- **Week 4**: Complete Priority 4 (8 docs, ~12 hours)

---

## 🔗 File Locations

```
k12-Arch/
├── .claude/
│   ├── agents/           # Agent definition files
│   │   ├── adr-writer.md
│   │   ├── diagram-generator.md
│   │   └── doc-migrator.md
│   └── commands/         # Slash command files
│       ├── adr.md
│       ├── diagram.md
│       ├── migrate.md
│       └── progress.md
├── wiki/
│   ├── adr/             # Architecture Decision Records
│   ├── diagrams/        # C4 and other diagrams
│   ├── security/        # Security architecture docs
│   ├── integrations/    # Integration documentation
│   ├── frontend/        # Frontend architecture
│   ├── backend/         # Backend architecture
│   └── standards/       # Development standards
├── K12-Architecture-Documentation-Checklist.md
└── CLAUDE-AGENTS-SETUP.md (this file)
```

---

## 🎓 Example Sessions

### Session 1: Quick Wins Day

**Goal**: Complete the quick wins from the checklist

```
You: /progress
Agent: [Shows current progress]

You: Let's tackle the quick wins. /adr
Agent: Which ADR?
You: ADR-005 (NRules) - it says content is ready

[Agent creates ADR-005 in ~15 minutes]

You: /diagram
Agent: Which diagram?
You: C4-01 - template is ready

[Agent creates C4-01 in ~30 minutes]

You: /progress
Agent: [Shows updated progress: 2 items completed!]
```

### Session 2: Security Architecture Day

**Goal**: Document security architecture

```
You: /adr
Agent: Which ADR?
You: ADR-003 (Entra ID B2C for CIAM)

[Agent creates ADR-003]

You: /migrate
Agent: Which documentation?
You: SEC-01 - Entra ID Configuration from Confluence 4053696597

[Agent migrates and enhances documentation]

You: /migrate
Agent: Which documentation?
You: SEC-02 - Authorization Model from Confluence 4157800453

[Agent migrates documentation]

You: Search knowledge graph for all security-related entities
Agent: [Shows ADR-003, SEC-01, SEC-02, and their relationships]
```

### Session 3: Integration Documentation

**Goal**: Document all integrations

```
You: /migrate
Agent: Which documentation?
You: Let's do all the integrations: ClassWallet, PandaDoc, SendGrid

[Agent works through each integration]

You: Now create a diagram showing how these integrations work
Agent: [Creates integration architecture diagram]

You: Add these to the knowledge graph with relationships to the backend components
Agent: [Updates knowledge graph with integration entities and relations]
```

---

## ❓ FAQ

### Q: How do I see what's in the knowledge graph?

**A**: Ask Claude to search or read the graph:
```
Show me the entire knowledge graph
```
```
Search the knowledge graph for "Azure"
```

### Q: Can I use multiple agents in one session?

**A**: Yes! You can switch between agents:
```
/adr
[Create ADR]
/diagram
[Create related diagram]
```

### Q: How do I update the checklist?

**A**: Agents update it automatically, or you can manually edit:
[K12-Architecture-Documentation-Checklist.md](K12-Architecture-Documentation-Checklist.md)

### Q: What if I want to create custom documentation?

**A**: Just ask Claude directly, or create a custom agent for repeated tasks.

### Q: Do I need Confluence access?

**A**: For migration, you can:
1. Provide Confluence page ID (Claude may access via API)
2. Copy/paste content directly
3. Work from memory if you know the content

### Q: How do I share this setup with my team?

**A**: Commit the `.claude/` directory to git:
```bash
git add .claude/
git add CLAUDE-AGENTS-SETUP.md
git commit -m "Add Claude agents and knowledge base setup"
git push
```

---

## 🎉 Getting Started Now

Ready to begin? Here's your first task:

1. **Check progress**: Type `/progress`
2. **Start with quick wins**: Type `/adr` and create ADR-005
3. **Create first diagram**: Type `/diagram` and create C4-01
4. **Track in knowledge graph**: Ask Claude to search the graph

You now have a powerful documentation system! 🚀

---

**Questions or Issues?**
- Review the checklist: [K12-Architecture-Documentation-Checklist.md](K12-Architecture-Documentation-Checklist.md)
- Check agent definitions in `.claude/agents/`
- Ask Claude to explain any part of this setup
