# ADO PR 6024 — k12-query-builder → `development` (K12-8804)

> **Status 2026-09-08:** draft PR open — https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-query-builder/pullrequest/6024
> Branch `fix/k12-8804-image-vulns` off `development` @ `37222fe`; commits `dcdb98be` (Dockerfiles + NuGet bumps) and `4a80bb57` (docker-push.yml inline base image, `ContainerFamily` in the three service csproj files, corrected comments). 8 files, +31/−11 — see `k12-8804-fix.patch`.
> PR text, commit messages and branch content carry no tooling attribution (repo convention). The description is condensed to fit ADO's 4,000-character limit.

**Title:** `K12-8804: rebuild gateway/api/dashboard on chiseled aspnet:10.0 and bump vulnerable packages`

## Why the PR touches three places (found while opening it)

The repo has three image build paths on `development`, and only one of them uses the repo Dockerfiles:

| Path | Where | Base before | Tag scheme | Change in the PR |
|---|---|---|---|---|
| `docker` stage | `pipelines/templates/stages/docker-push.yml` writes an inline Dockerfile from the CI publish artifacts and pushes `k12-querybuilder-api`, `k12-querybuilder-gateway`, `k12-dashboard` | `aspnet:10.0`, hard-coded in the YAML | `{branch}-{sha}` — matches the live gateway tag `development-844bf4c` | inline `FROM` → `aspnet:10.0-noble-chiseled-extra` |
| `az acr build` fallback | `app-deploy.yml`, only when `aspire deploy` hits the RBAC block; builds with the repo Dockerfiles | `aspnet:10.0` in the Dockerfiles | `sha-{gitsha}` | Dockerfiles → chiseled-extra |
| `aspire deploy` (SDK container publish) | `AddProject<…>` in `AppHostExtensions.cs`; the SDK infers `aspnet:10.0` unless the csproj says otherwise | SDK default | Aspire | `<ContainerFamily>noble-chiseled-extra</ContainerFamily>` in the Gateway, Api and Dashboard csproj |

Also found: `pipelines/templates/stages/deploy-aca.yml` is not referenced by `azure-pipelines.app.yml` and names `k12-gateway` / `k12-query-api`, while the live apps and `docker-push.yml` use `k12-querybuilder-*` — a legacy template, listed as a follow-up. The app pipeline (`k12-query-builder.app`, definition 68) last ran 2026-05-11 (all stages green); the live July images were not produced by it, and the repo has no PR-validation build policy, so nothing ran for PR 6024. The self-hosted pool `k12-development-pool` had 3 agents online on 2026-08-31.

