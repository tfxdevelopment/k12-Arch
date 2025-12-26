<template>
  <nav v-if="toc && toc.links && toc.links.length" class="space-y-2">
    <div v-for="link in toc.links" :key="link.id">
      <a
        :href="`#${link.id}`"
        class="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        :class="{ 'font-medium text-blue-600 dark:text-blue-400': activeHeading === link.id }"
      >
        {{ link.text }}
      </a>

      <!-- Nested headings -->
      <div v-if="link.children && link.children.length" class="ml-3 mt-1 space-y-1">
        <a
          v-for="child in link.children"
          :key="child.id"
          :href="`#${child.id}`"
          class="block text-xs text-gray-500 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          :class="{ 'font-medium text-blue-600 dark:text-blue-400': activeHeading === child.id }"
        >
          {{ child.text }}
        </a>
      </div>
    </div>
  </nav>
  <div v-else class="text-sm text-gray-400 dark:text-gray-600">
    No headings found
  </div>
</template>

<script setup>
const { page } = useContent()
const toc = computed(() => page.value?.body?.toc)
const activeHeading = ref(null)

// Track active heading on scroll
if (process.client) {
  onMounted(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeHeading.value = entry.target.id
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    const headings = document.querySelectorAll('h2, h3')
    headings.forEach((heading) => {
      observer.observe(heading)
    })

    onUnmounted(() => {
      observer.disconnect()
    })
  })
}
</script>
