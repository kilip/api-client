import type { ApiHydraItem, ApiResponseError } from '@doyolabs/api-client-core'
import { useApi } from '@doyolabs/api-client-core'
import { defineStore } from 'pinia'

export interface ApiUpdateState<ResourceT> {
  updated?: ResourceT
  retrieved?: ResourceT
  loading: boolean
  error?: ApiResponseError<ResourceT>
  hubUrl?: URL
}

export function makeUpdateStore<ResourceT extends ApiHydraItem> (
  resourceName: string,
  resourcePath: string
) {
  return defineStore(`${resourceName}.update`, {
    state: (): ApiUpdateState<ResourceT> => ({
      updated: undefined,
      retrieved: undefined,
      loading: false,
      error: undefined,
      hubUrl: undefined
    }),
    getters: {
      isLoading: (state) => {
        return state.loading
      },
      violations: (state) => {
        return state?.error?.violations
      }
    },
    actions: {
      toggleLoading () {
        this.loading = !this.loading
      },
      async load (id: string|number) {
        this.toggleLoading()
        this.error = undefined

        const { findOne } = useApi()
        const { item, hubUrl, error } = await findOne<ResourceT>(`${resourcePath}/${id}`)
        this.$patch({
          retrieved: item,
          hubUrl,
          error
        })

        this.toggleLoading()
      },
      async update (payload: ResourceT) {
        this.error = undefined
        this.toggleLoading()

        const { update } = useApi()
        const { updated, hubUrl, error } = await update<ResourceT>(payload['@id'], payload)

        this.$patch({
          updated,
          error,
          hubUrl
        })
        this.toggleLoading()
      }
    }
  })
}
