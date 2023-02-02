import type { ApiResponseError } from '@doyolabs/api-client-core'
import { useApi } from '@doyolabs/api-client-core'
import { defineStore } from 'pinia'

export interface ApiShowState<ResourceT> {
  retrieved?: ResourceT
  hubUrl?: URL
  error?: ApiResponseError<ResourceT>
  loading: boolean
}

export function makeShowStore<ResourceT> (
  resourceName: string
) {
  return defineStore(`${resourceName}.show`, {
    state: (): ApiShowState<ResourceT> => ({
      retrieved: undefined,
      hubUrl: undefined,
      error: undefined,
      loading: false
    }),
    actions: {
      toggleLoading () {
        this.loading = !this.loading
      },
      async retrieve (id: string) {
        this.toggleLoading()
        this.error = undefined
        const { findOne } = useApi()

        const { item, hubUrl, error } = await findOne<ResourceT>(id)

        this.$patch({
          retrieved: item,
          hubUrl,
          error
        })

        this.toggleLoading()
      }
    }
  })
}
