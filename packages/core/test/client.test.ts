import { describe, expect, it } from 'vitest'
import type { ApiRequestConfig, ApiResponse, ApiPagedCollection } from '../src'
import { useApiClient, useApiCore } from '../src'
import type { User } from './types'

describe('useApiClient', () => {
  it('should fetch successfully', async () => {
    const core = useApiCore()
    const client = useApiClient()
    // eslint-disable-next-line require-await
    const preFetch = async (data: ApiRequestConfig): Promise<void> => {
      expect(data.url).toBe('/users?sort[name]=asc')
      return Promise.resolve()
    }
    core.hookOnce('client:pre-fetch', preFetch)

    const params = {
      sort: { name: 'asc' }
    }

    const { data, hubUrl, error } = await client<ApiResponse<User[]>>('/users', { params })

    expect(data).toBeDefined()
    expect(hubUrl).toBeDefined()
    expect(error).toBeUndefined()
  })

  it('should handle 401 error', async () => {
    const client = useApiClient()
    const { data, hubUrl, error } = await client<ApiPagedCollection<User>>('/error/401')

    expect(data).toBeUndefined()
    expect(hubUrl).toBeUndefined()
    expect(error).toBeDefined()

    expect(error?.data).toStrictEqual({
      code: 401,
      message: 'Invalid credentials.'
    })
  })

  it('should handle violations data', async () => {
    const client = useApiClient()
    const { data, hubUrl, error } = await client<ApiPagedCollection<User>>('/users/violations')

    expect(data).toBeUndefined()
    expect(hubUrl).toBeUndefined()
    expect(error).toBeDefined()
    expect(error?.violations).toBeDefined()
    expect(error?.violations?.isbn).toBeDefined()
    expect(error?.violations?.other).toBeDefined()
    expect(error?.violations?.other.propertyPath).toBeDefined()
    expect(error?.violations?.other.message).toBeDefined()
    expect(error?.violations?.other.code).toBeDefined()
  })
})
