import { ApiConfigOptions } from "../types";

class ApiConfig {
  private static options: ApiConfigOptions
  private static instance: ApiConfig

  private constructor(options: ApiConfigOptions){
    ApiConfig.options = options
  }

  getOptions(): ApiConfigOptions {
    return ApiConfig.options
  }

  setOptions(options: ApiConfigOptions){
    ApiConfig.options = options
  }

  public static getInstance(): ApiConfig {
    if(!ApiConfig.instance){
      const defaults: ApiConfigOptions = {
        entrypoint: 'https://localhost',
        prefix: '/'
      }
      ApiConfig.instance = new ApiConfig(defaults)
    }

    return ApiConfig.instance
  }

  get(name: string, defaults?: any){
    return ApiConfig.options[name] || defaults
  }

  set(name: string, value: any) {
    ApiConfig.options[name] = value
  }
}

export const useConfig = (): ApiConfig => {
  return ApiConfig.getInstance()
}
