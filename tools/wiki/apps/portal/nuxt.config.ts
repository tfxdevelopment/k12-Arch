// https://nuxt.com/docs/api/configuration/nuxt-config
const nodeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-01-15',

  routeRules: {
    '/': { prerender: true }
  },

  runtimeConfig: {
    docsUpstream: nodeEnv.IDP_DOCS_UPSTREAM || 'http://localhost:4321',
    scalarUpstream: nodeEnv.IDP_SCALAR_UPSTREAM || 'http://localhost:5050',
    storybookUpstream: nodeEnv.IDP_STORYBOOK_UPSTREAM || 'http://localhost:6006,http://localhost:6016'
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
