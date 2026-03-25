# APM CLI Handoff Designs - For Review

**Purpose:** Show how global + local context flows through APM to agents  
**Context:** Builds on Phase 1 & 2 analysis above  
**Audience:** You (validation) then team (documentation)

---

## Scenario A: Agent Handoff with Context Merge

**Trigger:** Developer in k12-infra runs `@terraform-agent`

### Data Flow Diagram

```
Developer: @terraform-agent
           ↓
APM Registry Lookup
  ├─ Load project apm.yml (k12-infra/apm.yml)
  ├─ Resolve dependency → tfxdevelopment/.github-private:2.0.0
  ├─ Locate agent: .github-private/agents/terraform.agent.md
  └─ Merge contexts:
    ├─ Global agent definition (MCP config, HCP Terraform workflows)
    ├─ Global instructions (terraform-execution-patterns.instructions.md)
    ├─ Local instructions (k12-infra/.github/copilot-instructions.md)
    └─ Local project context (module structure, environments/)
           ↓
Invoke terraform.agent.md with Full Context
  ├─ MCP: Terraform server auto-configured
  ├─ Tools: read, edit, shell, terraform/* 
  ├─ Context: K12 module boundaries, Dapr patterns, networking CIDR
  └─ Knowledge: "terraform/environments/<env>" execution rule
           ↓
Agent Responds
  └─ Uses K12-specific context in advice (e.g., "run from terraform/environments/development")
```

### Implementation: APM MCP Config

**File:** `.github-private/.apm/cli-config.yaml`

```yaml
# Global registry: how to resolve agents/prompts/instructions
registries:
  global:
    provider: github
    org: tfxdevelopment
    repo: .github-private
    paths:
      agents: agents/
      prompts: prompts/
      instructions: instructions/
    priority: primary
    
  awesome-copilot:
    provider: github
    org: github
    repo: awesome-copilot
    paths:
      agents: agents/
      skills: skills/
    priority: secondary          # Use local first,  fall back to awesome-copilot

# MCP server activation rules
mcp-servers:
  terraform:
    triggers: ["@terraform*", "terraform.agent"]
    docker:
      image: hashicorp/terraform-mcp-server:latest
      env:
        TFE_TOKEN: ${TFE_TOKEN}
        TFE_ADDRESS: ${TFE_ADDRESS}
        ENABLE_TF_OPERATIONS: "true"
    capabilities: ["read", "list", "create", "run", "apply"]

  aspire-cli:
    triggers: ["@dotnet-cloud*", "aspire"]
    docker:
      image: mcr.microsoft.com/dotnet/aspire-mcp:latest
      env:
        DOTNET_SDK_VERSION: "9.0"
    capabilities: ["build", "deploy", "orchestrate"]

# Context merge rules (how local + global blend)
context-merge:
  instructions:
    order: ["global-first", "local-override"]  # Global patterns, then project specifics
    merge-strategy: "append"                     # Both visible to agent
    
  agent-context:
    include:
      - project files (terraform/environments/*, etc.)
      - project instructions (k12-infra/.github/copilot-instructions.md)
      - project-specific conventions (AGENTS.md, TOOLSETS.md)
      - global instructions (from .github-private/instructions/)

# Handoff routing rules (when to forward to another agent)
handoff-patterns:
  terraform-to-cloud:
    trigger: "I need to deploy this to Azure"
    from: terraform.agent
    to: dotnet-cloud-specialist.agent
    context-forward:
      - terraform plan output
      - infrastructure code
      - infrastructure decisions (AKS vs ACA, etc.)
    
  cloud-to-security:
    trigger: "security implications|RBAC|secrets|compliance"
    from: dotnet-cloud-specialist.agent
    to: dotnet-security-reviewer.agent
    context-forward:
      - infrastructure decisions
      - identity/secret strategy
      - compliance requirements
```

### Example Run: Step-by-Step

