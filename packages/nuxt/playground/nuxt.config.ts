export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '../src/module'
  ],
  api: {
    "entrypoint": "https://demo.api-platform.com",
    "prefix": "/",
    "defaultMimeType": "application/ld+json"
  },
  ssr: false,
  router: {
    options: {
      hashMode: true
    }
  }
})
