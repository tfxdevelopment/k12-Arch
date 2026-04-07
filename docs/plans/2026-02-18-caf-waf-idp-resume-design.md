# CAF/WAF IDP Resume Design

Date: 2026-02-18
Owner: K12 Architecture
Status: Approved

## Goal

Resume the CAF/WAF IDP work with a run-ready, full-demo-quality outcome through the Nuxt shell, while allowing targeted cleanup that directly improves demo stability and clarity.

## Selected Approach

Selected option: Vertical Slice Stabilization.

Why selected:
- Fastest path to a working demo flow.
- Keeps changes grounded in user-facing routes.
- Reduces risk of broad refactors before demo readiness.

## Scope

In scope:
- End-to-end stability and polish for:
  - `/docs/**`
  - `/api-reference`
  - `/storybook`
  - `/platform/tools`
  - `/platform/logs`
- Generation and synchronization flow for CAF/WAF content.
- Targeted structural cleanup only when it improves reliability or clarity.

Out of scope:
- Broad repository restructuring unrelated to demo flow.
- Deep redesign of app architecture beyond what is needed for this pass.

## Resume Architecture and Flow

1. Validate generation layer first (`tools/wiki/apps/caf-waf`) so docs and navigation are current.
2. Start integrated runtime from `tools/wiki/apps/portal` with `npm run dev:all`.
3. Validate and fix in demo order:
   1. `/docs`
   2. `/api-reference`
   3. `/storybook`
   4. `/platform/tools`
   5. `/platform/logs`
4. After functional pass, run a shell-wide polish pass (copy, layout, fallback messaging, nav coherence).
5. Apply cleanup only when directly tied to demo quality/stability.

## Components and Data Flow

Canonical authored files:
- `tools/wiki/09-proposed-architecture/05-well-architected`
- `tools/wiki/09-proposed-architecture/06-cloud-adoption`

Generation/orchestration:
- `tools/wiki/apps/caf-waf/`
  - Syncs docs into Astro content.
  - Builds nav artifacts for portal.
  - Builds WAF migration matrix.

Surfaces:
- Docs app: `tools/wiki/apps/docs/` (Astro)
- API reference: `tools/wiki/apps/scalar/`
- Component catalog: `tools/wiki/apps/storybook/`
- Shell host: `tools/wiki/apps/portal/` (Nuxt)

Nuxt proxy routes:
- `tools/wiki/apps/portal/server/routes/_docs/[...path].ts`
- `tools/wiki/apps/portal/server/routes/_api-reference/[...path].ts`
- `tools/wiki/apps/portal/server/routes/_storybook/[...path].ts`

Runtime flow:
1. Canonical markdown -> caf-waf generation scripts -> generated docs/nav outputs.
2. Upstream apps run on local ports.
3. Nuxt proxies upstreams and exposes stable shell routes on one host.

## Error Handling

1. Proxy/upstream outages:
- Keep shell route rendering.
- Show fallback guidance with startup command and affected surface.

2. Generation failures:
- Fail fast on missing canonical inputs.
- Block demo validation on stale or failed generation outputs.

3. Route regressions:
- Any 5xx, blank integrated surface, or broken core navigation is a blocking issue.

## Acceptance Criteria

1. All five portal routes load with meaningful content and no 5xx failures.
2. Proxied surfaces are demonstrably integrated through Nuxt shell routes.
3. Home/dashboard cards and labels accurately reflect available surfaces.
4. Navigation labels/destinations are consistent across shell.
5. UI polish is demo-ready on desktop and mobile widths.

## Verification Checklist

1. Run CAF/WAF generation and confirm outputs refresh.
2. Run `npm run dev:all` in `tools/wiki/apps/portal` and confirm stable startup.
3. Validate:
   - `/docs/...`
   - `/api-reference`
   - `/storybook`
   - `/platform/tools`
   - `/platform/logs`
4. Verify fallback behavior when an upstream is intentionally unavailable.
5. Re-run route checks after any cleanup changes.

## Cleanup Guardrails

Allowed:
- Remove or isolate temporary/demo artifacts that confuse runtime or navigation.
- Tighten scripts/config where it directly improves startup reliability.

Disallowed:
- Unrelated cleanup that delays demo readiness.
- Structural churn without measurable demo benefit.

