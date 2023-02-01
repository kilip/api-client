import type { ApiHydraItem, ApiResponseError } from '@kilip/api-client-core'
import { useApi } from '@kilip/api-client-core'
import { defineStore } from 'pinia'

export interface ApiRemoveState<ResourceT> {
  removed?: ResourceT
  mercureRemoved?: ResourceT
  loading: boolean
  error?: ApiResponseError<ResourceT>
}

export function makeRemoveStore<ResourceT extends ApiHydraItem> (
  resourceName: string
) {
  return defineStore(`${resourceName}.remove`, {
    state: (): ApiRemoveState<ResourceT> => ({
      removed: undefined,
      mercureRemoved: undefined,
      loading: false,
      error: undefined
    }),
    actions: {
      toggleLoading () {
        this.loading = !this.loading
      },
      async remove (item: ResourceT) {
        this.error = undefined
        this.toggleLoading()

        const { remove } = useApi()
        const { error } = await remove<ResourceT>(item['@id'])

        this.$patch({
          removed: item,
          mercureRemoved: undefined,
          error
        })

        this.toggleLoading()
      }
    }
  })
}
