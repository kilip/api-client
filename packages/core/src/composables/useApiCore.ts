import { Hookable, createHooks } from 'hookable'
import { ApiClientFetchData, ApiClientFetchOptions } from './useApiClient'

export type ApiHookResult = Promise<void>

export interface ApiHooks {
  'client:fetch': (data: ApiClientFetchData) => Promise<any>
}

export interface ApiCoreOptions {

}

export class ApiCore extends Hookable<ApiHooks> {
  private static instance?: ApiCore

  options: ApiCoreOptions = {}

  private constructor(){
    super()
  }

  static getInstance(){
    if(!ApiCore.instance){
      ApiCore.instance = new ApiCore()
    }
    return ApiCore.instance
  }

  setOptions(options: ApiCoreOptions){
    this.options = {
      ...this.options,
      options
    }
  }
}

export function useApiCore(): ApiCore {
  return ApiCore.getInstance()
}
