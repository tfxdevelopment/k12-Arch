<template>
  <div class="space-y-1">
    <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
      Documentation
    </h3>

    <NuxtLink
      v-for="item in navigation"
      :key="item.to"
      :to="item.to"
      class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
      :class="[
        item.children ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400',
        'hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
      ]"
      active-class="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
    >
      <component :is="item.icon" v-if="item.icon" class="mr-3 h-5 w-5 flex-shrink-0" />
      {{ item.title }}
    </NuxtLink>

    <!-- Collapsible sections -->
    <div v-for="section in sections" :key="section.title" class="pt-4">
      <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {{ section.title }}
      </h3>
      <div class="mt-1 space-y-1">
        <NuxtLink
          v-for="item in section.items"
          :key="item.to"
          :to="item.to"
          class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-md hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          active-class="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
        >
          {{ item.title }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const navigation = [
  { title: 'Home', to: '/' },
  { title: 'Getting Started', to: '/getting-started' }
]

const sections = [
  {
    title: 'Architecture',
    items: [
      { title: 'Overview', to: '/architecture' },
      { title: 'System Design', to: '/architecture/system-design' },
      { title: 'Security', to: '/architecture/security' },
      { title: 'Data Architecture', to: '/architecture/data' }
    ]
  },
  {
    title: 'Development',
    items: [
      { title: 'Setup Guide', to: '/development/setup' },
      { title: 'Backend', to: '/development/backend' },
      { title: 'Frontend', to: '/development/frontend' },
      { title: 'Testing', to: '/development/testing' }
    ]
  },
  {
    title: 'Operations',
    items: [
      { title: 'Deployment', to: '/operations/deployment' },
      { title: 'Monitoring', to: '/operations/monitoring' },
      { title: 'Security', to: '/operations/security' }
    ]
  }
]
</script>
