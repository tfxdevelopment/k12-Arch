# MCP Integration Guide for Architecture Documentation

**K12 MyPortal Architecture Documentation via MCP Servers**  
Last Updated: February 7, 2026

> **⚠️ NOTE:** ContextStream MCP references in this document are deprecated (not compatible with Windows). Use Context7 and Microsoft Learn MCP servers instead.

---

## Overview

This guide shows how to leverage MCP (Model Context Protocol) servers to complete and maintain your architecture documentation efficiently. The system uses two primary MCP servers:

1. **Context7** - Latest library documentation and best practices
2. **Microsoft Learn** - Official Azure and .NET documentation

---

## Quick Start: Complete Your Architecture Documentation

### Goal: Convert `sources/K12_Cloud_Architecture_Modernization.md` into Canonical Wiki Structure

#### Step-by-Step Workflow

**Phase 1: Analysis (30 min)**

```bash
# 1. Initialize ContextStream with project context
context(user_message="I need to document K12 cloud architecture from sources/K12_Cloud_Architecture_Modernization.md into our wiki structure")

# 2. Search for existing related content
search(mode="auto", query="microservices architecture Azure ASP.NET Core")

# 3. Read the source document and extract key sections
# (Keep results from search for comparison)

# 4. Create memory of what you found
memory(action="create_node", type="analysis",
  title="K12 Architecture Document Analysis",
  content="Key findings:
- Microservices pattern identified
- Event-driven architecture with Dapr
- Azure cloud-native deployment
- Security patterns defined
- [More findings...]")

# 5. Ask for best practices
context7 query "Microservices architecture ASP.NET Core 2025 patterns"
context7 query "Dapr event-driven patterns best practices"

# 6. Fetch official guidance
microsoft_docs_fetch "https://learn.microsoft.com/en-us/dotnet/architecture/cloud-native/"
microsoft_docs_search "Azure Well-Architected Framework microservices"
```

**Phase 2: Create Structure (1-2 hours)**

```bash
# A. Create Context Diagram
# Create: wiki/01-architecture/01-context-diagram.md
# Tool: Use ContextStream to summarize the system overview
context(user_message="From the K12 architecture document, create a system context description for the C4 model")

# B. Create Container Diagram  
# Create: wiki/01-architecture/02-container-diagram.md
search(mode="semantic", query="microservices containers K12 architecture")

# C. Create Component Diagrams
# Create: wiki/01-architecture/03-component-diagrams/k12-api-components.md
# Use graph analysis
graph(action="dependencies", file_path="src/K12.AppHost/Program.cs")

# D. Create ADRs for Key Decisions
# Create: wiki/adr/ADR-001-microservices-architecture.md
session(action="capture", event_type="decision",
  title="ADR-001: Microservices with Event-Driven Communication",
  content="Decision: Use microservices architecture with Dapr for service-to-service communication through events.
Rationale: [From source doc, verified with Context7 best practices]
Consequences: [Scalability, operational complexity, etc.]")

# E. Create Design Pattern Pages
# Create: wiki/02-design-patterns/microservices-pattern.md
context7 query "microservices design pattern implementation ASP.NET Core"
```

**Phase 3: Document Implementation (2-3 hours)**

```bash
# A. Create Implementation Guides
# Create: wiki/04-implementation-guides/adding-new-microservice.md

# B. Document API Standards
# Create: wiki/03-standards/api-standards.md
microsoft_docs_search "ASP.NET Core API design guidelines"

# C. Document Database Standards
# Create: wiki/03-standards/database-standards.md
search(mode="semantic", query="database schema design Entity Framework Core patterns")

# D. Document Deployment Procedures
# Create: wiki/04-implementation-guides/deployment-procedures.md
microsoft_docs_search "Azure Kubernetes Service deployment ASP.NET Core"

# E. Document Operations Guide
# Create: wiki/05-operations/monitoring-and-alerting.md
microsoft_docs_search "Application Insights monitoring ASP.NET Core"
```

**Phase 4: Validate & Complete (1-2 hours)**

```bash
# A. Check for gaps
.\scripts\generate-wiki-health-report.ps1
# Review: wiki/DOCUMENTATION-INCOMPLETENESS-SCAN.md

# B. Validate links
search(mode="exhaustive", query="broken links internal references")

# C. Create task list for remaining work
memory(action="create_task", 
  title="Complete C4 level 4 diagrams",
  plan_id="[doc-plan-uuid]",
  priority="medium")

# D. Update progress
session(action="capture", event_type="task",
  title="Architecture Documentation Phase 1 Complete",
  content="Completed: [List what's done]. Remaining: [List what's not]")
```

---

## MCP Server Capabilities Matrix

### ContextStream - Persistent Memory & Documentation Management

