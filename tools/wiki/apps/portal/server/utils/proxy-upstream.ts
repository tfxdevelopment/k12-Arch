import { proxyRequest, setResponseStatus, type H3Event } from 'h3';

function parseTargets(rawTargets: string) {
  return rawTargets
    .split(',')
    .map((target) => target.trim())
    .filter((target) => target.length > 0);
}

export function normalizeTarget(base: string, suffix: string, search: string) {
  const normalizedSuffix = suffix ? `/${suffix}` : '/';

  const normalizedTargets = parseTargets(base).map((rawBase) => {
    const trimmedBase = rawBase.trim();
    const normalizedBase = trimmedBase.endsWith('/') ? trimmedBase.slice(0, -1) : trimmedBase;
    return `${normalizedBase}${normalizedSuffix}${search}`;
  });

  return normalizedTargets;
}

export async function proxyWithFallback(
  event: H3Event,
  targets: string | string[],
  upstream: string
) {
  const candidates = Array.isArray(targets) ? targets : parseTargets(targets);
  let lastError: unknown;
  let lastTarget: string | null = null;

  for (const target of candidates) {
    try {
      return await proxyRequest(event, target);
    } catch (error) {
      lastTarget = target;
      lastError = error;
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);

  setResponseStatus(event, 502);
  if (candidates.length === 0) {
    return {
      error: 'upstream_unavailable',
      upstream,
      target: Array.isArray(targets) ? targets.join(',') : targets,
      hint: 'Configure IDP_*_UPSTREAM to a valid HTTP URL',
      details: message || 'No upstream targets configured'
    };
  }

  return {
    error: 'upstream_unavailable',
    upstream,
    target: lastTarget,
    candidates,
    hint: 'Start all services with npm run dev:all from tools/wiki/apps/portal',
    details: message
  };
}
