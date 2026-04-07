<script setup lang="ts">
const quickLinks = [
  { label: 'Dashboard', to: '/' },
  { label: 'Integrated Docs', to: '/docs' },
  { label: 'API Reference', to: '/api-reference' },
  { label: 'Component Catalog', to: '/storybook' },
  { label: 'Platform Tools', to: '/platform/tools' },
  { label: 'Platform Logs', to: '/platform/logs' }
];
</script>

<template>
  <div class="h-full overflow-y-auto px-5 py-6">
    <h2 class="text-sm font-semibold text-white">Demo Context</h2>
    <p class="text-xs text-slate-400 mt-1">Integrated CAF/WAF surfaces routed through the Nuxt shell.</p>

    <div class="mt-6 space-y-2">
      <NuxtLink
        v-for="item in quickLinks"
        :key="item.to"
        :to="item.to"
        class="block text-sm rounded-md px-3 py-2 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white transition-colors"
      >
        {{ item.label }}
      </NuxtLink>
    </div>

    <div class="mt-8 border border-slate-800 rounded-lg p-4 bg-slate-900/60">
      <h3 class="text-sm font-semibold text-white mb-2">Upstream targets</h3>
      <ul class="text-xs text-slate-400 space-y-1">
        <li>Docs: localhost:4321</li>
        <li>Scalar: localhost:5050</li>
        <li>Storybook: localhost:6006</li>
      </ul>
    </div>
  </div>
</template>
