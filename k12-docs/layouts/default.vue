<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-3">
              <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">K12</span>
              <span class="text-gray-900 dark:text-white font-semibold">MyPortal Docs</span>
            </NuxtLink>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Search (placeholder) -->
            <button class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
              <span class="hidden sm:inline">Search documentation...</span>
              <span class="sm:hidden">Search</span>
            </button>

            <!-- Color Mode Toggle -->
            <ColorModeButton />
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <!-- Sidebar Navigation -->
        <aside class="hidden lg:block lg:col-span-3">
          <nav class="sticky top-24 space-y-1">
            <SidebarNav />
          </nav>
        </aside>

        <!-- Main Content Area -->
        <main class="lg:col-span-9">
          <article class="prose prose-blue dark:prose-invert max-w-none">
            <slot />
          </article>

          <!-- Table of Contents (right sidebar) -->
          <aside class="hidden xl:block fixed right-4 top-24 w-64">
            <div class="sticky top-24">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">On this page</h3>
              <TableOfContents />
            </div>
          </aside>
        </main>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-12 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-500 dark:text-gray-400 text-sm">
          K12 MyPortal Enterprise Architecture Documentation &copy; {{ new Date().getFullYear() }}
        </p>
        <p class="text-center text-gray-400 dark:text-gray-500 text-xs mt-2">
          SEAA • College Foundation, Inc
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Layout setup
</script>