Chiseled caveat (from the `dotnet-docker` `runtime-deps/10.0/noble-chiseled-extra` Dockerfile): the image still contains `base-files`, `ca-certificates`, `libc6`, `libgcc-s1`, `libicu74`, `libssl3t64`, `libstdc++6` and `tzdata`. It removes the shell/apt/perl/util-linux/pam/ncurses/coreutils classes (most of today's 30 base-layer findings) but not glibc or openssl, so the images still need regular rebuilds on a current base.

## PR description (as posted on ADO)

## Why

Defender for Cloud flags vulnerable packages on the three QueryBuilder images: `k12-querybuilder-gateway` 34 packages / 15 High (max CVSS 9.8), `k12-querybuilder-api` 33 / 15, `k12-dashboard` 33 / 14. Same base-layer and runtime findings; the delta is per-app NuGet packages. The running images (`k12-querybuilder-gateway:development-844bf4c`, revision `patched0707`; api/dashboard `auditdemo-20260714`) date from July and were not produced by the current pipeline (`k12-query-builder.app` last ran 2026-05-11), so the base layer and runtime aged in place.

| Layer | Finding | Fix |
|---|---|---|
| Ubuntu base layer, 30 packages (perl-base 9.8, glibc 9.1, openssl 7.5, util-linux, pam, ncurses ...) | fixed in noble-updates | `aspnet:10.0-noble-chiseled-extra`: no shell/apt/perl/util-linux/pam/ncurses/coreutils in the final layer. glibc, openssl, ICU and tzdata remain, so regular rebuilds are still required |
| .NET runtime, 9 CVEs, 8.2 | fixed in 10.0.10/10.0.11 | rebuild pulls the current 10.0 runtime |
| `Microsoft.OpenApi` 7.5 via `Microsoft.AspNetCore.OpenApi` 10.0.0 (gateway, api) | fixed in 2.7.5 | `Microsoft.AspNetCore.OpenApi` -> 10.0.11 |
| `OpenTelemetry.Exporter.OpenTelemetryProtocol` 6.5, `OpenTelemetry.Api` 5.3 (gateway) | fixed in 1.15.2 / 1.15.3 | OpenTelemetry family 1.15.0 -> 1.18.0 (ServiceDefaults) |

## Changes

The repo has three image build paths; the base image changes in all three so the fix holds whichever one runs.

- `pipelines/templates/stages/docker-push.yml`: the inline Dockerfile the `docker` stage writes from CI publish artifacts (the `{branch}-{sha}` tag scheme of the live gateway image) now starts `FROM aspnet:10.0-noble-chiseled-extra`.
- `apps/K12.QueryBuilder.Gateway/Dockerfile`, `demo/K12.QueryBuilder.Api/Dockerfile`, `demo/K12.QueryBuilder.Dashboard/Dockerfile`: same base (used by the `az acr build` fallback in app-deploy.yml and local builds).
- Gateway / Api / Dashboard csproj: `<ContainerFamily>noble-chiseled-extra</ContainerFamily>` so the SDK/Aspire container publish (`aspire deploy`) resolves the same base instead of the default `aspnet:10.0`.
- Gateway and Api csproj: `Microsoft.AspNetCore.OpenApi` 10.0.11. ServiceDefaults csproj: `OpenTelemetry.*` 1.18.0.

No pipeline flow or infra changes; Trino, Cube and SQL Server images are unaffected.

## Validation

- Applies cleanly on `development` @ 37222fe.
- `aspnet:10.0.11-noble-chiseled-extra` confirmed on MCR; `Microsoft.AspNetCore.OpenApi` 10.0.11 and `OpenTelemetry.*` 1.18.0 confirmed on nuget.org.
- Not yet run: `k12-query-builder.app` on this branch. `SecurityScan` (`dotnet list package --vulnerable`, fails on High) should pass; anything it still reports belongs in this PR.

## Closure evidence for K12-8804

1. After merge, `k12-query-builder.app` on `development` pushes new `development-<sha>` tags for the three repos and Deploy -> development rolls them out.
2. Defender re-scans the new digests within about 24 h: the `Update <package>` assessments on the three container apps drop to 0 (Resource Graph `securityresources`, displayName starts with `Update `).
3. Optional immediate check: `trivy image developmentk12acr.azurecr.io/k12-querybuilder-gateway:<new-tag>`.

## Review Notes

Intentionally draft until the first pipeline run on the branch is reviewed.

- Chiseled means no shell: `docker exec ... sh` stops working; Container Apps HTTP probes are unaffected; the images already run as `$APP_UID` with an exec-form `ENTRYPOINT`. If a shell is needed later, `10.0-noble` still fixes today's findings.
- OpenTelemetry 1.15 -> 1.18 is minor-version only; run the Gateway and Dashboard tests.

Follow-ups, not in this PR: `deploy-aca.yml` is unreferenced and names `k12-gateway` / `k12-query-api` while the live apps and `docker-push.yml` use `k12-querybuilder-*`; deploy by digest and purge old manifests; the gateway `external=true` ingress finding; the same rebuild for `k12-ado-runner` (K12-8497).

---
# Jira comment draft for K12-8804 (paste after review — nothing posted)

PR (draft): https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-query-builder/pullrequest/6024

Root cause confirmed from Defender package-level data (2026-09-08): the running gateway image (`k12-querybuilder-gateway:development-844bf4c`, revision `patched0707`, deployed 7 Jul) carries 34 vulnerable packages (15 High, max CVSS 9.8): 30 in the Ubuntu base layer (perl-base 9.8, glibc 9.1, openssl 7.5, util-linux 7.0 …; all fixed in noble-updates), 9 CVEs in the .NET 10 runtime (fixed in 10.0.10+), plus Microsoft.OpenApi (via Microsoft.AspNetCore.OpenApi 10.0.0) and OpenTelemetry 1.15.0. `k12-querybuilder-api` (`auditdemo-20260714`) shows 33 packages / 15 High and `k12-dashboard` (`auditdemo-20260714`) 33 / 14 — the same base-layer and runtime set; the delta is per-app NuGet packages.

Fix (draft PR 6024 to `development`): base image → `aspnet:10.0-noble-chiseled-extra` in all three build paths (docker-push.yml inline Dockerfile, repo Dockerfiles, SDK/Aspire `ContainerFamily`), `Microsoft.AspNetCore.OpenApi` → 10.0.11, OpenTelemetry → 1.18.0. Chiseled removes the shell/apt/perl/util-linux/pam/ncurses package classes; glibc/openssl/ICU/tzdata remain, so images still need regular rebuilds. Closure evidence = merge + one `k12-query-builder.app` run on development, then a Defender re-scan of the new digests → 0 `Update <package>` findings on the three container apps. Follow-ups tracked separately: deploy-by-digest + ACR manifest purge, the unreferenced deploy-aca.yml naming mismatch, the gateway external-ingress finding, and the runner image (K12-8497).
