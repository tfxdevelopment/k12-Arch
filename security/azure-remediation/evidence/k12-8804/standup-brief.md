# K12-8804 — k12-querybuilder-gateway package vulnerabilities (evidence pack, 2026-09-08)

> **Update 2026-09-08:** fix is up as draft ADO PR 6024 (https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-query-builder/pullrequest/6024), commits `dcdb98be` + `4a80bb57`. Waiting on a `k12-query-builder.app` run on the branch (no PR-validation policy exists, so it must be queued), then un-draft → merge → Defender re-scan for closure.

Source: Defender for Cloud package-level assessments via Azure Resource Graph (read-only), sub K12 Azure, RG development — complete paginated export (1,012 rows) in `defender-package-assessments-2026-09-08.json`.
Running images (`az containerapp list`, 2026-09-08): `k12-querybuilder-gateway:development-844bf4c` (revision `patched0707`, 7 Jul, external ingress), `k12-querybuilder-api:auditdemo-20260714`, `k12-dashboard:auditdemo-20260714` — all ~2 months stale and not produced by the current pipeline (`k12-query-builder.app` last ran 2026-05-11).

## What is actually vulnerable (per image)
| Image | Packages | High | Distinct CVEs | Delta vs gateway |
|---|---|---|---|---|
| k12-querybuilder-gateway | 34 | 15 | 55 | — |
| k12-querybuilder-api | 33 | 15 | 54 | no `opentelemetry.api` |
| k12-dashboard | 33 | 14 | 54 | no `microsoft.openapi` |

| Layer | Packages | Max CVSS | Fix |
|---|---|---|---|
| Ubuntu 24.04 base layer (30 pkgs, all three images) | perl-base 9.8, libc6/libc-bin 9.1, libattr1 8.4, openssl + libssl3t64 7.5, util-linux family ×7 (7.0), pam ×4, systemd libs, ncurses ×4, tar, gzip, coreutils, libgcrypt20, libp11-kit0, libbz2, gpgv | 9.8 | Rebuild on `aspnet:10.0-noble-chiseled-extra` (all fixed versions are in noble-updates). Chiseled drops the shell/apt/perl/util-linux/pam/ncurses/coreutils classes; glibc, openssl, ICU and tzdata remain, so regular rebuilds are still required |
| .NET runtime (Microsoft.NETCore.App.Runtime.linux-x64) | 9 CVEs | 8.2 | Fixed in 10.0.10 / 10.0.11 → picked up by rebuilding on the current 10.0 tag |
| NuGet | Microsoft.OpenApi 7.5 (transitive via Microsoft.AspNetCore.OpenApi 10.0.0; gateway + api); OpenTelemetry.Exporter.OpenTelemetryProtocol 6.5 and OpenTelemetry.Api 5.3 (transitive via OpenTelemetry.* 1.15.0 in ServiceDefaults) | 7.5 | `Microsoft.AspNetCore.OpenApi` → 10.0.11 (pulls Microsoft.OpenApi ≥ 2.7.5); OpenTelemetry family → 1.18.0. The existing SecurityScan stage (`dotnet list package --vulnerable`, fails on High) enforces this going forward |

## Fix = one PR in the ADO k12-query-builder repo (exactly what `k12-8804-fix.patch` does)
1. Base image → `mcr.microsoft.com/dotnet/aspnet:10.0-noble-chiseled-extra` in **all three build paths**: the inline Dockerfile in `pipelines/templates/stages/docker-push.yml` (what the `docker` stage actually pushes), the repo Dockerfiles for gateway/api/dashboard (used by the `az acr build` fallback and local builds), and `<ContainerFamily>noble-chiseled-extra</ContainerFamily>` in the Gateway/Api/Dashboard csproj (SDK/Aspire container publish).
2. `Microsoft.AspNetCore.OpenApi` 10.0.0 → 10.0.11 (Gateway, Api csproj); `OpenTelemetry.*` 1.15.0 → 1.18.0 (ServiceDefaults csproj, five packages aligned).
3. Merge, then run `k12-query-builder.app` on development → `docker` stage pushes immutable `development-<sha>` tags → Deploy → development rolls them out.
4. Verify: Defender re-scans the new digests within ~24 h; the `Update <pkg>` assessments on the three container apps drop to 0. Optional fast check: `trivy image developmentk12acr.azurecr.io/k12-querybuilder-gateway:<new-tag>`.
5. Hygiene (follow-ups): deploy by digest (`@sha256:`) not tag; delete superseded manifests in developmentk12acr so old digests stop being scanned; retire or fix the unreferenced `deploy-aca.yml` (names `k12-gateway`/`k12-query-api`, live apps are `k12-querybuilder-*`).

Not in this ticket (separate finding): gateway ingress is external=true — "Container Apps should not be exposed to the public internet" (High). Track under remediation gap C2.

## Draft Jira comment (paste after review — nothing posted)
See `ADO-PR-draft-and-jira-comment.md` (per-image counts, PR link).

## Standup line (30 s)
K12-8804: root cause nailed with Defender's per-package data — stale base image (gateway 34 pkgs/15 High, api 33/15, dashboard 33/14, incl. glibc/openssl/perl) plus two old NuGet families, not app code. Draft ADO PR 6024 is up: chiseled aspnet:10.0 base in all three image build paths + the two package bumps; one pipeline run fixes gateway, api and dashboard together, and Defender's re-scan is the closure evidence. Blocker: none — needs a pipeline run on the branch, review, merge and a dev deploy. Same pattern is the runner image (K12-8497): 80 packages/121 CVEs across two Ubuntu generations in three ACRs — rebuild + purge old manifests is the easy win after this.

## Runner image (K12-8497) — scope for the second easy win (complete export, 812 rows)
- 80 vulnerable packages (44 High), 121 distinct CVEs, incl. Python packages (cryptography, setuptools, pip, pyjwt).
- 9 distinct `k12-ado-runner` image digests across developmentk12acr (9), testingk12acr (4), stagingk12acr (2); two base generations — Ubuntu 24.04 (perl 5.38) and 22.04 (perl 5.34, python3.10) — the older jammy-era digests inflate the count.
- Fix: rebuild k12-ado-runner on current ubuntu:24.04 with apt upgrade + `pip install -U cryptography setuptools pip pyjwt`, digest-pin, then delete superseded manifests in all three ACRs (ACR deletes need approval — Azure change).
