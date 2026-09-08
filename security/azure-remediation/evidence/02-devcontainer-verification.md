# Devcontainer verification — agent workspace mirror (2026-09-05)

Local, read-only verification across the mirrored repos. No files changed.

## Result summary

| Check | Result |
|---|---|
| JSON syntax — all 8 devcontainer files (base, agent, developer, 3 overlays, .github-private, k12-Arch) | ✅ valid |
| Referenced scripts exist (agent-setup.sh, init-repos.sh, on-create/post-start, doctor + 5 checks) | ✅ present |
| `devcontainer-platform` doctor.sh (advisory mode, this container) | ✅ 3 passed / 2 warnings / 0 failed — warnings: ContextStream secrets not set, `gh` CLI absent (GitHub goes through MCP here, so expected in this session) |
| k12-Arch compose mount vs `workspaceFolder` | ✅ consistent (`..:/workspaces/K12-Arch`) |
| `K12.Aspire.sln` referenced by `.github-private` config | exists in **k12-Arch**, not in `.github-private` → setting only resolves when k12-Arch is the opened folder (minor) |

## Findings that need a fix (proposed, NOT applied — no remote changes)

1. **`"extends"` is not part of the Dev Container spec.**
   `devcontainer-platform/.devcontainer/agent/devcontainer.json` and `developer/devcontainer.json`
   use `"extends": "../base/devcontainer.base.json"`. The spec (containers.dev JSON reference)
   has no inheritance property, so Codespaces ignores it: neither config resolves the base
   `build.dockerfile`, docker-in-docker/git features, or `containerUser: vscode`. Codespaces
   falls back to the default universal image and only runs the lifecycle commands duplicated in
   the child config — the "strict, deterministic" agent workspace silently isn't.
   **Fix options:** (a) make each variant self-contained with
   `"build": {"dockerfile": "../base/Dockerfile", "context": "../base"}` + copy features/env, or
   (b) prebuild the base to `ghcr.io/tfxdevelopment/devcontainer-platform-agent` (the
   agent-workspace doc already references that image for Actions) and use `"image"`.
2. **Overlays are inert.** `.devcontainer/overlays/{aspire,azure,data-stack}.json` aren't
   referenced by any config and the spec has no overlay/merge mechanism — either merge the
   azure overlay's features (azure-cli, azd, bicep) into the configs that need them or treat
   overlays as documented snippets. Also `[verify]`: the azure-cli feature's `"extensions"`
   option name against ghcr.io/devcontainers/features/azure-cli docs.
3. **`.github-private/.devcontainer/init-repos.sh` repo list is stale vs. the mirror set.**
   It clones k12-Arch, k12-api-enrollment, k12-web-enrollment, k12-infra, k12-test-api-postman;
   this workspace's mirror set is k12-Arch, k12-api-enrollment, k12-infra, k12-query-builder,
   devcontainer-platform, .github-private. Missing: **k12-query-builder, devcontainer-platform**;
   listed but not mirrored here: k12-web-enrollment, k12-test-api-postman (fine if they exist
   org-side — clone failures are tolerated with a warning).
4. **Feature namespace:** `ghcr.io/devcontainers-contrib/features/terraform-asdf:2`
   (.github-private + k12-Arch) — the devcontainers-contrib org was renamed devcontainers-extra;
   old refs currently redirect, but pinning the new namespace (or the official
   `ghcr.io/devcontainers/features/terraform`) is safer.

## This Claude remote container (the de facto agent workspace today)

node 22 / npm 10, python 3.11, docker 29, git, jq — present.
dotnet, terraform, gh — absent (install per-session if needed).
Azure CLI 2.90.0 + resource-graph 2.1.1 installed this session at `/root/azcli-venv/bin/az`
(not authenticated; no Azure credentials exist in this environment).
