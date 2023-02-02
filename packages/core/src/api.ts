import type {
  ApiResponseError,
  ApiFindResponse,
  ApiPagedCollection,
  ApiPagedListView,
  ApiFindOneResponse,
  ApiQueryParams
} from './types'
import { useApiClient } from './client'

export const useApi = () => {
  const client = useApiClient()

  const find = <T>(path: string, params?: ApiQueryParams): Promise<ApiFindResponse<T>> => {
    let view: ApiPagedListView|undefined
    let items: T[] = []
    let totalItems: number | undefined
    return client<ApiPagedCollection<T>>(path, { params })
      .then(({ data, hubUrl, error }) => {
        if (data) {
          view = data['hydra:view']
          items = data['hydra:member']
          totalItems = data['hydra:totalItems']
        }
        return {
          items,
          hubUrl,
          error: error as ApiResponseError<T>,
          view,
          totalItems
        }
      })
  }

  const findOne = <T>(url: string, params?: ApiQueryParams): Promise<ApiFindOneResponse<T>> => {
    return client<T>(url, { params })
      .then(({ data, hubUrl, error }) => {
        return {
          item: data,
          hubUrl,
          error
        }
      })
  }

  const create = <T>(path: string, payload: T) => {
    const options = {
      method: 'POST',
      body: JSON.stringify(payload)
    }
    return client<T>(path, options)
      .then(({ data, hubUrl, error }) => {
        return {
          created: data,
          hubUrl,
          error
        }
      })
  }

  const update = <T extends BodyInit | Record<string, any> | null | undefined>(path: string, payload: T) => {
    const options = {
      method: 'PUT',
      body: payload
    }
    return client<T>(path, options)
      .then(({ data, hubUrl, error }) => {
        return {
          updated: data,
          hubUrl,
          error
        }
      })
  }

  const remove = <T>(path: string) => {
    return client<T>(path, { method: 'DELETE' })
  }

  return {
    find,
    findOne,
    create,
    update,
    remove
  }
}
