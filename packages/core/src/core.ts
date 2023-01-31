import { Hookable } from 'hookable'
import { ApiClientConfig } from "./client"

export type ApiHookResult = Promise<void>

export interface ApiHooks {
  'client:pre-fetch': (params: ApiClientConfig) => ApiHookResult
  'client:post-fetch': (params: {
    config: ApiClientConfig,
    response: Response
  }) => ApiHookResult
}

export interface ApiCoreOptions {
  entrypoint: string
  prefix: string
  defaultMimeType: string
  token: string | Function | undefined
}

export type OptionKeys = keyof ApiCoreOptions & string

export class ApiCore extends Hookable<ApiHooks> {
  private static instance: ApiCore
  options: ApiCoreOptions

  private constructor(){
    super()
    this.options = {
      entrypoint: 'https://localhost',
      prefix: '/',
      token: undefined,
      defaultMimeType: 'application/ld+json'
    }
  }

  static getInstance(): ApiCore {
    if(!ApiCore.instance){
      ApiCore.instance = new this()
    }
    return ApiCore.instance
  }
}

export const useApiCore = () => ApiCore.getInstance()
