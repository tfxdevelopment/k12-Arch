<script setup lang="ts">
import IntegratedSurface from '~/components/IntegratedSurface.vue';
</script>

<template>
  <IntegratedSurface
    title="Component Catalog"
    description="Storybook-style component catalog integrated through the IDP shell."
    iframe-src="/_storybook/"
    fallback-command="npm run dev:all"
  />
</template>
