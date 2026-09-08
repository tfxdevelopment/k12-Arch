# ADO PR draft — k12-query-builder → `development`

**Title:** `K12-8804: rebuild gateway/api/dashboard on chiseled aspnet:10.0 and bump vulnerable packages`

**Branch (proposed):** `fix/k12-8804-image-vulns` → target `development`

## Why
Defender for Cloud flags 34 vulnerable packages (15 High, max CVSS 9.8) on `k12-querybuilder-gateway`, and the identical set on `k12-querybuilder-api` and `k12-dashboard`. The running images (`development-844bf4c`, revision `patched0707`; `auditdemo-20260714`) were built in July from the floating `aspnet:10.0` tag and never rebuilt, so the base layer and the .NET runtime aged; two NuGet families are also behind.

| Layer | Finding | Fix in this PR |
|---|---|---|
| Ubuntu base layer — 30 pkgs (perl-base 9.8, glibc 9.1, libattr1 8.4, openssl/libssl3 7.5, util-linux ×7, pam ×4, systemd libs, ncurses ×4, tar, gzip, coreutils, libgcrypt20, libp11-kit0, libbz2, gpgv) | all have fixed versions in noble-updates | `FROM mcr.microsoft.com/dotnet/aspnet:10.0-noble-chiseled-extra` — chiseled images ship no shell/apt/perl/util-linux/pam/ncurses, removing those package classes permanently; `-extra` keeps ICU + tzdata for globalization |
| .NET runtime (`Microsoft.NETCore.App.Runtime.linux-x64`) — 9 CVEs, 8.2 | fixed 10.0.10/10.0.11 | rebuild pulls the current 10.0 runtime |
| `Microsoft.OpenApi` — High 7.5 (transitive via `Microsoft.AspNetCore.OpenApi` 10.0.0) | fixed 2.7.5 | `Microsoft.AspNetCore.OpenApi` 10.0.0 → **10.0.11** (depends on `Microsoft.OpenApi [2.7.5, 3.0.0)`) in Gateway + Api |
| `OpenTelemetry.Exporter.OpenTelemetryProtocol` 6.5, `OpenTelemetry.Api` 5.3 (transitive) | fixed 1.15.2 / 1.15.3 | OpenTelemetry family 1.15.0 → **1.18.0** (current stable, all five packages aligned) in ServiceDefaults |

## Files changed (6)
- `apps/K12.QueryBuilder.Gateway/Dockerfile`, `demo/K12.QueryBuilder.Api/Dockerfile`, `demo/K12.QueryBuilder.Dashboard/Dockerfile` — base image tag
- `apps/K12.QueryBuilder.Gateway/K12.QueryBuilder.Gateway.csproj`, `demo/K12.QueryBuilder.Api/K12.QueryBuilder.Api.csproj` — `Microsoft.AspNetCore.OpenApi` 10.0.11
- `apps/K12.QueryBuilder.ServiceDefaults/K12.QueryBuilder.ServiceDefaults.csproj` — OpenTelemetry.* 1.18.0

Patch: `k12-8804-fix.patch` (apply with `git apply` on a branch off `development`).

## Risk / review notes
- **Chiseled = no shell.** `docker exec … sh` and shell-based probes stop working; Container Apps HTTP health probes are unaffected. The Dockerfiles already run as `$APP_UID` with an exec-form `ENTRYPOINT ["dotnet", …]`, which is the supported shape. If anything needs a shell later, fall back to `10.0-noble` (still fixes today's findings; loses the permanent class removal).
- The `SecurityScan` stage (`dotnet list package --vulnerable`, fails on High) is the gate that would have caught the NuGet drift on a rebuild — it should now pass; if it reports anything new, that is a transitive we haven't seen in Defender yet and belongs in this PR.
- OpenTelemetry 1.15 → 1.18 is minor-version only; no API changes expected in `Extensions.ServiceDefaults`-style usage, but run the Gateway/Dashboard tests.
- Infra images (`infra/trino`, `infra/cube`, `infra/sqlserver`) are built by Aspire, not this PR; they carry no Defender package findings today.

## Verification (closure evidence for K12-8804)
1. Pipeline on `development`: `ci` → `SecurityScan` → `docker` (new immutable `development-<sha>` tags) → `deploy-aca` updates all three container apps.
2. Defender re-scans the new digests within ~24 h: the 34 `Update <pkg>` recommendations on `k12-querybuilder-gateway`, `-api` and `k12-dashboard` should drop to 0 (Resource Graph: `securityresources | where type == 'microsoft.security/assessments' | where properties.displayName startswith 'Update ' and tolower(tostring(properties.resourceDetails.Id)) has 'querybuilder'`).
3. Optional immediate check: `trivy image developmentk12acr.azurecr.io/k12-gateway:<new-tag>`.

## Follow-ups (not in this PR)
- Deploy by digest (`@sha256:`) instead of tag in `deploy-aca.yml`; purge superseded manifests from `developmentk12acr` so old digests stop being scanned.
- Gateway ingress is `external=true` ("Container Apps should not be exposed to the public internet", High) — remediation gap C2, separate change.
- Same rebuild pattern for `k12-ado-runner` (K12-8497): 80 packages / 121 CVEs across two Ubuntu generations in three ACRs.

---
# Jira comment draft for K12-8804 (paste after review — nothing posted)

Root cause confirmed from Defender package-level data (2026-09-08): the running gateway image (`development-844bf4c`, deployed 7 Jul) carries 34 vulnerable packages — 30 in the Ubuntu base layer (perl-base 9.8, glibc 9.1, openssl 7.5, util-linux 7.0 …; all fixed in noble-updates), 9 CVEs in the .NET 10 runtime (fixed in 10.0.10+), and two NuGet families (Microsoft.OpenApi via Microsoft.AspNetCore.OpenApi 10.0.0; OpenTelemetry 1.15.0). `k12-querybuilder-api` and `k12-dashboard` share the base and show the same set.

Fix (PR to `development`): base image → `aspnet:10.0-noble-chiseled-extra` (removes the shell/perl/util-linux package classes for good), `Microsoft.AspNetCore.OpenApi` → 10.0.11, OpenTelemetry → 1.18.0; one pipeline run rebuilds and redeploys all three images. Closure evidence = Defender re-scan of the new digests → 0 package findings on the three apps. Follow-ups tracked separately: deploy-by-digest + ACR manifest purge, the gateway external-ingress finding, and the runner image (K12-8497).
