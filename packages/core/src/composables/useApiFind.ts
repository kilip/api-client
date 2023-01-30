import { ApiFindResponse, ApiListView, ApiPagedCollection } from "../types"
import { ApiClientFetchOptions, useApiClient } from './useApiClient'

export const useApiFind = () => {
  const client = useApiClient()

  return async <T> (path: string, params = {}): Promise<ApiFindResponse<T>> => {
    let items: T[] = []
    let view: ApiListView|undefined = undefined
    let total: number = 0

    const options: ApiClientFetchOptions = { params }

    const {data, error, hubUrl} = await client<T>(path, options)

    if(!error){
      const value = data as ApiPagedCollection<T>
      items = value['hydra:member']
      view = value['hydra:view']
      total = value['hydra:totalItems']
    }


    return {
      items,
      view,
      error,
      hubUrl,
      total
    }
  }
}
