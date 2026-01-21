# Plan: Documentation Completion Strategy

This plan optimizes the completion of 31 pending documentation stubs by grouping them into domain-specific batches and leveraging specialized agents for context gathering and drafting.

### Steps
1.  **Phase 1: Frontend Architecture (FE-01..05)** (5 Docs)
    *   Target: `FE-01` (Nx), `FE-02` (Libs), `FE-03` (Components), `FE-04` (State), `FE-05` (Routing).
    *   Agent: `frontend-developer` (Context gathering) + `documentation-expert` (Drafting).
    *   Action: Analyze `nx.json`, `package.json`, and `apps/` structure to populate TBDs.

2.  **Phase 2: Backend & Standards (BE-01..04, STD-01..04)** (8 Docs)
    *   Target: `BE-01` (Layered Arch), `BE-02` (API Patterns), `STD-02` (Coding Stds).
    *   Agent: `dotnet-core-expert` (Context) + `documentation-expert` (Drafting).
    *   Action: Analyze `.editorconfig`, `Directory.Build.props`, and API controllers to define patterns.

3.  **Phase 3: Data & Integrations (DATA-01..04)** (4 Docs)
    *   Target: `DATA-01` (Flows), `DATA-02` (ADLS), `DATA-03` (Retention), `DATA-04` (Backup).
    *   Agent: `MS-SQL Database Administrator` (Context) + `documentation-expert` (Drafting).
    *   Action: Analyze `persistence` layers and `infra/terraform` modules for data configuration.

4.  **Phase 4: Operations & Deployment (DEPLOY-01..04, OPS-01..04)** (8 Docs)
    *   Target: `DEPLOY-01` (Topology), `DEPLOY-03` (CI/CD), `OPS-01` (Defender).
    *   Agent: `deployment-engineer` (Context) + `documentation-expert` (Drafting).
    *   Action: Analyze `azure-pipelines.yml`, Terraform files, and Dockerfiles.

5.  **Phase 5: C4 Level-4 Deep Dives (C4-05..08)** (4 Docs)
    *   Target: Sequence diagrams for key flows (Enrollment, Authorization).
    *   Agent: `architect-reviewer` (Analysis & Validation).
    *   Action: Trace code execution paths to generate accurate Mermaid diagrams.

### Further Considerations
1.  **Optimization**: Can we combine Phase 1 & 2? (No, keep separate to manage context window effectively).
2.  **Verification**: After each phase, run `DOCUMENTATION-HEALTH-REPORT.md` update generation to track progress?
3.  **Source of Truth**: Enforce strict rule: "Code is truth." Agents must cite file paths when replacing TBDs.
