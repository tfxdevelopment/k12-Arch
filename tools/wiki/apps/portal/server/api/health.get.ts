import { getRequestURL, type H3Event } from 'h3';

type HealthStatus = 'running' | 'unavailable';

interface ServiceHealth {
  status: HealthStatus;
  url: string;
  latencyMs: number | null;
  message?: string;
}

function parseTargets(rawTargets: string) {
  return rawTargets
    .split(',')
    .map((target) => target.trim())
    .filter((target) => target.length > 0);
}

async function probe(url: string): Promise<ServiceHealth> {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal
    });

    if (response.ok) {
      return {
        status: 'running',
        url,
        latencyMs: Date.now() - startedAt
      };
    }

    return {
      status: 'unavailable',
      url,
      latencyMs: Date.now() - startedAt,
      message: `status ${response.status}`
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      status: 'unavailable',
      url,
      latencyMs: null,
      message
    };
  } finally {
    clearTimeout(timer);
  }
}

async function probeWithFallback(rawTargets: string): Promise<ServiceHealth> {
  const targets = parseTargets(rawTargets);

  if (targets.length === 0) {
    return {
      status: 'unavailable',
      url: rawTargets,
      latencyMs: null,
      message: 'No Storybook upstream targets configured'
    };
  }

  let lastResult: ServiceHealth | null = null;

  for (const target of targets) {
    const result = await probe(target);
    if (result.status === 'running') {
      return result;
    }
    lastResult = result;
  }

  return lastResult ?? {
    status: 'unavailable',
    url: rawTargets,
    latencyMs: null,
    message: 'No Storybook upstream targets configured'
  };
}

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig(event);

  const docsUrl = config.docsUpstream;
  const scalarUrl = config.scalarUpstream;
  const storybookUrl = config.storybookUpstream;

  const [docs, scalar, storybook] = await Promise.all([
    probe(docsUrl),
    probe(scalarUrl),
    probeWithFallback(storybookUrl)
  ]);

  return {
    portal: {
      status: 'running' as const,
      url: getRequestURL(event).origin,
      latencyMs: 0
    },
    docs,
    scalar,
    storybook,
    checkedAt: new Date().toISOString()
  };
});
