<script setup lang="ts">
import IntegratedSurface from '~/components/IntegratedSurface.vue';

const route = useRoute();

const slug = computed(() => {
  const raw = route.params.slug;
  if (!raw) return '';
  if (Array.isArray(raw)) return raw.join('/');
  return String(raw);
});

const target = computed(() => {
  if (!slug.value) return '/_docs/';
  return `/_docs/${slug.value}`;
});
</script>

<template>
  <IntegratedSurface
    title="Architecture Docs"
    description="Astro docs integrated through the IDP shell with deep-link support."
    :iframe-src="target"
    fallback-command="npm run dev:all"
  />
</template>
