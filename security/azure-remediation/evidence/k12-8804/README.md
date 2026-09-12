# K12-8804 — k12-querybuilder-gateway package vulnerabilities

| File | Purpose |
|---|---|
| `k12-8804-fix.patch` | Unified diff against ADO `k12-query-builder` @ `development` (37222fe), 8 files: inline base image in `pipelines/templates/stages/docker-push.yml` and the 3 repo Dockerfiles → `aspnet:10.0-noble-chiseled-extra`; `<ContainerFamily>noble-chiseled-extra</ContainerFamily>` in the Gateway/Api/Dashboard csproj; `Microsoft.AspNetCore.OpenApi` 10.0.0 → 10.0.11 (Gateway, Api); OpenTelemetry.* 1.15.0 → 1.18.0 (ServiceDefaults). This is exactly what ADO PR 6024 contains (commits `dcdb98be` + `4a80bb57`). |
| `ADO-PR-draft-and-jira-comment.md` | Why the fix touches three image build paths, the PR description as posted, and the Jira comment draft (not posted). |
| `standup-brief.md` | Evidence summary with per-image counts, 30-second standup line, runner-image (K12-8497) scope. |
| `defender-package-assessments-2026-09-08.json` | Raw Defender package-level assessments (Resource Graph, read-only) for gateway/api/dashboard/runner — CVE ids, severities, fixed versions. Complete paginated export: 1,012 rows over 2 pages, ordered by target, resource id, name (replaces the earlier single-page 1,000-row export; totals unchanged). |

Status 2026-09-08: evidence complete; **ADO PR 6024 open as draft** — https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-query-builder/pullrequest/6024 (branch `fix/k12-8804-image-vulns`). No pipeline run yet (the repo has no PR-validation policy; `k12-query-builder.app` must be queued on the branch). Jira comment still **not** posted (Atlassian write needs approval). Runner image (K12-8497) is the next easy win.
