import { Hookable } from 'hookable'
import type { ApiRequestConfig } from './types'

export type ApiHookResult = Promise<void>

export interface ApiHooks {
  'client:pre-fetch': (params: ApiRequestConfig) => ApiHookResult
  'client:post-fetch': (params: ApiRequestConfig) => ApiHookResult
}

export interface ApiCoreOptions {
  entrypoint?: string
  prefix?: string
  defaultMimeType?: string
  token?: string | Function | undefined
}

export type OptionKeys = keyof ApiCoreOptions & string

export class ApiCore extends Hookable<ApiHooks> {
  // eslint-disable-next-line no-use-before-define
  private static instance: ApiCore
  options: ApiCoreOptions

  private constructor () {
    super()
    this.options = {
      entrypoint: 'https://localhost',
      prefix: '/',
      token: undefined,
      defaultMimeType: 'application/ld+json'
    }
  }

  static getInstance (): ApiCore {
    if (!ApiCore.instance) {
      ApiCore.instance = new this()
    }
    return ApiCore.instance
  }

  setOptions (options: ApiCoreOptions) {
    this.options = {
      ...this.options,
      ...options
    }
  }
}

export const useApiCore = () => ApiCore.getInstance()
