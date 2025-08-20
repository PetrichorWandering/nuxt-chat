import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxtjs/mdc'],
  ui: {
    fonts: false
  },
  mdc: {
    highlight: {
      theme: 'material-theme-palenight',
      langs: [
        'html','markdown','vue','typescript','javascript'
      ]
    }
  },
  runtimeConfig: {
    dashscopeApiKey: "",
    dashscopeBaseURL: "",
    public: {

    }
  }
})