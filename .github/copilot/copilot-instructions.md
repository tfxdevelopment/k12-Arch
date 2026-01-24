# GitHub Copilot Instructions

## Priority Guidelines
1. **Version compatibility**: Use the exact versions declared below; do not suggest APIs beyond those versions.
2. **Context order**: Prefer this file. If code appears later, mirror patterns from that code before adding new practices.
3. **Architectural consistency**: Stay within a layered architecture, orchestrated with Aspire; keep clear boundaries between presentation, application, domain, and infrastructure. Use event/messaging patterns only where already documented.
4. **Code quality**: Optimize for maintainability, performance, security, accessibility, and testability.
5. **No invention**: If a pattern is not observed or documented, avoid introducing it. Prefer minimal, idiomatic solutions aligned to declared stack.
6. **Always suggest next steps**: After providing code or guidance, include concise, actionable next-step recommendations (e.g., tests to run, files to check, follow-up docs to update), tailored to the change context.
7. **Summarize changes**: When proposing edits, include a brief change summary (scope, files, key decisions) to aid review.
8. **Delegate to the right agent**: For non-trivial tasks, explicitly call or recommend the appropriate specialized agent (e.g., backend/dotnet, frontend/Angular, documentation) before or alongside execution.
9. **Look up prior art**: Before generating code, search existing repo instructions and nearby code samples for the declared tech stack (Aspire/.NET 10, Angular 19/Nx 21, Next/React). Align output to those patterns.

## Technology Versions (Declared)
- **.NET SDK**: 10.x (target)
- **Aspire**: 13.x
- **OpenTelemetry**: 1.9.x (baseline from prior props; keep compatible with .NET 10)
- **Frontend (Angular)**: Angular 19.x, Nx 21.x, TypeScript 5.x, Angular Material 19.x, PrimeNG 17.x, MSAL Angular 4.x
- **Docs app**: Next 15.1.x, React 19.x, TypeScript ^5
- **Testing (documented)**: MSTest (backend), Jest (frontend)
- **Versioning**: Semantic Versioning

If future code shows different pinned versions, align to the code over these declarations.

## Context Files
- This file is the current source of truth. If additional guidance files are added under `.github/copilot/`, respect them in order of specificity.

## Architecture & Boundaries
- Layered: UI / Application / Domain / Infrastructure; keep dependencies flowing inward only.
- Aspire: Treat as orchestration for local/dev; keep service definitions and configuration consistent; prefer configuration over code for wiring when feasible.
- Messaging/event usage: Only add if explicitly present in existing code or docs; do not introduce new buses or topics unbacked by references.

## Code Quality Standards
### Maintainability
- Keep functions cohesive and small; prefer clear naming over comments.
- Follow established dependency direction (no infrastructure references in domain).
- Use DI for external dependencies; avoid static service locators.

### Performance
- Avoid premature allocation; prefer async I/O over blocking calls.
- When adding caching or resilience, match existing library choices once code is available; otherwise keep implementations minimal.

### Security
- Default deny: enforce authentication/authorization at entry points.
- Use parameterized queries/ORM-safe access when data code exists; avoid string concatenation for SQL.
- Never hardcode secrets; reference environment/config.

### Accessibility (Frontend)
- Use semantic HTML and ARIA patterns matching Angular Material/PrimeNG defaults.
- Ensure focus management and keyboard operability for interactive elements.
- Maintain color/contrast suitable for WCAG 2.2 AA.

### Testability
- Write code that is DI-friendly; avoid hidden time/IO singletons.
- Prefer unit + integration patterns already present (MSTest/Jest). Avoid inventing E2E unless required.

## Documentation Requirements
- Standard: mirror existing comment density; document non-obvious behavior, public APIs, and tricky invariants. Avoid redundant comments.

## Testing Approach
- **Unit**: Mirror naming/style of MSTest when backend code is present; keep tests isolated and deterministic.
- **Integration**: When adding integration tests, follow existing data setup/teardown once visible; keep external calls stubbed/faked unless an environment is already defined.
- **E2E/BDD**: Do not add unless patterns emerge in the repo.

## Technology-Specific Guidance
### .NET
- Target .NET 10 features only. Use async/await; avoid blocking on Tasks.
- Respect Aspire hosting conventions; keep service wiring declarative when possible.
- Follow DI and logging patterns once code is visible; until then, prefer ILogger<T> and minimal middleware.

### Angular / Nx
- Use Angular 19 syntax; standalone components where appropriate per Angular guidance.
- Keep Nx workspace conventions once visible; avoid cross-domain imports that violate tagging (enforce when tags/config appear).
- Use RxJS patterns consistent with Angular 19; prefer Observables over Promises in Angular services.

### React / Next (Docs app)
- Align to Next 15 + React 19; use app/router conventions per current Next version.
- Type components with TypeScript; avoid legacy default props patterns.

## Version Control & Release
- Follow Semantic Versioning; document breaking changes clearly.
- Keep changelog/release notes in the existing format when one appears.

## Codebase Analysis Instructions
- Before generating code for a given area, scan nearby files for naming, logging, error handling, validation, and testing patterns. If no examples exist, choose minimal, idiomatic patterns for the declared stack and note assumptions in comments sparingly.

## Known Gaps (Pending Source Sync)
- No backend/Angular source files are present in this repo snapshot. Patterns for DI, logging, error handling, validation, and routing should be confirmed and this file updated after code is added or synchronized.
- Angular/Nx versions are declared from documentation; adjust to actual workspace files once available.

## Project-Specific Guidance
- Respect existing architectural boundaries and environments defined by Aspire/Terraform when those files become available.
- Avoid introducing new frameworks or major dependencies not already declared.
- When uncertain, prefer consistency with documented versions and minimal patterns until real code can be referenced.