**Primary Uses**:
- Track documentation work across sessions
- Store decisions and architecture patterns
- Manage documentation tasks and progress
- Search historical decisions and lessons

**Key Commands for Documentation**:

| Task | Command | Example |
|------|---------|---------|
| Create documentation task | `memory(action="create_task", ...)` | `memory(action="create_task", title="Document API patterns", plan_id="...", priority="high")` |
| Track decision | `session(action="capture", event_type="decision", ...)` | `session(action="capture", event_type="decision", title="ADR-NNN: [Decision]", content="...")` |
| Find related decisions | `search(mode="semantic", query="...")` | `search(mode="semantic", query="authentication pattern decisions")` |
| List documentation tasks | `memory(action="list_tasks", ...)` | `memory(action="list_tasks", plan_id="doc-plan-uuid")` |
| Update task status | `memory(action="update_task", ...)` | `memory(action="update_task", task_id="uuid", task_status="completed")` |
| Analyze code structure | `graph(action="dependencies", ...)` | `graph(action="dependencies", file_path="src/K12.AppHost/Program.cs")` |

**Workflow Example - Document a New Pattern**:

```bash
# 1. Discover the pattern in code
graph(action="call_path", from_symbol="ServiceA", to_symbol="ServiceB")

# 2. Create memory of the pattern
memory(action="create_node", type="pattern",
  title="Service-to-Service Communication Pattern",
  content="Discovered pattern: ServiceA calls ServiceB through [mechanism]")

# 3. Create documentation task
memory(action="create_task",
  title="Document Service-to-Service Communication",
  description="Create wiki/02-design-patterns/service-communication.md",
  plan_id="[uuid]", priority="high")

# 4. Track the decision
session(action="capture", event_type="decision",
  title="Service Communication via Dapr",
  content="Services communicate through Dapr sidecar pattern for loose coupling")

# 5. Update status when done
memory(action="update_task", task_id="[uuid]", task_status="completed")
```

---

### Context7 - Latest Library Documentation

**Primary Uses**:
- Find current best practices for technologies
- Verify implementation patterns are current
- Get code examples for documentation
- Check for deprecated patterns

**Queries for Each Document Section**:

| Wiki Section | Recommended Context7 Queries |
|---|---|
| **Microservices Patterns** | "microservices architecture .NET 2025", "service boundaries domain-driven design" |
| **Event-Driven Arch** | "event-driven architecture Dapr patterns", "async messaging best practices" |
| **API Design** | "REST API design ASP.NET Core", "API versioning strategies", "gRPC vs REST" |
| **Data Patterns** | "Entity Framework Core best practices", "CQRS pattern implementation", "Event sourcing" |
| **Cloud Native** | "cloud-native applications .NET", "12-factor app principles", "containerization best practices" |
| **Security** | "API security authentication OAuth2", "secrets management Azure Key Vault", "encryption at rest/transit" |
| **Testing** | "integration testing ASP.NET Core", "test automation strategies", "testing microservices" |
| **DevOps** | "CI/CD pipelines GitHub Actions", "container orchestration Kubernetes", "infrastructure as code" |

**Example: Document API Standards**

```bash
# Get current best practices
context7 query "REST API design standards ASP.NET Core 2025"
context7 query "API versioning strategies semantic versioning"
context7 query "API documentation OpenAPI Swagger"

# Result: Get latest patterns, code examples, and best practices
# Use findings to create: wiki/03-standards/api-standards.md
```

---

### Microsoft Learn - Official Azure & .NET Documentation

**Primary Uses**:
- Reference official Azure architecture patterns
- Get deployment guidance
- Fetch well-architected framework principles
- Access official code samples

**Documentation URLs for K12 Project**:

| Topic | URL | Use Case |
|---|---|---|
| Microsoft Well-Architected Framework | https://learn.microsoft.com/en-us/azure/well-architected/ | Architecture design validation |
| Cloud-Native Architecture | https://learn.microsoft.com/en-us/dotnet/architecture/cloud-native/ | System design reference |
| Microservices Architecture | https://learn.microsoft.com/en-us/dotnet/architecture/microservices/ | Pattern implementation guide |
| Azure Kubernetes Service | https://learn.microsoft.com/en-us/azure/aks/ | Deployment procedures |
| ASP.NET Core Fundamentals | https://learn.microsoft.com/en-us/aspnet/core/ | Implementation guides |
| Entity Framework Core | https://learn.microsoft.com/en-us/ef/core/ | Database patterns |
| Azure Cosmos DB | https://learn.microsoft.com/en-us/azure/cosmos-db/ | NoSQL database patterns |
| Azure Functions | https://learn.microsoft.com/en-us/azure/azure-functions/ | Serverless patterns |

**Example: Document Deployment Architecture**