```bash
$ cd k12-infra
$ apm use k12-infra                           # Activates global + k12 context

$ @terraform-agent "I want to add a Redis cache to the ACA environment"

# APM CLI internally:
# 1. Opens k12-infra/apm.yml → finds tfxdevelopment/.github-private:2.0.0
# 2. Opens .github-private/agents/terraform.agent.md
# 3. Loads .github-private/instructions/terraform-execution-patterns.instructions.md
# 4. Loads .github-private/instructions/azure-container-apps-patterns.instructions.md
# 5. Loads k12-infra/.github/copilot-instructions.md (K12 specifics)
# 6. Loads k12-infra/terraform/environments/development/locals.tf (current state)
# 7. Loads MCP config → starts Terraform MCP server
# 8. INVOKES terraform.agent.md with merged context

Agent Output:
┌─────────────────────────────────────────────────────────────────────┐
│ You are a Terraform specialist with:                               │
│ • HCP Terraform MCP integration enabled                            │
│ • Azure infrastructure knowledge (VNets, subnets, ACR, ACA, etc.)  │
│ • K12 module structure (core, api-enrollment, web-enrollment)     │
│ • K12 environment strategy (dev/staging/testing/prod)             │
│ • Dapr architecture (Redis state store + pub/sub)                  │
│ • Networking CIDR blocks (10.0.0.0/16 VNet, etc.)                │
│ • Critical rule: Run terraform from terraform/environments/<env>  │
│                                                                     │
│ The developer wants to add Redis to ACA. Here's my guidance:       │
│                                                                     │
│ 1. Update terraform/modules/api-enrollment/redis.tf               │
│ 2. Add Redis subnet reference to VNet (10.0.3.0/24)               │
│ 3. Configure Dapr component in ACA environment                     │
│ 4. Update locals.tf with Redis SKU for your environment            │
│ 5. Run: cd terraform/environments/development && terraform plan   │
│                                                                     │
│ [Full code-gen + explanations with K12 context]                   │
└─────────────────────────────────────────────────────────────────────┘

# If developer needs help with security implications:
$ @dotnet-security-reviewer "Is this Redis configuration secure?"

# APM CLI detects handoff opportunity:
# 1. Terraform agent completes
# 2. User asks security question → APM suggests handoff
# 3. Loads security-reviewer agent WITH prior Terraform code in context
# 4. Security reviewer analyzes: firewall rules, RBAC, encryption, etc.
```

---

## Scenario B: Prompt Routing with Workflow Chaining

**Trigger:** Developer runs `/deploy` prompt

### Workflow Chain

```
Developer: /deploy                       # Workflow prompt
           ↓
APM Prompt Loader
  ├─ Look up deploy.prompt.md in .github-private/prompts/
  └─ Load k12-infra/.github/copilot-instructions.md for context
           ↓
Prompt Workflow Step 1: Gather Requirements
  └─ "What environment? What service?"
           ↓
Subprocess: Call Planning Agent
  └─ Uses architecture-create.prompt.md if new resource
           ↓
Workflow Step 2: Generate Plan
  └─ Uses dotnet-cloud-specialist agent
           ↓
Subprocess: Security Check
  └─ Auto-invoke dotnet-security-reviewer if secrets/RBAC involved
           ↓
Workflow Step 3: Execute Deployment
  └─ APM invokes terraform.agent to run apply
           ↓
Subprocess: Verify Deployment
  └─ Health checks, smoke tests
           ↓
Workflow Step 4: Document
  └─ Invokes documentation-writer agent
```

### Implementation: Prompt with Handoff Directives

**File:** `.github-private/prompts/deploy.prompt.md`

