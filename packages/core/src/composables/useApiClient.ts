import { useApiEntrypoint } from "./useApiEntrypoint"
import { useApiCore } from "./useApiCore"
import { ApiFetchResponse } from "../types"
import { ApiError } from "../error"

export interface ApiClientFetchOptions extends RequestInit {
  params?: {[key: string]:string|number}
  onResponse?(response: Response): void
  onError?(response: Response, error: ApiError): void
}

export interface ApiClientFetchData {
  path: string
  baseURL: string
  options: ApiClientFetchOptions
}

export const useApiClient = () => {
  const core = useApiCore()
  const baseURL = useApiEntrypoint()

  return async <D,E>(path: string, options:ApiClientFetchOptions={}): Promise<ApiFetchResponse<D,E>> => {
    return core.callHook('client:fetch', {
      path,
      baseURL,
      options
    }) as Promise<ApiFetchResponse<D,E>>
  }
}
