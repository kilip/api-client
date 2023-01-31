import { ApiPagedListView, ApiFindResponse } from '@kilip/api-client-core'
import { defineStore } from 'pinia'
import { FetchError} from 'ofetch'

export interface ApiListState<ResourceT> {
  items: ResourceT[]
  hubUrl: URL|undefined
  error: FetchError|undefined
  totalItems: number
  view: ApiPagedListView|undefined
  loading: boolean
}

export function makeListStore<ResourceT>(resourceName: string) {
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
      toggleLoading(){
        this.loading = !this.loading
      },
      setData({ items, hubUrl, error, totalItems, view}: ApiFindResponse<ResourceT>){
        this.$patch({
          items
        })
        this.error = error
        this.view = view
        this.totalItems = totalItems ? totalItems:0
        this.hubUrl = hubUrl
      }
    },
  })
}
