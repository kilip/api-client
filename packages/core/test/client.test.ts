import { describe, expect, it } from 'vitest'
import type { ApiClientConfig, ApiClientReponse, ApiPagedCollection } from '../src'
import { useApiClient, useApiCore } from '../src'
import { useFetchMockData } from '../../../test/mocks/setupTest'
import type { User } from './types'

describe('useApiClient', () => {
  useFetchMockData()

  it('should fetch successfully', async () => {
    const core = useApiCore()
    const client = useApiClient()
    // eslint-disable-next-line require-await
    const preFetch = async (data: ApiClientConfig): Promise<void> => {
      expect(data.url).toBe('/users?sort[name]=asc')
      return Promise.resolve()
    }
    core.hookOnce('client:pre-fetch', preFetch)

    const params = {
      sort: { name: 'asc' }
    }

    const { data, hubUrl, error } = await client<ApiClientReponse<User[]>>('/users', { params })

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
})
