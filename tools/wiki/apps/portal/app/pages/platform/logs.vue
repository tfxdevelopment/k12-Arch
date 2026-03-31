<script setup lang="ts">
type LogLevel = 'INFO' | 'WARN' | 'ERROR';
type ServiceName = 'portal' | 'docs' | 'scalar' | 'storybook';

interface LogItem {
  id: number;
  level: LogLevel;
  service: ServiceName;
  message: string;
  time: string;
}

interface HealthItem {
  status: 'running' | 'unavailable';
  message?: string;
}

interface HealthResponse {
  portal: HealthItem;
  docs: HealthItem;
  scalar: HealthItem;
  storybook: HealthItem;
}

const logs = ref<LogItem[]>([]);
const paused = ref(false);
const selectedService = ref<'all' | ServiceName>('all');
let seed = 0;
let timer: ReturnType<typeof setInterval> | undefined;

function addLog(level: LogLevel, service: ServiceName, message: string) {
  logs.value.push({
    id: seed++,
    level,
    service,
    message,
    time: new Date().toLocaleTimeString()
  });

  if (logs.value.length > 250) {
    logs.value.shift();
  }
}

async function pollHealth() {
  try {
    const health = await $fetch<HealthResponse>('/api/health');
    const pairs: Array<[ServiceName, HealthItem]> = [
      ['portal', health.portal],
      ['docs', health.docs],
      ['scalar', health.scalar],
      ['storybook', health.storybook]
    ];

    for (const [service, item] of pairs) {
      if (item.status === 'running') {
        addLog('INFO', service, 'health check passed');
      } else {
        addLog('WARN', service, item.message ? `health check failed (${item.message})` : 'health check failed');
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    addLog('ERROR', 'portal', `health endpoint failed (${message})`);
  }
}

async function tick() {
  if (paused.value) {
    return;
  }

  await pollHealth();
}

const visibleLogs = computed(() => {
  if (selectedService.value === 'all') {
    return logs.value;
  }

  return logs.value.filter((entry) => entry.service === selectedService.value);
});

function togglePause() {
  paused.value = !paused.value;
}

function clearLogs() {
  logs.value = [];
}

onMounted(async () => {
  await tick();
  timer = setInterval(tick, 4000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<template>
  <section>
    <h1 class="text-3xl font-bold text-white">Platform Logs</h1>
    <p class="text-slate-400 mt-2">Integrated health stream for demo walkthroughs.</p>

    <div class="mt-4 flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="text-sm px-3 py-2 rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
        @click="togglePause"
      >
        {{ paused ? 'Resume stream' : 'Pause stream' }}
      </button>
      <button
        type="button"
        class="text-sm px-3 py-2 rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
        @click="clearLogs"
      >
        Clear logs
      </button>
      <label class="text-sm text-slate-300">Service:</label>
      <select
        v-model="selectedService"
        class="text-sm rounded-md border border-slate-700 bg-slate-900 text-slate-200 px-2 py-1.5"
      >
        <option value="all">all</option>
        <option value="portal">portal</option>
        <option value="docs">docs</option>
        <option value="scalar">scalar</option>
        <option value="storybook">storybook</option>
      </select>
    </div>

    <div class="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4 h-[70vh] overflow-y-auto font-mono text-sm">
      <div v-for="entry in visibleLogs" :key="entry.id" class="grid grid-cols-[6rem_5rem_7rem_1fr] gap-3 py-1 text-slate-300">
        <span class="text-slate-500">{{ entry.time }}</span>
        <span :class="entry.level === 'ERROR' ? 'text-red-400' : entry.level === 'WARN' ? 'text-amber-300' : 'text-emerald-300'">{{ entry.level }}</span>
        <span class="text-sky-300">{{ entry.service }}</span>
        <span>{{ entry.message }}</span>
      </div>
      <p v-if="visibleLogs.length === 0" class="text-slate-500">No log entries yet.</p>
    </div>
  </section>
</template>
