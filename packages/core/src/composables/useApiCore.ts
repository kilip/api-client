import { Hookable, createHooks } from 'hookable'
import { ApiClientFetchConfig, ApiClientFetchOptions, ApiClientPostFetchData } from './useApiClient'

export type ApiHookResult = Promise<void>

export interface ApiHooks {
  'client:pre-fetch': (data: ApiClientFetchConfig) => ApiHookResult,
  'client:post-fetch': (data: ApiClientPostFetchData) => ApiHookResult,
}

export interface ApiCoreOptions {
  entrypoint: string|undefined
  prefix: string|undefined
  token: string|undefined
}

export class ApiCore extends Hookable<ApiHooks> {
  private static instance: ApiCore = undefined

  static options: ApiCoreOptions

  private constructor(){
    super()

    this.setOptions({
      entrypoint: 'https://localhost',
      prefix: '/',
      token: undefined
    })
  }

  static getInstance(){
    if(!ApiCore.instance){
      ApiCore.instance = new ApiCore()
    }
    return ApiCore.instance
  }

  setOptions(options: ApiCoreOptions){
    ApiCore.options = {
      ...ApiCore.options,
      ...options
    }
  }

  getOption(name: string){
    return ApiCore.options[name]
  }

  setOption(name: string, value: any){
    ApiCore.options[name] = value
  }
}

export const useApiCore = ():ApiCore => {
  return ApiCore.getInstance()
}
