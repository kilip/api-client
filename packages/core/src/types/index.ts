import { ApiError } from '../error'

export * from './stores'

export interface ApiItem {
  '@id': string
}

export interface ApiFetchResponse<DataT> {
  data: DataT | undefined
  error: ApiError | undefined
  hubUrl: URL | undefined
}

export interface ApiConfigOptions {
  entrypoint: string
  prefix: string
}
