# Development Environment Security Findings (Reverse Breakdown)

Source: `docs/Advisor_2026-02-27T20_40_22.970Z.csv`

## Executive snapshot

- **Total findings**: 1,434
- **High**: 24
- **Medium**: 50
- **Low**: 1,360

Most findings are concentrated in the `development` resource group and heavily skewed by unused APIM endpoint recommendations.

---

## 1) What is driving volume?

## Recommendation volume leaders

| Count | Recommendation |
|---:|---|
| 1334 | API endpoints that are unused should be disabled and removed from Azure API Management |
| 10 | [Enable if required] Storage accounts should use CMK |
| 7 | Storage account should use a private link connection |
| 7 | Storage accounts should prevent shared key access |
| 6 | Access to storage accounts with firewall/VNet should be restricted |

## Type concentration

| Count | Resource Type |
|---:|---|
| 1334 | API Collection Detail |
| 38 | Storage Account |
| 18 | Key vault |
| 13 | Subscription |
| 12 | Api Management |

## Resource group concentration

| Count | Resource Group |
|---:|---|
| 1402 | development |
| 19 | k12-infra |
| 13 | No resource group (subscription-scoped findings) |

---

## 2) APIM unused endpoint finding (de-duplicated view)

- Raw APIM-unused findings: **1,334**
- Unique endpoint resources impacted: **258**

Top repeated endpoint names (sample):

| Count | Endpoint Name |
|---:|---|
| 15 | `getenrollmentsession` |
| 13 | `getallprograms` |
| 13 | `getenrollmentsessionprompt` |
| 13 | `deleteprogram` |
| 13 | `submitpromptdata` |
| 12 | `deactivateprogramasync` |
| 12 | `getping` |

Interpretation:
- This is likely the single biggest noise source in the report.
- Treat as a **hygiene backlog** with deduplication and usage evidence before removal.

---

## 3) High-impact findings (what to fix first)

## Identity & subscription governance

- A maximum of 3 subscription owners should be designated.
- Guest/disabled accounts with owner or write permissions should be removed.

## Defender coverage gaps

- Microsoft Defender for Containers should be enabled.
- Microsoft Defender for APIs should be enabled.
- Microsoft Defender for Azure SQL should be enabled.
- Microsoft Defender for Key Vault should be enabled.
- Microsoft Defender for Resource Manager should be enabled.

## API and app exposure

- APIM APIs should use only encrypted protocols.
- Internet-exposed Function App should use restricted network access.

## Secret lifecycle

- Key Vault secrets should have expiration dates.

---

## 4) Medium-impact findings by control domain

## Network boundary and private connectivity

- Storage accounts should use Private Link.
- Storage accounts should restrict network access via VNet/firewall rules.
- Key Vaults should use Private Link and firewall.
- APIM should use VNet and disable public service-configuration endpoints.
- SQL should use Private Endpoint and disable public network access.

## Credential and auth posture

- Storage accounts should prevent shared key access.
- SQL should enable AAD-only authentication.
- APIM named-value secrets should be sourced from Key Vault.

## Deletion safety and resilience

- Key Vault soft-delete + purge protection / deletion protection findings present.

## AI/Foundry hardening

- Foundry resources should disable local auth keys.
- Foundry resources should restrict network access and use Private Link.

---

## 5) Reverse-BR remediation buckets (presentation-ready)

## Bucket A — Subscription guardrails (High)

Owner: Platform Security

Actions:
1. Reduce owner count to <= 3.
2. Remove guest/disabled write-capable principals.
3. Turn on Defender plans for Containers/APIs/SQL/KV/RM.

Success criteria:
- No High findings in subscription governance/Defender categories.

## Bucket B — Data perimeter (High/Medium)

Owner: Infra Engineering

Actions:
1. Private Link + firewall controls for Storage + Key Vault + SQL.
2. Disable storage shared key access where workload-compatible.
3. Enable KV deletion/purge protections uniformly.

Success criteria:
- All Storage/KV/SQL medium findings closed or exception-approved.

## Bucket C — API edge hardening (High/Medium)

Owner: API Platform Team

Actions:
1. Remove/disable unused APIM endpoints (deduped 258 endpoint set).
2. Enforce TLS-only and backend auth in APIM.
3. Remove all-APIs subscription scope.

Success criteria:
- APIM high findings closed.
- APIM unused endpoint backlog reduced by >80% in first wave.

## Bucket D — Function + Foundry exposure (High/Medium)

Owner: Application Platform

Actions:
1. Restrict Function App network ingress.
2. Foundry: disable local auth keys, restrict network, add Private Link.

Success criteria:
- No High findings for internet-exposed function networking.
- Foundry medium findings closed.

---

## 6) 30/60/90-day execution plan

## 0-30 days (critical risk)

- Subscription owners/guest cleanup
- Defender plan enablement
- APIM protocol and backend-auth hardening
- Key Vault secret expiration policy rollout

## 31-60 days (perimeter hardening)

- Storage/KV/SQL Private Link + network restrictions
- Shared-key access disablement where feasible
- APIM scope tightening and endpoint cleanup wave 1

## 61-90 days (stabilize + optimize)

- APIM endpoint cleanup wave 2
- Exception governance and policy-as-code baselining
- KPI dashboard and recurring Advisor trend review

---

## 7) Suggested KPI slide

- High findings open (target: 0)
- Medium findings open (target: <10)
- APIM unused endpoint backlog (target: <50 unique)
- Private Link coverage for Storage/KV/SQL (target: 100%)
- Defender plan coverage (target: 100% of required plans)
