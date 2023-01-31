import type { ApiPagedListView, ApiFindResponse, ApiQueryParams, ApiPagedCollection } from '@kilip/api-client-core'
import { defineStore } from 'pinia'
import type { FetchError } from 'ofetch'
import { useApi } from '@kilip/api-client-core'

export interface ApiListState<ResourceT> {
  items: ResourceT[]
  hubUrl: URL|undefined
  error: FetchError|undefined
  totalItems: number
  view: ApiPagedListView|undefined
  loading: boolean
}

export function makeListStore<ResourceT> (
  resourceName: string,
  resourcePath: string
) {
  return defineStore(`${resourceName}.list`, {
    state: (): ApiListState<ResourceT> => ({
      items: [],
      hubUrl: undefined,
      error: undefined,
      view: undefined,
      totalItems: 0,
      loading: false
    }),
    getters: {},
    actions: {
      toggleLoading () {
        this.loading = !this.loading
      },
      setData ({ items, hubUrl, error, totalItems, view }: ApiFindResponse<ResourceT>) {
        this.$patch({
          items
        })
        this.error = error
        this.view = view
        this.totalItems = totalItems || 0
        this.hubUrl = hubUrl
      },
      setTotalItems (totalItems?: number) {
        this.totalItems = totalItems || 0
      },
      setError (error?: FetchError) {
        this.error = error
      },
      setItems (items: ResourceT[]) {
        this.$patch({ items })
      },
      setView (view?: ApiPagedListView) {
        this.view = view
      },
      async loadItems (params?: ApiQueryParams) {
        const api = useApi()
        const { data, error, hubUrl } = await api<ApiPagedCollection<ResourceT>>(resourcePath, { params })

        if (data) {
          this.setView(data['hydra:view'])
          this.setTotalItems(data['hydra:totalItems'])
          this.setItems(data['hydra:member'])
        }
        this.hubUrl = hubUrl
        this.error = error
      }
    }
  })
}
