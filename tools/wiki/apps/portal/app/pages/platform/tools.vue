<script setup lang="ts">
type ServiceKey = 'portal' | 'docs' | 'scalar' | 'storybook';
type Status = 'running' | 'unavailable';

interface HealthItem {
  status: Status;
  url: string;
  latencyMs: number | null;
  message?: string;
}

interface HealthResponse {
  portal: HealthItem;
  docs: HealthItem;
  scalar: HealthItem;
  storybook: HealthItem;
  checkedAt: string;
}

interface ServiceCard {
  key: ServiceKey;
  name: string;
  status: Status;
  url: string;
  port: string;
  latencyMs: number | null;
  message?: string;
}

const services = ref<ServiceCard[]>([]);
const checkedAt = ref<string>('');
const loading = ref(true);
const failed = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;

function toPort(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.port) return parsed.port;
    return parsed.protocol === 'https:' ? '443' : '80';
  } catch {
    return 'n/a';
  }
}

function toServiceCards(payload: HealthResponse): ServiceCard[] {
  return [
    { key: 'portal', name: 'Nuxt IDP Shell', ...payload.portal, port: toPort(payload.portal.url) },
    { key: 'docs', name: 'Astro Docs', ...payload.docs, port: toPort(payload.docs.url) },
    { key: 'scalar', name: 'Scalar API Reference', ...payload.scalar, port: toPort(payload.scalar.url) },
    { key: 'storybook', name: 'Storybook Surface', ...payload.storybook, port: toPort(payload.storybook.url) }
  ];
}

function statusBadgeClass(status: Status) {
  if (status === 'running') {
    return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  }

  return 'bg-red-500/15 text-red-300 border-red-500/30';
}

async function refresh() {
  try {
    const payload = await $fetch<HealthResponse>('/api/health');
    services.value = toServiceCards(payload);
    checkedAt.value = payload.checkedAt;
    failed.value = false;
  } catch {
    failed.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await refresh();
  timer = setInterval(refresh, 15000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <section>
    <h1 class="text-3xl font-bold text-white">Platform Tools</h1>
    <p class="text-slate-400 mt-2">Demo orchestration status for integrated IDP surfaces.</p>
    <p v-if="checkedAt" class="text-xs text-slate-500 mt-1">Last checked: {{ new Date(checkedAt).toLocaleString() }}</p>
    <p v-if="loading" class="text-xs text-slate-400 mt-1">Loading service checks...</p>
    <p v-if="failed" class="text-xs text-amber-300 mt-1">Could not refresh health snapshot.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      <div
        v-for="svc in services"
        :key="svc.key"
        class="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-white">{{ svc.name }}</h2>
          <span class="text-xs px-2 py-1 rounded-full border" :class="statusBadgeClass(svc.status)">
            {{ svc.status }}
          </span>
        </div>
        <p class="text-sm text-slate-400 mt-2">URL: {{ svc.url }}</p>
        <p class="text-sm text-slate-400 mt-1">Port: {{ svc.port }}</p>
        <p class="text-sm text-slate-400 mt-1">
          Latency: {{ svc.latencyMs === null ? 'n/a' : `${svc.latencyMs}ms` }}
        </p>
        <p v-if="svc.message" class="text-xs text-amber-300 mt-2">
          Note: {{ svc.message }}
        </p>
      </div>
    </div>

    <div class="mt-4">
      <button
        type="button"
        class="text-sm px-3 py-2 rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
        @click="refresh"
      >
        Refresh now
      </button>
    </div>
  </section>
</template>
