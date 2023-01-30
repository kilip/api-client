export * from './stores'

export interface ApiItem {
  '@id': string
}

export interface ApiFetchResponse<DataT,ErrorT> {
  data: DataT | null
  error: ErrorT | null
}

export interface ApiConfigOptions {
  entrypoint: string
  prefix: string
}