```bash
# Fetch official guidance
microsoft_docs_fetch "https://learn.microsoft.com/en-us/azure/aks/"
microsoft_docs_search "Kubernetes deployment ASP.NET Core best practices"

# Create: wiki/01-architecture/deployment/kubernetes-architecture.md
# Include official diagrams, patterns, and examples from docs
```

---

## Practical Workflows

### Workflow 1: Extract and Document a New Architecture Pattern

**Scenario**: You found a pattern in the source document that needs to be documented.

```bash
# Step 1: Understand the pattern
context(user_message="Explain the [Pattern Name] pattern found in K12_Cloud_Architecture_Modernization.md")

# Step 2: Get best practices
context7 query "[Pattern Name] ASP.NET Core implementation best practices"

# Step 3: Fetch official docs
microsoft_docs_search "[Related topic] official Azure/ASP.NET guidance"

# Step 4: Create the wiki page
# File: wiki/02-design-patterns/[pattern-name].md
# Include:
# - Problem it solves
# - How it works
# - Code example
# - Trade-offs
# - Link to Context7 references
# - Link to Microsoft Learn docs

# Step 5: Create ADR if it's a decision
session(action="capture", event_type="decision",
  title="ADR-NNN: Use [Pattern Name]",
  content="Decision explanation + rationale from research")

# Step 6: Track the work
memory(action="create_task", title="Document [Pattern Name] pattern",
  description="Created wiki/02-design-patterns/[pattern-name].md",
  plan_id="[uuid]")

# Step 7: Mark complete
memory(action="update_task", task_id="[uuid]", task_status="completed")
```

### Workflow 2: Create an Architectural Decision Record (ADR)

**Scenario**: Need to document a significant technology choice or architectural decision.

```bash
# Step 1: Research the decision
context(user_message="Research the decision to use [Technology/Pattern] in the K12 architecture")

# Step 2: Get best practices
context7 query "[Technology/Pattern] best practices trade-offs 2025"

# Step 3: Fetch official guidance
microsoft_docs_search "[Technology/Pattern] architecture guide"

# Step 4: Create the ADR file
# File: wiki/adr/ADR-NNNN-[title].md
# Template:
# ---
# # ADR-NNNN: [Title]
# ## Status: Proposed|Accepted|Deprecated|Superseded
# ## Context: [Problem, constraints, background]
# ## Decision: [What was decided]
# ## Rationale: [Why this decision was made, supported by research]
# ## Consequences: [Positive and negative impacts]
# ## Alternatives Considered:
# [Alternative 1]: [Why not chosen]
# [Alternative 2]: [Why not chosen]
# ## Related ADRs:
# [Reference other related ADRs]
# ---

# Step 5: Capture in ContextStream
session(action="capture", event_type="decision",
  title="ADR-NNNN: [Decision Title]",
  content="[Summary of what was decided and why]")

# Step 6: Link from related wiki pages
# Update: wiki/02-design-patterns/[related-pattern].md
# Add: "See also: ADR-NNNN"

# Step 7: Update memory bank
memory(action="create_task",
  title="Review ADR-NNNN with team",
  description="Get feedback on [Decision]",
  plan_id="[uuid]", priority="high")
```

### Workflow 3: Update Documentation When Code Changes

**Scenario**: Code architecture is modified and documentation needs updating.

```bash
# Step 1: Analyze the code change
graph(action="impact", symbol_name="ChangedClass|Interface|Service")
graph(action="dependencies", file_path="[changed-file]")

# Step 2: Determine documentation impacts
context(user_message="I changed [description]. What documentation needs updating?")

# Step 3: Create update tasks
memory(action="create_task",
  title="Update [wiki-page] after code change",
  description="Update architecture diagrams/examples after [change]",
  plan_id="[uuid]", priority="high")

# Step 4: Create decision record
session(action="capture", event_type="decision",
  title="Code Change: [Description]",
  content="Updated [affected-components]. Documentation updates: [list]")

# Step 5: Make the updates
# Edit wiki pages affected by the change
# Update code examples if needed
# Regenerate C4 diagrams if structure changed

# Step 6: Verify
.\scripts\generate-wiki-health-report.ps1
# Check that related links still work

# Step 7: Mark complete
memory(action="update_task", task_id="[uuid]", task_status="completed")
```

---

## Documentation Templates with MCP Integration

### Template 1: Architecture Pattern Documentation

