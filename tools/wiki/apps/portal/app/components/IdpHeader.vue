<script setup lang="ts">
const route = useRoute();

const links = [
  { label: 'Dashboard', to: '/' },
  { label: 'Integrated Docs', to: '/docs' },
  { label: 'API Reference', to: '/api-reference' },
  { label: 'Component Catalog', to: '/storybook' },
  { label: 'Platform Tools', to: '/platform/tools' },
  { label: 'Platform Logs', to: '/platform/logs' }
];

function isActive(path: string) {
  const normalized = path.endsWith('/') ? path.slice(0, -1) : path;
  return route.path === normalized || route.path.startsWith(normalized + '/');
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 border-b border-slate-800 bg-slate-950/95 backdrop-blur z-50">
    <div class="max-w-[96rem] mx-auto px-4 md:px-6 py-2">
      <div class="h-12 flex items-center justify-between">
        <NuxtLink to="/" class="text-lg font-bold tracking-tight text-white">
          MyPortal <span class="text-emerald-400">IDP</span>
        </NuxtLink>
        <span class="text-xs text-slate-400 border border-slate-700 rounded-full px-2 py-0.5">CAF + WAF</span>

        <nav class="hidden md:flex items-center gap-2">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="text-sm px-3 py-1.5 rounded-md transition-colors border"
            :class="isActive(link.to) ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800 border-transparent'"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>

      <nav class="md:hidden idp-mobile-strip flex items-center gap-2 overflow-x-auto pt-1 pb-2">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="text-xs whitespace-nowrap px-2.5 py-1.5 rounded-md transition-colors border"
          :class="isActive(link.to) ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800 border-transparent'"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