```yaml
---
description: "Deploys application infrastructure via orchestrated agent handoff"
triggers: ["/deploy", "deploy this", "push to production"]
mcp-required: ["terraform"]
agents-chain:
  - dotnet-cloud-specialist  # Step 1: Review deployment strategy
  - dotnet-security-reviewer # Step 2: Security gate
  - terraform.agent          # Step 3: Execute via Terraform
  - dotnet-observability-advisor  # Step 4: Verify (if available)
handoff-context:
  preserve:
    - infrastructure decisions
    - security approvals
    - deployment targets (env, region)
---

# Deployment Orchestration Workflow

## Phase 1: Pre-Deployment Review

You are preparing to deploy infrastructure. Use **@dotnet-cloud-specialist** to validate:

1. **Deployment Target:** Which environment? (dev/staging/testing/prod)
2. **Service Configuration:** Which services/resources?
3. **Connectivity:** VNets, subnets, firewall rules correct?
4. **Aspire Integration:** Service discovery configured?

[Handoff to: dotnet-cloud-specialist]
---

## Phase 2: Security Pre-Flight

Now use **@dotnet-security-reviewer** to validate:

1. **Secrets Management:** All credentials in Key Vault/secrets manager?
2. **RBAC:** Managed identities correctly scoped?
3. **Network Security:** IP restrictions, firewalls in place?
4. **Compliance:** Meet project security baseline?

[Handoff to: dotnet-security-reviewer]
---

## Phase 3: Execute Deployment

Once approved, use **@terraform-agent** to:

1. Run: `terraform plan` from correct environment directory
2. Review plan output (Terraform will use MCP for state inspection)
3. Apply if approved
4. Capture outputs for next phase

[Handoff to: terraform-agent with MCP enabled]
---

## Phase 4: Verify & Monitor

Finally:

1. Check health endpoints return 200
2. Verify logs flow to monitoring (Application Insights, etc.)
3. Spot-check Dapr state store connectivity (if used)
4. Document deployment decision via ADR

[Invokes: documentation-writer agent if needed]
```

### Example Run

```bash
$ cd k12-infra
$ /deploy

APM Workflow Manager:
  Step 1/4: Calling @dotnet-cloud-specialist
  └─ "Validate deployment to development of the enrollment API"
  
  User Input: "development environment, api-enrollment module"
  
  Step 2/4: Calling @dotnet-security-reviewer
  └─ "Security pre-flight check for enrollment API to dev"
  └─ Receives prior cloud-specialist decisions as context
  
  User Input: "Approved - all RBAC scoped correctly"
  
  Step 3/4: Calling @terraform-agent
  └─ "Deploy enrollment API to dev via Terraform"
  └─ Receives: environment choice (dev), module (api-enrollment), security approvals
  └─ Runs: terraform plan → terraform apply
  
  Step 4/4: Verification
  └─ Spot-check health endpoints
  └─ Monitor logs in Application Insights
  
Result: Full deployment workflow completed with proper gates + handoffs
```

---

## Scenario C: Global + Local Merge (Cross-Project)

**Context:** Developer working on different project (not k12-infra)

### Multi-Project Context Flow

```
Developer Context A: k12-infra
  ├─ APM loads: k12-infra/apm.yml
  └─ Gets: Global (16 agents, 16 prompts, 8 instructions) + K12 local
  └─ Result: @terraform-agent with K12 paths, Dapr, enrollment context

Developer Context B: different-project (e.g., k12-web-portal)
  ├─ APM loads: different-project/apm.yml
  ├─ Resolves dependency: tfxdevelopment/.github-private:2.0.0 (SAME global)
  ├─ Gets: Global (16 agents, 16 prompts, 8 instructions) + WEB portal local
  └─ Result: @dotnet-blazor-specialist with Blazor + portal-specific context

Developer Context C: third-project (e.g., k12-data-pipeline, Python-based)
  ├─ APM loads: third-project/apm.yml
  ├─ Resolves dependency: tfxdevelopment/.github-private:2.0.0 (SAME global)
  ├─ Plus: tfxdevelopment/.github-private/overrides/python-data.instructions.md
  ├─ Gets: Global agents (filtered for Python/data tools) + Python overrides
  └─ Result: @python-data-engineer with pipeline-specific context
```

### Implementation: Project-Specific APM Files

**Template File:** `.github-private/templates/apm.template.yml`

