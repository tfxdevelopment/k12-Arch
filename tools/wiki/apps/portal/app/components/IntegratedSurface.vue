<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string;
  description: string;
  iframeSrc: string;
  fallbackCommand?: string;
}>(), {
  fallbackCommand: 'npm run dev:all'
});

const loaded = ref(false);
const failed = ref(false);
let loadTimer: ReturnType<typeof setTimeout> | undefined;

function clearLoadTimer() {
  if (loadTimer) {
    clearTimeout(loadTimer);
    loadTimer = undefined;
  }
}

function scheduleFailureTimeout() {
  clearLoadTimer();
  loaded.value = false;
  failed.value = false;

  // Cross-origin iframe errors are inconsistent across browsers.
  // Treat long load stalls as a practical upstream failure signal.
  loadTimer = setTimeout(() => {
    if (!loaded.value) {
      failed.value = true;
    }
  }, 10000);
}

function onLoad() {
  loaded.value = true;
  clearLoadTimer();
}

function onError() {
  failed.value = true;
  clearLoadTimer();
}

watch(() => props.iframeSrc, scheduleFailureTimeout, { immediate: true });
onBeforeUnmount(clearLoadTimer);
</script>

<template>
  <section>
    <header class="mb-4">
      <h1 class="text-2xl md:text-3xl font-bold text-white">{{ props.title }}</h1>
      <p class="text-sm md:text-base text-slate-400 mt-1">{{ props.description }}</p>
    </header>

    <div class="border border-slate-800 bg-slate-900/50 rounded-xl overflow-hidden">
      <div v-if="!loaded && !failed" class="px-4 py-2 text-xs text-slate-400 border-b border-slate-800 bg-slate-900/70">
        Loading integrated view...
      </div>
      <iframe
        :src="props.iframeSrc"
        class="w-full h-[calc(100vh-15rem)] min-h-[680px] bg-slate-950"
        title="Integrated view"
        @load="onLoad"
        @error="onError"
      />
    </div>

    <div v-if="failed" class="mt-4 border border-amber-500/40 bg-amber-500/10 text-amber-100 rounded-lg p-3 text-sm">
      Upstream view could not be loaded. Start all services with <code>{{ props.fallbackCommand }}</code>.
    </div>
  </section>
</template>
