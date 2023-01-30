import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import { ApiError, ApiFindResponse, ApiListView } from '@kilip/api-client-core'

export interface ApiListState<T> {
  items: Ref<T[]>
  hubUrl: Ref<URL|undefined>
  error: Ref<ApiError | undefined>
  total: Ref<number>
  view: Ref<ApiListView|undefined>
}

export function makeListStore<T>(resourceName: string) {
  return defineStore(`${resourceName}.list`, {
    state: (): ApiListState<T> => ({
      items: ref([]),
      hubUrl: ref(undefined),
      error: ref(undefined),
      view: ref(undefined),
      total: ref(0),
    }),
    getters: {},
    actions: {
      setData({ items, hubUrl, error, total, view}: ApiFindResponse<T>){
        this.items = ref(items)
        this.error = ref(error)
        this.view = ref(view)
        this.total = ref(total)
        this.hubUrl = ref(hubUrl)
      }
    },
  })
}
