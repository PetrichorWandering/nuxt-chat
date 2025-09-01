// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  ui: {
    fonts: false
  },
  // 添加这个配置来忽略 Vite 内部路径
  router: {
    options: {
      strict: false
    }
  },
  nitro: {
    storage: {
      db: {
        driver: 'fs',
        base: './.data'
      },
    },
  },

  $production: {
    nitro: {
      storage: {
        db: {
          driver: 'netlify-blobs',
          base: 'db'
        },
      },
    },
  }
})
