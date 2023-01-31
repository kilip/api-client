import type { FetchError } from 'ofetch'
import type { ApiAssociativeArray } from './types'
import { useApiClient } from './client'

export interface ApiPagedListView {
  '@id': string;
  'hydra:first': string;
  'hydra:last': string;
  'hydra:next': string;
  'hydra:previous': string;
}

export interface ApiPagedCollection<DataT> {
  '@context'?: string
  '@id'?: string
  '@type'?: string
  'hydra:member': DataT[]
  'hydra:search'?: object
  'hydra:totalItems'?: number
  'hydra:view': ApiPagedListView
}

export interface ApiFindResponse<DataT> {
  items: DataT[]
  hubUrl: URL|undefined
  error: FetchError|undefined
  view: ApiPagedListView|undefined
  totalItems: number|undefined
}

export interface ApiQueryParams {
  [key: string]: number|string
}

export const useApiFind = () => {
  const client = useApiClient()

  return async <DataT>(path: string, params?: ApiAssociativeArray<string|number|undefined>): Promise<ApiFindResponse<DataT>> => {
    const { data, hubUrl, error } = await client<ApiPagedCollection<DataT>>(path, { params })

    let view
    let items: DataT[] = []
    let totalItems:number|undefined

    if (data) {
      view = data['hydra:view']
      items = data['hydra:member']
      totalItems = data['hydra:totalItems']
    }
    return {
      items,
      hubUrl,
      error,
      view,
      totalItems
    }
  }
}
