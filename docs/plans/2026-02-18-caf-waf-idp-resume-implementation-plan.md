# CAF/WAF IDP Resume Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver a full-demo-quality CAF/WAF IDP experience where all shell routes and proxied surfaces are stable, polished, and verifiable from one Nuxt host.

**Architecture:** Keep Nuxt portal as the single host and stabilize in vertical slices. First make generation and runtime checks repeatable, then harden proxy/error behavior, then polish shell UX and route pages, and finally apply targeted cleanup tied to demo reliability.

**Tech Stack:** Nuxt 4, Vue 3, Nitro server routes (`h3` proxy), Astro docs, Scalar Node server, Storybook HTML/Vite, Node.js scripts, npm.

---

### Task 1: Add repeatable smoke checks for shell and proxied surfaces

**Files:**
- Create: `tools/wiki/apps/portal/scripts/smoke-routes.mjs`
- Modify: `tools/wiki/apps/portal/package.json`
- Modify: `tools/wiki/apps/portal/README.md`
- Test: `tools/wiki/apps/portal/scripts/smoke-routes.mjs`

**Step 1: Write the failing test**

```js
// tools/wiki/apps/portal/scripts/smoke-routes.mjs
const checks = [
  { path: '/', expect: 'K12 Internal Developer Platform' },
  { path: '/docs', expect: 'Architecture Docs' },
  { path: '/api-reference', expect: 'API Reference' },
  { path: '/storybook', expect: 'Component Catalog' },
  { path: '/platform/tools', expect: 'Platform Tools' },
  { path: '/platform/logs', expect: 'Platform Logs' },
  { path: '/_docs/', expectStatus: 200 },
  { path: '/_api-reference/', expectStatus: 200 },
  { path: '/_storybook/', expectStatus: 200 }
];
```

**Step 2: Run test to verify it fails**

Run: `npm run smoke:routes`  
Expected: FAIL (script missing or one or more checks failing).

**Step 3: Write minimal implementation**

```json
// tools/wiki/apps/portal/package.json (scripts)
{
  "scripts": {
    "smoke:routes": "node scripts/smoke-routes.mjs"
  }
}
```

```js
// smoke-routes.mjs
const base = process.env.IDP_BASE_URL || 'http://localhost:3000';
for (const check of checks) {
  const res = await fetch(new URL(check.path, base));
  if ((check.expectStatus || 200) !== res.status) throw new Error(`${check.path} status ${res.status}`);
  if (check.expect) {
    const body = await res.text();
    if (!body.includes(check.expect)) throw new Error(`${check.path} missing marker "${check.expect}"`);
  }
}
console.log('Smoke checks passed.');
```

**Step 4: Run test to verify it passes**

Run:
1. `npm run dev:all`
2. In a second terminal: `npm run smoke:routes`

Expected: PASS with `Smoke checks passed.`

**Step 5: Commit**

```bash
git add tools/wiki/apps/portal/scripts/smoke-routes.mjs tools/wiki/apps/portal/package.json tools/wiki/apps/portal/README.md
git commit -m "test(portal): add route smoke checks for shell and proxied surfaces"
```

### Task 2: Harden proxy route error handling and fallback responses

**Files:**
- Create: `tools/wiki/apps/portal/server/utils/proxy-upstream.ts`
- Modify: `tools/wiki/apps/portal/server/routes/_docs/[...path].ts`
- Modify: `tools/wiki/apps/portal/server/routes/_api-reference/[...path].ts`
- Modify: `tools/wiki/apps/portal/server/routes/_storybook/[...path].ts`
- Test: `tools/wiki/apps/portal/scripts/smoke-routes.mjs`

**Step 1: Write the failing test**

```js
// Add an optional mode in smoke-routes.mjs:
// process.env.CHECK_PROXY_FALLBACK === '1'
// Expect /_docs/ to return 502 + fallback text when docs upstream is unreachable.
```

**Step 2: Run test to verify it fails**

Run:
1. `set IDP_DOCS_UPSTREAM=http://localhost:1`
2. `npm run dev:shell`
3. `set CHECK_PROXY_FALLBACK=1 && npm run smoke:routes`

Expected: FAIL (raw proxy error without controlled fallback payload).

**Step 3: Write minimal implementation**

```ts
// server/utils/proxy-upstream.ts
export async function proxyWithFallback(event, target, label) {
  try {
    return await proxyRequest(event, target);
  } catch {
    setResponseStatus(event, 502);
    return {
      error: 'upstream_unavailable',
      upstream: label,
      target,
      hint: 'Start all services with npm run dev:all from tools/wiki/apps/portal'
    };
  }
}
```

