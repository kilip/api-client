import { ApiClientFetchOptions, useApiFind } from "@kilip/api-client-core"
import { makeListStore } from "../utils"

export const useApiResource = <T>(
  name: string,
  prefix?: string
) => {
  prefix = prefix ? prefix:`/${name}`
  const path = prefix

  const useListStore = makeListStore<T>(name)

  const find = async (params?: ApiClientFetchOptions) => {
    const store = useListStore()
    const find = useApiFind()
    const response = await find<T>(path, params)
    store.setData(response)
    return store.items
  }

  return {
    name,
    prefix,
    useListStore,
    find,
  }
}
