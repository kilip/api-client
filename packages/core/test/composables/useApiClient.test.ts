import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';


import {
  useApiClient,
  ApiSubmissionErrors,
  ApiClientFetchConfig} from '#api-core'

import { User } from '../types';
import { useApiCore } from '../../src/composables/useApiCore';
import { ApiFetchResponse } from '../../src/types';

vi.mock('#api-core/composables/useApiToken')

const core = useApiCore()
core.setOption('token', 'token')

describe('useApiClient', () => {


  beforeEach(async () => {
    fetchMock.resetMocks

  })

  it('succesfully fetch request', async() => {
    const json = [{id: 'test'}]
    fetchMock.mockResponseOnce(JSON.stringify(json))

    const client = useApiClient()

    const { data } = await client<User[]>('/test')
    expect(data).toEqual(json)
  })

  it('should call pre-fetch and post-fetch hooks during fetch', async () => {
    const mPreFetch = vi.fn()
    const mPostFetch = vi.fn()
    //@TODO: provide test for header addition
    const updateHeader = async ({options}) => {
      options.headers['Authorization'] = 'Bearer token'
    }

    core.hookOnce('client:pre-fetch', updateHeader)
    core.hookOnce('client:pre-fetch', mPreFetch)
    core.hookOnce('client:post-fetch', mPostFetch)

    const json = [{id: 'test'}]
    fetchMock.mockResponseOnce(JSON.stringify(json))

    const client = useApiClient()

    const data = await client<User>('/test')
    expectTypeOf(data).toMatchTypeOf<ApiFetchResponse<User>>()
    expect(mPreFetch).toBeCalledTimes(1)
    expect(mPostFetch).toBeCalledTimes(1)
  })

  it('handle fetch json error', async() => {
    const json = {
      code: 401,
      message: 'error message'
    }
    fetchMock.mockResponseOnce(JSON.stringify(json), {status: 401})

    const client = useApiClient()
    const { error } = await client('/test')

    expect(error).toBeDefined()
    expect(error.message).toEqual('error message')
  })

  it('handle error with detail', async() => {
    const json = {
      status: 400,
      title: 'An error occured',
      detail: `The key 'email' must be a string`
    }

    fetchMock.mockResponseOnce(JSON.stringify(json), {
      status: 401,
      statusText: '400 Bad Request'
    })

    const client = useApiClient()
    const { error } = await client('/test')

    expect(error.title).toBe(json.title)
    expect(error.message).toBe(json.detail)
    expect(error.status).toBe(json.status)
  })

  it('handle validation error', async () => {
    const json = {
      '@context': '/contexts/ConstraintViolationList',
      '@type': 'ConstraintViolationList',
      'hydra:title': 'An error occurred',
      'hydra:description': `properties: The product must have the minimal properties required ('description', 'price')`,
      'violations': [
        {
          'propertyPath': 'properties',
          'message': `The product must have the minimal properties required ('description', 'price')`
        }
      ]
    }
    fetchMock.mockResponseOnce(JSON.stringify(json), {
      status: 422,
      statusText: '422 Unprocessable Entity'
    })

    const client = useApiClient()
    const { error } = await client('/test')

    expect(error).toBeDefined()

    const e = error as ApiSubmissionErrors
    expect(e.title).toBe(json['hydra:title'])
    expect(e.message).toBe(json['hydra:description'])
  })

  it('execute onResponse and onError hook', async() => {
    const json = [{id: 'test'}]
    const mock = vi.fn()

    fetchMock.mockResponseOnce(JSON.stringify(json), {
      status: 404,
      statusText: '404 HTTP Page not found'
    })

    const client = useApiClient()
    const { error, data } = await client('/test', {
      onResponse: mock,
      onError: mock
    })

    expect(mock).toHaveBeenCalled()
    expect(mock).toHaveBeenCalledTimes(2)
  })
})