```yaml
name: {{ PROJECT_NAME }}
version: 1.0.0
description: {{ PROJECT_DESCRIPTION }}

dependencies:
  apm:
    - tfxdevelopment/.github-private:2.0.0   # ← Always get latest global
  mcp:
    - terraform              # Common to most projects
    - aspire-cli            # For .NET projects

# Project-specific instruction overrides
overrides:
  instructions:
    - {{ PROJECT_NAMESPACE }}-infrastructure-specifics  # Local file
  agents: []  # Inherit all global agents

scripts:
  {% if PROJECT_TYPE == "terraform" %}
  terraform:plan: "cd terraform && terraform plan"
  terraform:apply: "cd terraform && terraform apply"
  {% endif %}
  
  {% if PROJECT_TYPE == "dotnet" %}
  dotnet:build: "dotnet build"
  dotnet:test: "dotnet test"
  dotnet:deploy: "dotnet publish -c Release"
  {% endif %}
```

**How It Works:**

1. **Developer 1** in k12-infra runs `@terraform-agent`
   - APM merges: global terraform agent + k12 instructions
   - Result: Agent knows K12 module paths, environments, Dapr config

2. **Developer 2** in different-project runs `@terraform-agent`
   - APM merges: SAME global terraform agent + different-project instructions
   - Result: Agent knows different-project module paths, environments, specifics

3. **Both agents have identical capabilities** (Terraform MCP access, tools) but **different context** (project-specific knowledge)

### Context Propagation Diagram

```
Global Registry (.github-private/)       Project Layer (k12-infra/, different-project/)
    ├─ terraform.agent.md      ──┬──→ k12-infra/.github/copilot-instructions.md
    ├─ terraform MCP                │   (K12 module paths, Dapr, enrollment API)
    │                              │
    ├─ dotnet-cloud-specialist ────┴──→ different-project/.github/copilot-instructions.md
    │                              │   (Portal module paths, Blazor components, etc.)
    │                              │
    └─ instructions/            ──┴──→ Merged into agent context
       (azure patterns, etc.)
          
RESULT: 
  - Same agent template
  - Project-specific context automatically injected
  - No duplication of agent code
  - Context isolation (k12 projects use K12 instructions only)
```

---

## APM CLI Command Summary (For Team Reference)

| Command | Purpose | Context |
|---------|---------|---------|
| `apm install tfxdevelopment/.github-private` | One-time: fetch global registry | Anywhere |
| `apm use k12-infra` | Activate project context | In k12-infra directory |
| `@terraform-agent` | Call agent with merged context | After `apm use` |
| `@agent-name --help` | Show agent capabilities + context | Any agent |
| `/deploy` | Run workflow prompt with handoffs | In project directory |
| `apm list agents` | Show all available agents | Anywhere |
| `apm search azure` | Find agents/skills matching keyword | Anywhere |
| `apm update` | Refresh global registry from GitHub | Periodic maintenance |

---

## Decision Points for You

### D1: Context Merge Strategy
**Question:** Should local instructions *append* to global or *override* global?

- ✅ **RECOMMENDED: Append** (as shown above)
  - Pro: Global patterns + local specifics
  - Con: Agent gets verbose context
  
- ❌ **Alternative: Override**
  - Pro: Concise, no confusion
  - Con: Lose global patterns, must re-state in each project

**Your call?** Append or override?

---

### D2: Handoff Transparency
**Question:** Should APM CLI *announce* handoffs, or *silently* transition?

- ✅ **RECOMMENDED: Announce + Confirm**
  - Pro: Developer understands flow, can interrupt
  - Con: Extra step (confirmation)
  
- ❌ **Alternative: Silent**
  - Pro: Seamless user experience
  - Con: Developer may not understand why agent changed

**Your call?** Announce or silent?

---

### D3: MCP Error Handling
**Question:** If Terraform MCP server fails to start, what should happen?

- ✅ **RECOMMENDED: Warn + Fallback**
  - Pro: Agent can still help (just without MCP calls)
  - Con: Some capabilities unavailable
  
- ❌ **Alternative: Fail Hard**
  - Pro: Clear when MCP required but absent
  - Con: Blocks entire workflow

**Your call?** Warn or fail?

---

## Next Steps

1. **Validate Phase 1 & 2 findings** (dedup matrix, structure design)
2. **Confirm handoff scenarios** (A, B, C above)
3. **Decide D1-D3** (context merge, transparency, error handling)
4. **Lock APM configuration** (write `.github-private/.apm/cli-config.yaml`)
5. **Phase 3 ready:** Create `.github-private` repo scaffolding