```ts
// each proxy route handler
const target = normalizeTarget(config.docsUpstream, String(path), search);
return proxyWithFallback(event, target, 'docs');
```

**Step 4: Run test to verify it passes**

Run: fallback mode again plus normal smoke mode.
Expected: fallback mode PASS (controlled 502 payload), normal mode PASS with all services running.

**Step 5: Commit**

```bash
git add tools/wiki/apps/portal/server/utils/proxy-upstream.ts tools/wiki/apps/portal/server/routes/_docs/[...path].ts tools/wiki/apps/portal/server/routes/_api-reference/[...path].ts tools/wiki/apps/portal/server/routes/_storybook/[...path].ts tools/wiki/apps/portal/scripts/smoke-routes.mjs
git commit -m "fix(portal): add consistent upstream proxy fallback behavior"
```

### Task 3: Improve integrated surface behavior for loading and error visibility

**Files:**
- Modify: `tools/wiki/apps/portal/app/components/IntegratedSurface.vue`
- Modify: `tools/wiki/apps/portal/app/pages/docs/index.vue`
- Modify: `tools/wiki/apps/portal/app/pages/docs/[...slug].vue`
- Modify: `tools/wiki/apps/portal/app/pages/api-reference.vue`
- Modify: `tools/wiki/apps/portal/app/pages/storybook.vue`
- Test: `tools/wiki/apps/portal/scripts/smoke-routes.mjs`

**Step 1: Write the failing test**

```js
// Extend smoke script markers:
// - Docs page contains "Architecture Docs"
// - API page contains "API Reference"
// - Storybook page contains "Component Catalog"
// - each page contains a stable fallback hint string
```

**Step 2: Run test to verify it fails**

Run: `npm run smoke:routes`  
Expected: FAIL on missing stable marker/fallback hints.

**Step 3: Write minimal implementation**

```vue
<!-- IntegratedSurface.vue -->
<script setup lang="ts">
const loaded = ref(false);
const failed = ref(false);
let timeout: ReturnType<typeof setTimeout> | undefined;
onMounted(() => {
  timeout = setTimeout(() => { if (!loaded.value) failed.value = true; }, 8000);
});
function onLoad() { loaded.value = true; if (timeout) clearTimeout(timeout); }
function onError() { failed.value = true; }
</script>
```

```vue
<!-- pages/* -->
<IntegratedSurface
  title="API Reference"
  description="Scalar API reference integrated through the IDP shell."
  iframe-src="/_api-reference/"
  fallback-command="npm run dev:all"
/>
```

**Step 4: Run test to verify it passes**

Run: `npm run smoke:routes`  
Expected: PASS with stable page markers present.

**Step 5: Commit**

```bash
git add tools/wiki/apps/portal/app/components/IntegratedSurface.vue tools/wiki/apps/portal/app/pages/docs/index.vue tools/wiki/apps/portal/app/pages/docs/[...slug].vue tools/wiki/apps/portal/app/pages/api-reference.vue tools/wiki/apps/portal/app/pages/storybook.vue
git commit -m "fix(portal): improve integrated surface loading and fallback visibility"
```

### Task 4: Polish shell navigation, labels, and mobile usability

**Files:**
- Modify: `tools/wiki/apps/portal/app/components/IdpHeader.vue`
- Modify: `tools/wiki/apps/portal/app/components/IdpSidebar.vue`
- Modify: `tools/wiki/apps/portal/app/components/IdpContextRail.vue`
- Modify: `tools/wiki/apps/portal/app/pages/index.vue`
- Modify: `tools/wiki/apps/portal/app/assets/css/main.css`
- Test: `tools/wiki/apps/portal/scripts/smoke-routes.mjs`

**Step 1: Write the failing test**

```js
// Add marker checks for unified labels:
// "Integrated Docs", "API Reference", "Component Catalog", "Platform Tools", "Platform Logs"
```

**Step 2: Run test to verify it fails**

Run: `npm run smoke:routes`  
Expected: FAIL due inconsistent labels/copy.

**Step 3: Write minimal implementation**

