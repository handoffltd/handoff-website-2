import fs from 'node:fs'
import path from 'node:path'

// Helper function to read a directory and extract slugs from .md files
function getSlugsFromDirectory(dirPath: string) {
  try {
    const fullPath = path.resolve(process.cwd(), dirPath)
    const files = fs.readdirSync(fullPath)

    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, '')) // Remove the .md extension to get the slug
  } catch (error) {
    console.warn(`Could not read directory: ${dirPath}`, error)
    return []
  }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [// Module order is critical. @nuxtjs/sitemap must come before @nuxt/content in your modules array.
    '@nuxt/eslint', '@nuxt/ui', '@nuxtjs/robots', '@nuxtjs/sitemap', 'nuxt-schema-org', '@nuxt/content', 'nuxt-studio'],

  css: ['~/assets/css/main.css'],

  devtools: { enabled: false },

  compatibilityDate: '2024-07-11',

  content: {
    experimental: { sqliteConnector: 'better-sqlite3' },
  },

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: false
    }
  },

  site: {
    url: 'https://www.handoff.chat',
    name: 'Handoff'
  },

  sitemap: {
    // Dynamically generate the programmatic SEO URLs
    urls: () => {
      // Integrations URLs
      // Read the directories based on your content.config.ts structure
      const channels = getSlugsFromDirectory('content/channels')
      const agents = getSlugsFromDirectory('content/ai-agents')

      const routes = []

      // Create the matrix of all combinations dynamically
      for (const channel of channels) {
        for (const agent of agents) {
          routes.push(`/integrations/${channel}-with-${agent}`)
        }
      }

      return routes
    },
  },

  studio: {
    repository: {
      provider: 'github', // 'github' or 'gitlab'
      owner: 'dipbhi',
      repo: 'handoff-website-2',
      branch: 'main'
    }
  },

  vite: {
    optimizeDeps: {
      include: ['zod']
    }
  }
})