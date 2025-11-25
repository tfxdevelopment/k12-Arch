import {} from "@nuxt/content"
// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineContentConfig, defineCollectionSource, defineCollection } from '@nuxt/content'
export default defineNuxtConfig({
  compatibilityDate: '2025-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],

  content: {
    documentDriven: true,
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark'
      },
      preload: [
        'javascript',
        'typescript',
        'csharp',
        'sql',
        'bash',
        'json',
        'yaml',
        'markdown',
        'html',
        'css'
      ]
    },
    markdown: {
      toc: {
        depth: 3,
        searchDepth: 3
      },
      anchorLinks: true
    }
  },

  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light'
  },

  app: {
    head: {
      title: 'K12 MyPortal - Enterprise Architecture Documentation',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Enterprise architecture documentation for NC SEAA K-12 Scholarship Management System'
        }
      ]
    }
  }
})
