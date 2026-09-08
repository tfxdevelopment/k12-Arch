# K12-8804 — k12-querybuilder-gateway package vulnerabilities (evidence pack, 2026-09-08)

Source: Defender for Cloud package-level assessments via Azure Resource Graph (read-only), sub K12 Azure, RG development.
Running image: developmentk12acr.azurecr.io/k12-querybuilder-gateway:development-844bf4c (revision patched0707, 7 Jul) — ~2 months stale.
Same base ⇒ same 33–34 findings on k12-querybuilder-api (auditdemo-20260714) and k12-dashboard (auditdemo-20260714).

## What is actually vulnerable (34 packages, 15 High)
| Layer | Packages | Max CVSS | Fix |
|---|---|---|---|
| Ubuntu 24.04 base layer (30 pkgs) | perl-base 9.8, libc6/libc-bin 9.1, libattr1 8.4, openssl + libssl3t64 7.5, util-linux family ×7 (7.0), pam ×4, systemd libs, ncurses ×4, tar, gzip, coreutils, libgcrypt20, libp11-kit0, libbz2, gpgv | 9.8 | Rebuild on a current base image (all fixed versions are in noble-updates) — or switch to `aspnet:10.0-noble-chiseled`, which removes perl/apt/bash and most of these classes permanently |
| .NET runtime (Microsoft.NETCore.App.Runtime.linux-x64) | 9 CVEs | 8.2 | Fixed in 10.0.10 / 10.0.11 → picked up automatically by rebuilding on current `aspnet:10.0` |
| NuGet | Microsoft.OpenApi (7.5 → fix 2.7.5); OpenTelemetry.Exporter.OpenTelemetryProtocol (6.5 → 1.15.2+); OpenTelemetry.Api (5.3 → 1.15.3) | 7.5 | Bump in csproj / Directory.Packages.props — the existing SecurityScan stage (`dotnet list package --vulnerable`, fails on High) will enforce this |

## Fix = one PR in the ADO k12-query-builder repo, one pipeline run
1. Bump base image tags in apps/K12.QueryBuilder.Gateway/Dockerfile (+ api, dashboard Dockerfiles): pull current `mcr.microsoft.com/dotnet/aspnet:10.0-noble` (or `-noble-chiseled`) / `sdk:10.0`; add `apt-get upgrade -y` only if staying on the full image.
2. Bump Microsoft.OpenApi → 2.7.5, OpenTelemetry.Exporter.OpenTelemetryProtocol → 1.15.3, OpenTelemetry.Api → 1.15.3.
3. Run pipeline on development → docker-push (immutable branch-sha tag) → deploy-aca updates all three container apps.
4. Verify: Defender re-scans the new digest within ~24 h; the 34 "Update <pkg>" recommendations on the gateway/api/dashboard drop to 0. Optional fast check: Trivy on the pushed image.
5. Hygiene: deploy by digest (`@sha256:`) not tag; delete the superseded manifests in developmentk12acr so old digests stop being scanned/counted.

Not in this ticket (separate finding): gateway ingress is external=true — "Container Apps should not be exposed to the public internet" (High). Track under remediation gap C2.

## Draft Jira comment (paste after review — nothing posted)
> Root cause confirmed from Defender package-level data (2026-09-08): the running gateway image (development-844bf4c, deployed 7 Jul) carries 34 vulnerable packages — 30 in the Ubuntu 24.04 base layer (perl-base 9.8, glibc 9.1, openssl 7.5, util-linux 7.0, etc.; all have fixed versions in noble-updates), 9 CVEs in the .NET 10 runtime (fixed in 10.0.10+), and 3 NuGet packages (Microsoft.OpenApi → 2.7.5, OpenTelemetry OTLP exporter → 1.15.3, OpenTelemetry.Api → 1.15.3). k12-querybuilder-api and k12-dashboard share the base and show the same set.
> Fix: rebuild on the current aspnet:10.0 base (moving to the chiseled variant to eliminate the perl/apt package classes) and bump the three NuGets; one pipeline run rebuilds and redeploys all three images. Verification = Defender re-scan of the new digest → 0 package findings on the three apps. Follow-ups filed separately: deploy-by-digest, purge superseded manifests from the ACR, and the external-ingress finding on the gateway.

## Standup line (30 s)
K12-8804: root cause nailed with Defender's per-package data — it's a stale base image (34 pkgs, 15 High, incl. glibc/openssl/perl) plus 3 old NuGets, not app code. One PR (base bump to chiseled aspnet:10.0 + 3 package bumps) and one pipeline run fixes gateway, api and dashboard together; Defender re-scan is the closure evidence. Blocker: none — need the ADO repo PR merged and a dev deploy. Same pattern is the runner image (K12-8497): 80 packages/121 CVEs across two Ubuntu generations in three ACRs — rebuild + purge old manifests is the easy win after this.

## Runner image (K12-8497) — scope for the second easy win
- 80 vulnerable packages (44 High), 121 distinct CVEs, 10 Python packages (cryptography, setuptools, pip, pyjwt).
- Two base generations in the ACRs: Ubuntu 24.04 (perl 5.38) AND 22.04 (perl 5.34, python3.10) — at least 5 distinct image digests across developmentk12acr / testingk12acr / stagingk12acr; the older jammy-era digests inflate the count.
- Fix: rebuild k12-ado-runner on current ubuntu:24.04 with apt upgrade + `pip install -U cryptography setuptools pip pyjwt`, digest-pin, then delete superseded manifests in all three ACRs (ACR deletes need approval — Azure change).
