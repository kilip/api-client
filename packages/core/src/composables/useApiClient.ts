import { useApiEntrypoint } from './useApiEntrypoint'
import { useApiCore } from './useApiCore'
import { ApiFetchResponse } from '../types'
import { ApiError } from '../error'
import { useApiToken } from './useApiToken'
import isomorphicFetch from 'isomorphic-unfetch'
import { extractHubURL, parseJsonError } from '../utils/helpers'

export interface ApiClientFetchOptions extends RequestInit {
  params?: {[key: string]:string|number}
  onResponse?(response: Response): void
  onError?(data: {
    error: ApiError,
    response: Response
  }): void
}

export interface ApiClientFetchConfig {
  path: string
  baseURL: string
  options: ApiClientFetchOptions
}

export interface ApiClientPostFetchData extends ApiClientFetchConfig {
  response: Response
}


export const useApiClient = () => {
  const core = useApiCore()
  const baseURL = useApiEntrypoint()
  const token = useApiToken()

  return async <D>(path: string, options:ApiClientFetchOptions={}): Promise<ApiFetchResponse<D>> => {

    let data: D = undefined
    let error: ApiError = undefined
    let hubUrl: URL = undefined
    let response: Response = undefined

    const headers: HeadersInit = {
      Accept: 'application/ld+json'
    }

    const fetchOptions = {
      headers: {
        ...headers
      },
      ...options
    }
    // call prefetch hook
    await core.callHook('client:pre-fetch', { path, baseURL, options: fetchOptions})

    await isomorphicFetch(new URL(path, baseURL), fetchOptions)
      .then(resp => {
        response = resp
        if(options?.onResponse){
          options.onResponse(response)
        }
        if(response.ok){
          hubUrl = extractHubURL(response)
          return response.json()
        }
        return response.json()
          .then(json => {
            throw parseJsonError(json)
          }, () => {
            // @TODO: handle this json parse error correctly
            throw new ApiError(response.statusText)
          })
      })
      .then(json  => {
        data = json
      })
      .catch(e => {
        if(options?.onError){
          options.onError({ error, response })
        }
        error = e
      })

    // call post-fetch hook
    core.callHook('client:post-fetch', { path, baseURL, options, response })

    return {
      data,
      error,
      hubUrl,
    }

  }
}
