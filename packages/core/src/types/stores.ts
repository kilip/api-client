import { ApiSubmissionErrors } from '../error/ApiSubmissionErrors'
import { ApiError } from '../error/ApiError'

export interface ApiListView {
  '@id': string
  'hydra:first': string
  'hydra:last': string
  'hydra:next': string
  'hydra:previous': string
}

export interface ApiListState<T> {
  items: T[]
  hubUrl?: URL
  loading: boolean
  view?: ApiListView
  error?: string
}

export interface ApiFindData<T> {
  items: T[]
  view: ApiListView | undefined
  error: ApiError | null
  hubUrl: URL | undefined
  total: number
}

export interface ApiFindItemData<T> {
  retrieved: T | undefined
  loading: boolean
  error: Error | null
  hubUrl: URL | undefined
}

export interface ApiCreateItemData<T> {
  created: T | undefined
  loading: boolean
  error: Error | null
  violations: ApiSubmissionErrors | undefined
}

export interface ApiUpdateItemData<T> {
  loading: boolean
  error: Error | null
  violations: ApiSubmissionErrors | undefined
}

export interface ApiPagedCollection<T> {
  '@context'?: string
  '@id'?: string
  '@type'?: string
  'hydra:member': T[]
  'hydra:search'?: object
  'hydra:totalItems'?: number
  'hydra:view': ApiListView
}
