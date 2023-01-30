import { ApiFindData, ApiListView, ApiPagedCollection } from "../types"
import { ApiClientFetchOptions, useApiClient } from './useApiClient'
import { ApiError } from "../error/ApiError"

export const useApiFind = () => {
  const client = useApiClient()

  return async <T> (path: string, params = {}): Promise<ApiFindData<T>> => {
    let items: T[] = []
    let view: ApiListView|undefined = undefined
    let hubUrl: URL|undefined = undefined
    let total: number = 0

    const options: ApiClientFetchOptions = { params }

    const {data, error} = await client<T, ApiError>(path, options)

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
