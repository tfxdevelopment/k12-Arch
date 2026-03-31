<script setup lang="ts">
import IntegratedSurface from '~/components/IntegratedSurface.vue';
</script>

<template>
  <IntegratedSurface
    title="API Reference"
    description="Scalar API reference integrated through the IDP shell."
    iframe-src="/_api-reference/"
    fallback-command="npm run dev:all"
  />
</template>
