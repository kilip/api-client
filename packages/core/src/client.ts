import type { FetchError, FetchOptions } from 'ofetch'
import { $fetch } from 'ofetch'
import { stringify } from 'qs'
import { useApiCore } from './core'
import { useApiEntrypoint } from './entrypoint'

export interface ApiClientOptions extends FetchOptions {
  params?: {[key: string]: any}
}

export interface ApiClientConfig {
  url: string
  baseURL: string
  fetchOptions: ApiClientOptions
}

export interface ApiClientReponse<DataT> {
  data: DataT | undefined
  error: FetchError | undefined
  hubUrl: URL | undefined
}

export const extractHubURL = (response: Response): undefined | URL => {
  if (!response) {
    return
  }

  const linkHeader = response.headers.get('Link')
  if (!linkHeader) { return undefined }

  const matches = linkHeader.match(
    /<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/
  )

  return matches && matches[1] ? new URL(matches[1], useApiEntrypoint()) : undefined
}

export const useApiClient = () => {
  const core = useApiCore()
  const { defaultMimeType } = core.options
  const baseURL = useApiEntrypoint()

  return async <DataT>(
    url: string,
    fetchOptions: ApiClientOptions = {}
  ): Promise<ApiClientReponse<DataT>> => {
    const headers: HeadersInit = {}

    headers.Accept = defaultMimeType

    if (fetchOptions?.params) {
      const params = stringify(fetchOptions.params, { encodeValuesOnly: true })
      url = `${url}?${params}`
      delete fetchOptions.params
    }

    const defaults = {
      parseResponse: JSON.parse
    }

    fetchOptions = {
      retry: 0,
      baseURL,
      ...defaults,
      ...fetchOptions,
      headers: {
        ...headers,
        ...fetchOptions.headers
      }
    }
    const fetchConfig = {
      url,
      baseURL,
      fetchOptions
    }
    await core.callHook('client:pre-fetch', fetchConfig)

    let error
    let data: DataT|undefined
    let hubUrl

    const response = await $fetch.raw(url, fetchConfig.fetchOptions)
      .catch((e) => { error = e })

    if (response) {
      data = response._data
      hubUrl = extractHubURL(response)
    }

    await core.callHook('client:post-fetch', fetchConfig)

    return {
      data,
      error,
      hubUrl
    }
  }
}
