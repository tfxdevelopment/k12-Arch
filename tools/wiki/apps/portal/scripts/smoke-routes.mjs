const baseUrl = process.env.IDP_BASE_URL || 'http://localhost:3000';
const timeoutMs = Number(process.env.IDP_SMOKE_TIMEOUT_MS || '15000');

const checks = [
  { path: '/', expectText: 'K12 Internal Developer Platform' },
  { path: '/docs', expectText: 'Architecture Docs' },
  { path: '/api-reference', expectText: 'API Reference' },
  { path: '/storybook', expectText: 'Component Catalog' },
  { path: '/platform/tools', expectText: 'Platform Tools' },
  { path: '/platform/logs', expectText: 'Platform Logs' },
  { path: '/api/health', expectStatus: 200, expectJsonKeys: ['portal', 'docs', 'scalar', 'storybook', 'checkedAt'] },
  { path: '/_docs/', expectStatus: 200 },
  { path: '/_api-reference/', expectStatus: 200 },
  { path: '/_storybook/', expectStatus: 200 }
];

function createTimeoutSignal(ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(timer) };
}

async function runCheck(check) {
  const expectedStatus = check.expectStatus ?? 200;
  const url = new URL(check.path, baseUrl).toString();
  const { signal, clear } = createTimeoutSignal(timeoutMs);

  try {
    const response = await fetch(url, { redirect: 'follow', signal });

    if (response.status !== expectedStatus) {
      throw new Error(`expected status ${expectedStatus}, got ${response.status}`);
    }

    if (check.expectText) {
      const text = await response.text();
      if (!text.includes(check.expectText)) {
        throw new Error(`missing text marker "${check.expectText}"`);
      }
    }

    if (check.expectJsonKeys) {
      const payload = await response.json();
      for (const key of check.expectJsonKeys) {
        if (!(key in payload)) {
          throw new Error(`missing JSON key "${key}"`);
        }
      }
    }

    console.log(`[PASS] ${check.path}`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`[FAIL] ${check.path} -> ${reason}`);
  } finally {
    clear();
  }
}

async function main() {
  console.log(`Running route smoke checks against ${baseUrl}`);

  for (const check of checks) {
    await runCheck(check);
  }

  console.log('Smoke checks passed.');
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
