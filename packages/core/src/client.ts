import type { FetchError, FetchRequest, FetchResponse } from 'ofetch'
import { $fetch } from 'ofetch'
import { stringify } from 'qs'
import { useApiCore } from './core'
import { useApiEntrypoint } from './entrypoint'
import type { ApiFetchOptions, ApiResponse, ApiResponseError, ApiSubmissionErrors, ApiViolation } from './types'

class _ApiResponseError<T> extends Error implements ApiResponseError<T> {
  request?: FetchRequest
  response?: FetchResponse<T>
  data?: any
  status?: number
  statusText?: string
  statusCode?: number
  statusMessage?: string
  violations?: ApiSubmissionErrors

  constructor (e: FetchError) {
    super(e.message)
    this.fromFetchError(e)
  }

  fromFetchError (e: FetchError) {
    const { request, response, data, status, statusCode, statusMessage, statusText } = e
    this.request = request
    this.response = response
    this.data = data
    this.status = status
    this.statusCode = statusCode
    this.statusMessage = statusMessage
    this.statusText = statusText
    this.violations = {}

    if (data?.violations) {
      this.parseViolations(data?.violations)
    }
  }

  private parseViolations (violations: ApiViolation[]) {
    this.violations = {}
    for (const val of violations) {
      this.violations[val.propertyPath] = val
    }
  }
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
    fetchOptions: ApiFetchOptions = {}
  ): Promise<ApiResponse<DataT>> => {
    const headers: HeadersInit = {}

    if (defaultMimeType) {
      headers.Accept = defaultMimeType
    }
    headers.mode = 'cors'

    const { payload, body } = fetchOptions

    if (payload && !body) {
      fetchOptions.body = JSON.stringify(payload)
    }

    if (fetchOptions?.params) {
      const params = stringify(fetchOptions.params, { encodeValuesOnly: true})
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

    let error: ApiResponseError<DataT>|undefined

    let data: DataT|undefined
    let hubUrl

    const response = await $fetch.raw(url, fetchConfig.fetchOptions)
      .catch((e) => {
        error = new _ApiResponseError<DataT>(e)
      })

    if (response) {
      data = response._data
      hubUrl = extractHubURL(response)
    }

    await core.callHook('client:post-fetch', fetchConfig)

    return {
      data,
      error,
      hubUrl,
      response
    }
  }
}