```markdown
# [Pattern Name]

**Status**: Draft | Review | Published  
**Last Updated**: [Date]  
**Author**: [Who]  
**Related ADR**: ADR-NNN  
**Related Diagram**: [Diagram file]

## Problem

[What problem does this pattern solve?]

## Solution

[High-level explanation of the solution]

[Diagram of the pattern]

## When to Use

- [Scenario 1]
- [Scenario 2]
- [When NOT to use it]

## Implementation

### Code Example

[Code example showing the pattern in action]

### Configuration

[How to set it up]

## Trade-offs

### Advantages
- [Benefit 1]
- [Benefit 2]

### Disadvantages
- [Cost 1]
- [Cost 2]

## Related Patterns

- [Other pattern]: [How they relate]

## References

[Context7 library docs retrieved on DATE]
[Microsoft Learn documentation URLs]
[Related ADRs]

**Last Reviewed**: [Date]  
**Reviewed By**: [Who]
```

### Template 2: Implementation Guide

```markdown
# [How-To: Task Description]

**Status**: Draft | Review | Published  
**Last Updated**: [Date]  
**Complexity**: Beginner | Intermediate | Advanced  
**Time to Complete**: [Estimate]

## Prerequisites

- [Requirement 1]
- [Requirement 2]

## Overview

[What you'll accomplish]

## Step-by-Step Instructions

### Step 1: [Specific Task]
```
[Exact commands/code to run]
```
[Explanation]

### Step 2: [Next Task]
```
[Commands/code]
```

### Step 3: [Another Task]

[Verification steps]

## Troubleshooting

| Problem | Solution |
|---|---|
| [Error message] | [How to fix] |

## Related Guides

- [Link to other how-tos]

## References

[Microsoft Learn docs]  
[Context7 best practices]

**Last Tested**: [Date]  
**Verified With**: [Tool/Version]
```

---

## Integration with Memory Bank

### Update memory-bank/progress.md Regularly

Track what's been documented:

```markdown
## Architecture Documentation Progress

### Completed
- [x] C4 System Context Diagram
- [x] ADR-001: Microservices Architecture
- [x] API Design Standards

### In Progress
- [ ] Container Diagram with all services
- [ ] Component diagrams for each microservice
- [ ] Implementation guides for common tasks

### Next
- [ ] Operations documentation
- [ ] Disaster recovery procedures
- [ ] Performance tuning guide

### Recent Discoveries
- Found event-driven pattern in source doc (K12_Cloud_Architecture_Modernization.md line 234)
- Identified 3 microservices not yet documented
- Context7 confirms Dapr as best pattern for our use case
```

### Save Documentation Decisions

```bash
session(action="capture", event_type="decision",
  title="Architecture Documentation using C4 Model",
  content="Adopted C4 model (System -> Container -> Component -> Code levels) for all architecture diagrams. 
  Justification: Industry standard, widely understood, progressive detail levels match our needs.
  Tools: Mermaid for diagrams (easier maintenance than images).
  Reference: https://c4model.com, microsoft_docs_fetch Azure Well-Architected Framework")
```

---

## Quality Checklist

Before marking documentation complete:

```bash
# 1. Run health report
.\scripts\generate-wiki-health-report.ps1

# 2. Check for completeness
search(mode="exhaustive", query="TODO TBD FIXME in wiki")

# 3. Validate all links
search(mode="pattern", query="internal wiki links")

# 4. Verify code examples
# (Run examples if applicable, update Context7 references)

# 5. Check diagrams
# (Ensure all architecture sections have diagrams)

# 6. Peer review in ContextStream
memory(action="create_task",
  title="Peer review documentation",
  description="Review completed wiki pages for accuracy",
  priority="high")
```

---

## Monthly Documentation Review

```bash
# Month-end workflow
month_review() {
  # 1. Run health report
  .\scripts\generate-wiki-health-report.ps1
  
  # 2. Analyze incompleteness markers
  context(user_message="Review wiki/DOCUMENTATION-INCOMPLETENESS-SCAN.md and prioritize gaps")
  
  # 3. Get latest from Context7
  context7 query "architecture best practices December 2025"
  
  # 4. Create priority task list
  memory(action="create_task",
    title="Month [N] documentation priorities",
    description="[Top priorities from review]",
    plan_id="[doc-plan-uuid]",
    priority="high")
  
  # 5. Update progress
  session(action="capture", event_type="session_snapshot",
    title="Month [N] Documentation Review",
    content="...summary...")
}
```

---

## Resources & Links

- **agents.md Format Guidance**: https://agents.md/
- **C4 Model**: https://c4model.com/
- **ContextStream Docs**: https://contextstream.io/docs/
- **Microsoft Well-Architected Framework**: https://learn.microsoft.com/en-us/azure/well-architected/
- **Cloud-Native .NET Architecture**: https://learn.microsoft.com/en-us/dotnet/architecture/cloud-native/

---

**Created**: February 7, 2026  
**Framework**: AGENTS.md + ContextStream + Context7 + Microsoft Learn  
**Status**: Living Document - Updated Monthly
