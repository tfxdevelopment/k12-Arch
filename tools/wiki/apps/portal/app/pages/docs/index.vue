<script setup lang="ts">
import IntegratedSurface from '~/components/IntegratedSurface.vue';
</script>

<template>
  <IntegratedSurface
    title="Architecture Docs"
    description="Astro docs integrated through the IDP shell with CAF and WAF navigation."
    iframe-src="/_docs/"
    fallback-command="npm run dev:all"
  />
</template>
