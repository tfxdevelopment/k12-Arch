<!-- markdownlint-disable-file -->

# Task Research Notes: k12-Arch .NET Solution References vs On-Disk Structure

## Research Executed

### File Analysis

- k12-Arch/K12.Aspire.sln
  - References projects at `src\K12.AppHost\K12.AppHost.csproj`, `src\K12.ServiceDefaults\K12.ServiceDefaults.csproj`, `src\K12.Docs.Api\K12.Docs.Api.csproj`.
- k12-Arch/src/
  - Directory contains only `.claude/` and `.github/` in this workspace; no referenced `K12.*` project folders exist.
- k12-Arch/WORKSPACE-MODERNIZATION-COMPLETE.md
  - Documents an intended `src/` layout that includes `K12.AppHost`, `K12.ServiceDefaults`, and `K12.Docs.Api`.

### Code Search Results

- `**/*.csproj`
  - No matches found in workspace.
- `K12\.AppHost|K12\.ServiceDefaults|K12\.Docs\.Api`
  - Found in documentation files and in `K12.Aspire.sln`, but not in any `.csproj` (none exist in this workspace).

### External Research

- #fetch:https://learn.microsoft.com/en-us/azure/architecture/patterns/async-request-reply
  - Not used for this specific structure mismatch investigation.

### Project Conventions

- Standards referenced: Aspire/AppHost naming conventions as documented in repo markdown.
- Instructions followed: Task Researcher mode constraints (research-only; `.copilot-tracking/research/` only).

## Key Discoveries

### Project Structure

The repo contains solution files and extensive documentation that assume Aspire projects exist under `src/`, but the workspace contains no `.csproj` files and the `src/` folder does not contain the referenced projects.

### Implementation Patterns

This mismatch affects:

- Onboarding instructions that direct developers to `cd src/K12.AppHost` and run `dotnet` commands.
- Any proposed “.NET project structure plan” that tries to refine an already-existing structure, when the underlying projects are missing in this workspace.

### Complete Examples

```text
Evidence:
- K12.Aspire.sln references:
  - src\K12.AppHost\K12.AppHost.csproj
  - src\K12.ServiceDefaults\K12.ServiceDefaults.csproj
  - src\K12.Docs.Api\K12.Docs.Api.csproj
- Workspace contains no `*.csproj` files.
- Workspace `src/` contains only `.claude/` and `.github/`.
```

### API and Schema Documentation

Not applicable for this structure mismatch investigation.

### Configuration Examples

```text
Not applicable for this structure mismatch investigation.
```

### Technical Requirements

- Documentation and repo structure guidance must reflect the actual scope and contents of this repo (docs-only vs docs+code).
- Solution files should not reference non-existent project paths unless explicitly treated as placeholders.

## Recommended Approach

Pick one source-of-truth for what this repo contains, then align docs and solution artifacts to it:

- If runtime code should exist here: plan includes scaffolding the missing `src/K12.*` projects to match solutions + docs.
- If runtime code is out-of-scope for this repo: plan includes removing or clearly labeling the solution references, and updating onboarding docs to point to the correct repository/location.

## Implementation Guidance

- **Objectives**: resolve doc↔filesystem contradictions before proposing detailed .NET structure changes.
- **Key Tasks**: confirm repo scope; align solution files and onboarding docs to that scope.
- **Dependencies**: confirmation from repo owners on whether Aspire runtime code belongs in this repo.
- **Success Criteria**: no documentation paths or solution references that lead to missing files/directories.
