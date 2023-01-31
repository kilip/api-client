import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { ApiCoreOptions, useApiCore } from '@kilip/api-client-core'
import { defu } from 'defu'
// Module options TypeScript inteface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@kilip/api-client-nuxt',
    configKey: 'api'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    entrypoint: "https://localhost",
    prefix: "",
    defaultMimeType: 'application/ld+json'
  },
  setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const core = useApiCore()
    core.options = options as ApiCoreOptions

    // Default runtimeConfig
    nuxt.options.runtimeConfig.public.api = defu(nuxt.options.runtimeConfig.public.api, options)
    nuxt.options.runtimeConfig.api = defu(nuxt.options.runtimeConfig.api, options)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
  }
})

declare module '@nuxt/schema' {
  interface ConfigSchema {
    publicRuntimeConfig?: {
      api?: ApiCoreOptions
    }
  }
}
