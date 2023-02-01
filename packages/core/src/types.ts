import type { FetchOptions, FetchRequest, FetchResponse, SearchParameters } from 'ofetch'

export interface ApiSubmissionErrors {
  [key: string]: string
}

export interface ApiResponseError<T> {
  request?: FetchRequest
  response?: FetchResponse<T>
  data?: any
  status?: number
  statusText?: string
  statusCode?: number
  statusMessage?: string
  violations?: ApiSubmissionErrors
}

export interface ApiQueryParams extends SearchParameters {}

export interface ApiFetchOptions extends FetchOptions {
  payload?: any
}

export interface ApiRequestConfig {
  url: string
  baseURL: string
  fetchOptions: ApiFetchOptions
}

export interface ApiResponse<DataT> {
  data?: DataT
  error?: ApiResponseError<DataT>
  hubUrl?: URL
  response?: FetchResponse<DataT>|any
}

export interface ApiHydraItem {
  '@context': string
  '@id': string
  '@type': string
}

export interface ApiPagedListView {
  '@id': string;
  'hydra:first': string;
  'hydra:last': string;
  'hydra:next': string;
  'hydra:previous': string;
}

export interface ApiPagedCollection<DataT> {
  '@context'?: string
  '@id'?: string
  '@type'?: string
  'hydra:member': DataT[]
  'hydra:search'?: object
  'hydra:totalItems'?: number
  'hydra:view': ApiPagedListView
}

export interface ApiFindResponse<DataT> {
  items?: DataT[]
  hubUrl?: URL
  error?: ApiResponseError<DataT>
  view?: ApiPagedListView
  totalItems?: number
}

export interface ApiFindOneResponse<DataT> {
  item?: DataT
  error?: ApiResponseError<DataT>
  hubUrl?: URL
}

export interface ApiUpdateResponse<DataT> {
  updated?: DataT
  error?: ApiResponseError<DataT>
  hubUrl?: URL
}

export interface ApiCreateResponse<DataT> {
  created?: DataT
  error?: ApiResponseError<DataT>
  hubUrl?: URL
}
