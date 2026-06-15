# ContextStream Integration — Status, Fix, and Usage

Date: 2026-06-06
Workspace: `K12 Azure` (id `88a586eb-0e78-4841-b4fd-32f080419e2a`)
Applies to: Claude Code (web/CLI) MCP integration via repo-root `.mcp.json`

## What was broken

The repo-root `.mcp.json` (the config Claude Code reads) pointed at a different,
unauthenticated endpoint than every other editor in the repo:

| Config file | Server | Endpoint | Auth | Status |
|-------------|--------|----------|------|--------|
| `.mcp.json` (was) | `context-awesome` | `https://www.context-awesome.com/api/mcp` (HTTP) | none | ❌ no tools registered |
| `.cursor/mcp.json`, `.roo/mcp.json`, `.kilocode/mcp.json` | `contextstream` | `https://api.contextstream.io` via `@contextstream/mcp-server` (stdio) | API key | ✅ canonical |
| `tools/wiki/.mcp.json` | `contextstream` | Windows `.exe` binary | API key | ✅ (Windows only) |

Root causes:
1. **No authentication** — the HTTP endpoint expects a bearer token; `.mcp.json` sent none, so no tools registered.
2. **Wrong/finicky endpoint** — `context-awesome.com/api/mcp` rejects the MCP `Accept`
   negotiation (`406`); the rest of the repo doesn't use it.
3. **Server-name mismatch** — it was named `context-awesome`, producing
   `mcp__context-awesome__*` tools, but `CLAUDE.md` / `cline_rules.md` expect `mcp__contextstream__*`.

## The fix

`.mcp.json` now uses the canonical stdio server, matching the team's other editor configs but
adapted for Linux (`npx` directly instead of `cmd /c`):

```json
{
  "mcpServers": {
    "contextstream": {
      "command": "npx",
      "args": ["-y", "@contextstream/mcp-server@latest"],
      "env": {
        "CONTEXTSTREAM_API_URL": "https://api.contextstream.io",
        "CONTEXTSTREAM_API_KEY": "cbiq_…",
        "CONTEXTSTREAM_CONTEXT_PACK": "true"
      }
    }
  }
}
```

Verified in the remote environment: node 22 + npx present, npm registry reachable,
`@contextstream/mcp-server` published (latest 0.4.74), `api.contextstream.io` reachable.

**Takes effect on the next session** — MCP servers are launched at session start, so a reload
is required; the tools will not appear mid-session.

## 🔴 Verified 2026-06-08: the committed API keys are INVALID

Both committed keys (`cbiq_vGHBPci…` from `.cursor`/`.roo`/`.kilocode` and `cbiq_KqNbAsVJ…`
from `tools/wiki`) were tested against `api.contextstream.io` by driving
`@contextstream/mcp-server` over stdio. **Every authenticated operation returns
`UNAUTHORIZED`** — including `help(action="auth")` ("who am I"), `session(capture_plan)`,
`memory(create_task)`, and `session(capture)`.

`init` *appears* to succeed only because it resolves the workspace from the local
`.contextstream/config.json` (`resolved via: local_config`) — it does **not** prove the key
works against the API.

**Consequence:** the integration cannot function (and the re-homing below cannot run) until a
**valid** key is generated in the ContextStream console and supplied. This is required, not just
a hygiene nice-to-have. The key currently inlined in `.mcp.json` is a known-dead placeholder.

## ⚠️ Security: committed API keys

Live-looking ContextStream API keys are committed in plaintext across `.cursor/mcp.json`,
`.roo/mcp.json`, `.kilocode/mcp.json`, `tools/wiki/.mcp.json`, and now `.mcp.json`
(two distinct `cbiq_…` keys). They are in git history and should be treated as exposed
(and, per above, are already non-functional — replace, don't just rotate).

Recommended (owner action — requires ContextStream console access):
1. **Rotate** both keys in the ContextStream console.
2. Switch configs to an env-var reference and set the value in the Claude Code web
   environment settings instead of committing it:
   ```json
   "CONTEXTSTREAM_API_KEY": "${CONTEXTSTREAM_API_KEY}"
   ```
3. Keep future local secrets out of git. Suggested `.gitignore` additions for
   machine-local overrides (do **not** ignore the shared committed configs that the
   web session depends on):
   ```gitignore
   # Local, machine-specific MCP secret overrides
   .mcp.local.json
   **/mcp.local.json
   .env.local
   ```

> Per the user's decision (2026-06-06), the existing key was inlined for now so the
> integration works with no setup; rotation is deferred.

## Are we using ContextStream's plan / task / lessons / memory features?

**Not yet in the Claude Code web sessions** — while the integration was down, work fell back to
file-based plans (`docs/plans/*.md`) and native Claude Code subagents. The repo's own
`cline_rules.md` asks for the opposite ("ALWAYS use ContextStream's plan/task system").

ContextStream v0.4.x MCP toolset (what becomes available once reconnected):

| Tool | Use |
|------|-----|
| `search` | Semantic/hybrid/keyword/pattern/exhaustive code search — **before** Glob/Grep/Read |
| `session` | `capture_plan`, `get_plan`, `list_plans`, `capture`/decisions, `get_lessons`, `capture_lesson`, `recall`, `summary` |
| `memory` | `create_task` / `list_tasks` / `update_task` (the task/todo system), events, decisions, timeline |
| `graph` | dependencies, impact, call_path, related |
| `project` / `workspace` | indexing, overview, statistics, associate, bootstrap |
| `integration` | GitHub / Slack |
| `help` | tools, auth, version |

Note: there is **no "remote agent" or "skills" tool in ContextStream itself** — "agents"
(`.claude/agents/`) and "skills" (`.agent/skills/`) are editor-side concepts in this repo, not
ContextStream features.

### Re-homing (prepared, one command — blocked on a valid key)

A ready-to-run script captures the CAF/WAF plan, its 9 tasks, and the 3 key decisions into the
workspace. It is written and committed; it could not be executed because the committed keys are
`UNAUTHORIZED` (see above). Once a valid key exists:

```bash
CONTEXTSTREAM_API_KEY=cbiq_<valid> node scripts/contextstream-rehome.mjs
```

It runs `init` → `session(capture_plan)` → `memory(create_task)` ×9 → `session(capture)` ×3.

### Remaining next step
- Pull the **"Azure resource groups and security roles best practices"** chat into the workspace
  and reconcile it against CAF-04 (the reconciliation wave in the handoff charter). This needs an
  authenticated session, so it is likewise blocked on a valid key.
