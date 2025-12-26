<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - K12 Architecture Docs` : 'K12 MyPortal - Enterprise Architecture Documentation'
  }
})
</script>
