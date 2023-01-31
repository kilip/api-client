import { useApiFind } from '@kilip/api-client-core'
import type { ApiQueryParams } from '@kilip/api-client-core/src/api'
import { makeListStore } from './list'

export function defineResource<NameT> (
  resourceName: string,
  resourcePath?: string
) {
  const path = resourcePath || `/${resourceName}`
  const useListStore = makeListStore<NameT>(resourceName, path)

  const find = async (params?: ApiQueryParams): Promise<void> => {
    const store = useListStore()
    const api = useApiFind()

    store.toggleLoading()
    const resp = await api<NameT>(path, params)
    store.setData(resp)
    store.toggleLoading()
  }

  return {
    find,
    useListStore
  }
}
