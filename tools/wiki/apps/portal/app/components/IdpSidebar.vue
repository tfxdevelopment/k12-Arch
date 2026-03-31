<script setup lang="ts">
import nav from '~/data/caf-waf-nav.json';

const workspaceLinks = [
  { label: 'Dashboard', to: '/' },
  { label: 'Integrated Docs', to: '/docs' },
  { label: 'API Reference', to: '/api-reference' },
  { label: 'Component Catalog', to: '/storybook' },
  { label: 'Platform Tools', to: '/platform/tools' },
  { label: 'Platform Logs', to: '/platform/logs' }
];

const sections = nav.sections;
const route = useRoute();

function isActive(path: string) {
  const normalized = path.endsWith('/') ? path.slice(0, -1) : path;
  return route.path === normalized || route.path.startsWith(normalized + '/');
}
</script>

<template>
  <div class="h-full overflow-y-auto px-4 py-5">
    <div class="mb-6">
      <h2 class="text-xs uppercase tracking-wider text-slate-500 font-semibold">Workspace</h2>
      <ul class="mt-3 space-y-1">
        <li v-for="item in workspaceLinks" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="block text-sm rounded-md px-3 py-2 transition-colors"
            :class="isActive(item.to) ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="mb-6" v-for="section in sections" :key="section.id">
      <h2 class="text-xs uppercase tracking-wider text-slate-500 font-semibold">{{ section.label }}</h2>
      <ul class="mt-3 space-y-1 border-l border-slate-800 pl-2">
        <li v-for="item in section.items" :key="item.id">
          <NuxtLink
            :to="item.portalPath"
            class="block text-sm rounded-md px-3 py-2 transition-colors"
            :class="isActive(item.portalPath) ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
