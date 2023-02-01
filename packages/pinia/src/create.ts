import type { ApiResponseError } from '@kilip/api-client-core'
import { useApi } from '@kilip/api-client-core'
import { defineStore } from 'pinia'

export interface ApiCreateState<ResourceT> {
  created?: ResourceT
  loading: boolean
  error?: ApiResponseError<ResourceT>
}

export function makeCreateStore<ResourceT> (resourceName: string, resourcePath: string) {
  return defineStore(`${resourceName}.create`, {
    state: (): ApiCreateState<ResourceT> => ({
      created: undefined,
      loading: false,
      error: undefined
    }),
    getters: {
      violations: (state) => {
        return state.error?.violations
      }
    },
    actions: {
      toggleLoading () {
        this.loading = !this.loading
      },
      async create (payload: ResourceT) {
        this.toggleLoading()
        this.error = undefined
        const { create } = useApi()
        const { created, error } = await create<ResourceT>(resourcePath, payload)

        this.$patch({
          created,
          error
        })
        this.toggleLoading()
      }
    }
  })
}