```ts
// Use one shared label set (local constant) in header/sidebar/context rail.
const primaryLinks = [
  { label: 'Dashboard', to: '/' },
  { label: 'Integrated Docs', to: '/docs' },
  { label: 'API Reference', to: '/api-reference' },
  { label: 'Component Catalog', to: '/storybook' },
  { label: 'Platform Tools', to: '/platform/tools' },
  { label: 'Platform Logs', to: '/platform/logs' }
];
```

```css
/* main.css */
/* Ensure sticky layout + readable spacing at <= 768px */
```

**Step 4: Run test to verify it passes**

Run:
1. `npm run smoke:routes`
2. Manual: browser check at mobile width (~390px) and desktop width (~1440px)

Expected: PASS + no clipped primary nav or unreadable blocks.

**Step 5: Commit**

```bash
git add tools/wiki/apps/portal/app/components/IdpHeader.vue tools/wiki/apps/portal/app/components/IdpSidebar.vue tools/wiki/apps/portal/app/components/IdpContextRail.vue tools/wiki/apps/portal/app/pages/index.vue tools/wiki/apps/portal/app/assets/css/main.css
git commit -m "feat(portal): unify navigation labels and improve shell polish"
```

### Task 5: Make Platform Tools and Logs demo pages more credible

**Files:**
- Modify: `tools/wiki/apps/portal/app/pages/platform/tools.vue`
- Modify: `tools/wiki/apps/portal/app/pages/platform/logs.vue`
- Create: `tools/wiki/apps/portal/server/api/health.get.ts`
- Test: `tools/wiki/apps/portal/scripts/smoke-routes.mjs`

**Step 1: Write the failing test**

```js
// Add checks:
// GET /api/health returns JSON with keys: portal, docs, scalar, storybook
// /platform/tools includes "Last checked"
```

**Step 2: Run test to verify it fails**

Run: `npm run smoke:routes`  
Expected: FAIL (`/api/health` route missing).

**Step 3: Write minimal implementation**

```ts
// server/api/health.get.ts
export default defineEventHandler(async () => {
  return {
    portal: { status: 'running' },
    docs: { status: 'unknown' },
    scalar: { status: 'unknown' },
    storybook: { status: 'unknown' },
    checkedAt: new Date().toISOString()
  };
});
```

```vue
<!-- platform/tools.vue -->
<!-- Fetch /api/health on mount and render status cards + checkedAt -->
```

**Step 4: Run test to verify it passes**

Run: `npm run smoke:routes`  
Expected: PASS with `/api/health` and tools page markers.

**Step 5: Commit**

```bash
git add tools/wiki/apps/portal/server/api/health.get.ts tools/wiki/apps/portal/app/pages/platform/tools.vue tools/wiki/apps/portal/app/pages/platform/logs.vue tools/wiki/apps/portal/scripts/smoke-routes.mjs
git commit -m "feat(portal): add demo health endpoint and improve platform pages"
```

### Task 6: Apply targeted cleanup and finalize demo runbook

**Files:**
- Delete: `tools/wiki/apps/_demo_dip/**`
- Modify: `.gitignore`
- Modify: `tools/wiki/apps/portal/README.md`
- Modify: `docs/plans/2026-02-18-caf-waf-idp-resume-design.md`
- Test: `tools/wiki/apps/portal/scripts/smoke-routes.mjs`

**Step 1: Write the failing test**

```bash
git status --short | findstr /I "_demo_dip .angular\\cache"
```

Expected: FAIL (temporary artifacts still present/tracked as untracked noise).

**Step 2: Run test to verify it fails**

Run:
1. `git status --short`
2. `npm run smoke:routes`

Expected: cleanup checks fail or README lacks final runbook instructions.

**Step 3: Write minimal implementation**

```gitignore
# transient demo scaffolding
tools/wiki/apps/_demo_dip/.angular/cache/
```

```md
## Demo Runbook
1. cd tools/wiki/apps/caf-waf && npm run build
2. cd ../portal && npm run dev:all
3. npm run smoke:routes
4. Walk through /docs, /api-reference, /storybook, /platform/tools, /platform/logs
```

**Step 4: Run test to verify it passes**

Run:
1. `git status --short` (no new transient cache noise)
2. `npm run smoke:routes`

Expected: PASS with clean targeted cleanup and repeatable runbook.

**Step 5: Commit**

```bash
git add .gitignore tools/wiki/apps/portal/README.md docs/plans/2026-02-18-caf-waf-idp-resume-design.md
git rm -r tools/wiki/apps/_demo_dip
git commit -m "chore(portal): clean demo artifacts and finalize IDP runbook"
```

