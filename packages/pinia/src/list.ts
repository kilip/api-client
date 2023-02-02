import { useApi } from '@doyolabs/api-client-core'
import type { ApiPagedListView, ApiFindResponse, ApiQueryParams, ApiResponseError } from '@doyolabs/api-client-core'
import { defineStore } from 'pinia'

export interface ApiListState<ResourceT> {
  items?: ResourceT[]
  hubUrl?: URL|undefined
  error?: ApiResponseError<ResourceT>
  totalItems?: number
  view?: ApiPagedListView
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
      setData ({ items, hubUrl, error, totalItems, view }: ApiFindResponse<ResourceT>) {
        this.setItems(items as ResourceT[])
        this.setHubUrl(hubUrl)
        this.setError(error)
        this.setTotalItems(totalItems)
        this.setView(view)
      },
      setTotalItems (totalItems?: number) {
        this.totalItems = totalItems || 0
      },
      setError (error?: ApiResponseError<ResourceT>) {
        this.$patch({ error })
      },
      setItems (items?: ResourceT[]) {
        this.$patch({ items })
      },
      setView (view?: ApiPagedListView) {
        this.view = view
      },
      setHubUrl (hubUrl?: URL) {
        this.hubUrl = hubUrl
      },
      toggleLoading () {
        this.loading = !this.loading
      },

      async loadItems (params?: ApiQueryParams) {
        this.toggleLoading()
        const { find } = useApi()
        const data = await find<ResourceT>(resourcePath, params)
        this.setData(data)
        this.toggleLoading()
      }
    }
  })
}
