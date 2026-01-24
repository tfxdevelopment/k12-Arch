<!-- markdownlint-disable-file -->

# Task Research Notes: Sensei PDF Concerns → Coverage → Needed Updates

## Research Executed

### File Analysis

- k12-Arch/.copilot-tracking/research/20260120-sensei-pdf-keyword-extract.md
  - Keyword-snippet extract used to identify concerns/risks/issues/recommendations (52 pages scanned, 30 pages with keyword hits).
- k12-Arch/wiki/09-proposed-architecture/OPS-messaging.md
  - Runbook for Service Bus operations: naming/topology standards, envelope fields, observability, DLQ handling, replay guidance.
- k12-Arch/wiki/adr/ADR-PROP-azure-service-bus-standard.md
  - Proposed ADR standardizing on Azure Service Bus; includes DLQ policy, idempotency, naming, KEDA alignment, Dapr pub/sub component reference.
- k12-Arch/wiki/adr/ADR-PROP-event-schema-versioning.md
  - Proposed ADR defining event envelope, semantic versioning policy, contract testing guidance, idempotency.
- k12-Arch/PIPELINE-ARCHITECTURE.md
  - Documents a pipeline container security step: “Scan for vulnerabilities (Trivy)”.

### Code Search Results

- `Elton`
  - Found in Sensei PDF extract as revision author (“Elton Trotman”), not as a concern/risk.
- `202 Accepted|dead.?letter|DLQ`
  - Found in wiki documentation, including DLQ guidance and async patterns.
- `\bgitleaks\b`
  - Not found outside Sensei PDF extract.
- `\bpact\b`
  - Not found outside Sensei PDF extract.

### External Research

- #fetch:https://learn.microsoft.com/en-us/azure/architecture/patterns/async-request-reply
  - `202 Accepted` guidance (verified): return quickly, provide `Location` header for status endpoint, optionally `Retry-After`.
  - Status endpoint behavior (verified): while pending return `200` with in-progress state; on completion can redirect (`302`/`303`) to created resource.

### Project Conventions

- Standards referenced: wiki ADR style and directory structure; runbook operational documentation style.
- Instructions followed: Task Researcher mode constraints (research-only; `.copilot-tracking/research/` only).

## Key Discoveries

### Project Structure

Sensei’s extract includes operational and engineering-enablement expectations (golden onboarding path, strong CI gates). This repo has strong *documentation* for messaging operations but lacks evidence of some tool enforcement outside the PDF extract.

### Implementation Patterns

Messaging + eventing patterns are comparatively well-covered in the wiki/ADR set. CI “quality gates” and tooling enforcement for secrets scanning and contract testing are comparatively under-documented.

### Complete Examples

```text
Verified coverage examples:
- Service Bus ops runbook exists: wiki/09-proposed-architecture/OPS-messaging.md
- Service Bus standard ADR exists: wiki/adr/ADR-PROP-azure-service-bus-standard.md
- Event schema/versioning ADR exists: wiki/adr/ADR-PROP-event-schema-versioning.md
- Trivy scanning is documented in pipeline architecture: PIPELINE-ARCHITECTURE.md
```

### API and Schema Documentation

The event envelope and versioning requirements are explicitly documented in `wiki/adr/ADR-PROP-event-schema-versioning.md` and reinforced in `wiki/09-proposed-architecture/OPS-messaging.md`.

### Configuration Examples

```text
Not extracted as concrete repo config in this research pass.
```

### Technical Requirements

From the Sensei PDF extract (summarized based on keyword snippets):

- Use async patterns (Service Bus) to handle long-running operations and avoid synchronous API scaling failures.
- Treat DLQ handling and replay/quarantine as first-class operational processes.
- Manage event-driven risks (debuggability, idempotency, error handling).
- Maintain strict enablement targets: fast onboarding, consistent quality gates, secrets discipline, observability baselines.

## Recommended Approach

Produce a single, prioritized “Concern/Risk → Coverage → Needed Updates” checklist focused on minimal additions to close gaps.

### Checklist (Derived from Sensei Extract, Linked to Verified Coverage)

| Sensei concern/risk (from PDF extract) | Coverage in repo (verified) | Needed updates (doc or repo decision) |
|---|---|---|
| Async request-reply for long-running operations; `202 Accepted` status + background worker | Wiki contains multiple `202 Accepted` examples; Service Bus standards and ops runbook exist | Consolidate into one canonical guide: status endpoint conventions, `Location`/`Retry-After`, error persistence, and client polling expectations. |
| Service Bus standardization (DLQ, sessions, fan-out, KEDA) | `wiki/adr/ADR-PROP-azure-service-bus-standard.md`; `wiki/09-proposed-architecture/OPS-messaging.md` | Ensure onboarding/root docs point to these as canonical; identify and label any carve-outs (e.g., Storage Queues). |
| Event envelope + schema versioning + contract testing + idempotency | `wiki/adr/ADR-PROP-event-schema-versioning.md`; envelope fields also in ops runbook | Add a concrete “how we run contract tests” guide; decide whether Pact is the standard tool (Sensei mentions it; repo evidence does not). |
| DLQ handling and replay/quarantine procedures | `wiki/09-proposed-architecture/OPS-messaging.md` | Add ownership/SLO expectations for DLQ triage and replay; add guidance for redacting PII when capturing message samples. |
| Event-driven failure modes (debugging, idempotency, error handling) | Runbook includes tracing and idempotency guidance | Add a dedicated “failure modes” page: tracing strategy, poison message policy, replay safety, incident workflow. |
| Secrets scanning (Gitleaks) as a gate | No repo evidence outside Sensei extract | Document the intended secrets-scanning tool and where it runs (local + CI). |
| Contract testing tooling (Pact) as a gate | No repo evidence outside Sensei extract | Decide and document the intended contract testing tool and pipeline gate behavior. |
| Container scanning (Trivy) | `PIPELINE-ARCHITECTURE.md` | Add details: where Trivy runs, failure thresholds, and triage workflow. |
| Onboarding “golden path” (≤ 60 minutes) | Sensei extract describes targets; repo has multiple onboarding narratives but also has path mismatches (see separate structure research note) | Establish one canonical onboarding doc that matches repo reality (docs-only vs docs+code). |

## Implementation Guidance

- **Objectives**: make Sensei concerns traceable to canonical docs and explicit decisions.
- **Key Tasks**: consolidate async operation guidance; document CI gates; resolve tooling decisions (Gitleaks/Pact) and document them.
- **Dependencies**: confirmation from owners about CI tool choices and repo scope.
- **Success Criteria**: every checklist item links to a current, canonical doc (and no onboarding dead paths remain).
