import { ApiAssociativeArray, useApiFind } from "@kilip/api-client-core"
import { makeListStore } from "./list"


export function defineResource<NameT>(
  resourceName: string,
  resourcePath?: string
){
  const path = resourcePath ? resourcePath:`/${resourceName}`
  const useListStore = makeListStore<NameT>(resourceName)

  const find = async (params?: ApiAssociativeArray<string|number>): Promise<NameT[]> => {
    const store = useListStore()
    const api = useApiFind()

    store.toggleLoading()
    const resp = await api<NameT>(path, params )
    store.setData(resp)
    store.toggleLoading()
    return resp.items
  }

  return {
    find,
    useListStore,
  }
}
