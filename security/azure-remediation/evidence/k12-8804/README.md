# K12-8804 — k12-querybuilder-gateway package vulnerabilities

| File | Purpose |
|---|---|
| `k12-8804-fix.patch` | Unified diff against ADO `k12-query-builder` @ `development` (37222fe): 3 Dockerfiles → `aspnet:10.0-noble-chiseled-extra`; `Microsoft.AspNetCore.OpenApi` 10.0.0 → 10.0.11 (Gateway, Api); OpenTelemetry.* 1.15.0 → 1.18.0 (ServiceDefaults). `git apply --check` passes against the snapshot. |
| `ADO-PR-draft-and-jira-comment.md` | PR title/body for the ADO PR (target `development`) + the Jira comment draft (not posted). |
| `standup-brief.md` | Evidence summary, 30-second standup line, runner-image (K12-8497) scope. |
| `defender-package-assessments-2026-09-08.json` | Raw Defender package-level assessments (Resource Graph, read-only) for gateway/api/dashboard/runner — CVE ids, severities, fixed versions. |

Status 2026-09-08 (updated): **ADO PR 6024 opened as draft** — [https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-query-builder/pullrequest/6024](https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-query-builder/pullrequest/6024), branch `fix/k12-8804-image-vulns` @ `dcdb98be` (parent `37222fe`, 6 files, +19/−10). No pipeline run yet (repo has no PR validation policy; `ci`/`SecurityScan` must be queued on the branch). Jira comment still **not** posted (Atlassian write needs approval). Runner image (K12-8497) is the next easy win.
