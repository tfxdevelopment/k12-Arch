# ADR Security Priority Roadmap (Based on Advisor Risk)

This roadmap identifies the **highest-value ADRs** to formalize first, based on current High/Medium risk concentration.

Companion input:
- `docs/advisor-development-security-summary.md`
- existing ADR: `docs/adr/0001-aca-gitops.md`

---

## Prioritization logic

Priority score is driven by:
1. Security impact (High before Medium)
2. Blast radius (subscription/platform-wide before single resource)
3. Repeatability (control can be enforced across all environments)
4. Deployment friction (lowest friction, highest risk reduction first)

---

## Proposed ADR sequence

## ADR-0002 — Subscription Security Baseline and Ownership Model

Why now:
- High findings include excess owners and risky principal posture.
- Multiple Defender plans are not enabled.

Decision scope:
- Max owner model, break-glass process, guest restrictions
- Mandatory Defender plans at subscription scope

Definition of done:
- Owner count <= 3
- No guest/disabled write-capable principals
- Required Defender plans enabled

## ADR-0003 — APIM Exposure and Endpoint Lifecycle Governance

Why now:
- APIM dominates finding count (unused endpoint flood).
- High findings exist for protocol hardening.

Decision scope:
- TLS-only API policies
- backend authentication enforcement
- endpoint lifecycle workflow (deprecate/disable/remove)
- subscription scope policy (no all-APIs subscription)

Definition of done:
- APIM High findings = 0
- documented endpoint lifecycle process
- deduped endpoint backlog triaged by owner

## ADR-0004 — Private Connectivity Default for Data Services

Why now:
- Storage/KV/SQL private access and network restrictions are repeated medium risks.

Decision scope:
- Private Link default for Storage, Key Vault, SQL
- firewall/network ACL baseline
- exception process for temporary public access

Definition of done:
- 100% private connectivity for target data services
- exception records for any temporary deviations

## ADR-0005 — Secret and Credential Management Standard

Why now:
- High/Medium findings include KV secret expiration and shared-key usage risks.

Decision scope:
- keyless-by-default design (managed identity)
- required secret expiration + rotation policy
- ban on plaintext secret values in IaC

Definition of done:
- secret expiration policy active
- no plaintext secrets in environment locals
- shared-key access disabled where workload-compatible

## ADR-0006 — Development Perimeter Hardening for Function and Foundry

Why now:
- High finding for internet-exposed function access controls.
- Medium findings for Foundry key/network posture.

Decision scope:
- ingress restrictions for function endpoints
- Foundry local-auth disablement
- Foundry private networking controls

Definition of done:
- function/network High findings closed
- Foundry medium findings closed

---

## Suggested ADR template fields (minimum)

For each ADR, include:
- Context (findings and affected resources)
- Decision
- Options considered and trade-offs
- Security impact
- Cost/operational impact
- Rollout plan
- Validation evidence (policy, query, scan, or deployment output)
- Exception handling

---

## Presentation flow for architecture/security review

1. Start with quantified risk (High/Medium totals).
2. Show control concentration (APIM + Storage + KV + subscription governance).
3. Present ADR sequence (0002→0006) with risk-reduction rationale.
4. Align each ADR to 30/60/90-day implementation waves.
5. Confirm ownership per ADR and acceptance criteria.

---

## Immediate next steps

1. Approve ADR sequence and owners.
2. Draft ADR-0002 and ADR-0003 first.
3. Attach Terraform/policy evidence links as ADR artifacts.
4. Add monthly risk trend snapshot to architecture governance cadence.
