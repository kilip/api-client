import { defineNuxtPlugin } from '#app'
import { ApiCoreOptions, useApiCore } from '@doyolabs/api-client-core'

export default defineNuxtPlugin(() => {
  const core = useApiCore()
  const config = useRuntimeConfig()
  const options = config.public.api as ApiCoreOptions

  core.options = {
    ...core.options,
    ...options
  }

})
