import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import './setup'
import type { ApiResponseError } from '@doyolabs/api-client-core'
import { useApiCore } from '@doyolabs/api-client-core'
import type { Listener } from 'listhen'
import { defineResource } from '../src/resource'
import { mockHttpEnd, mockHttpStart } from '../../../test'
import type { User } from './types'
import { app } from './mock/h3'

const { useRemoveStore } = defineResource<User>('user', '/users')

describe('makeRemoveStore', () => {
  let listener: Listener

  beforeEach(async () => {
    listener = await mockHttpStart(app)
    useApiCore().options.entrypoint = listener.url
  })

  afterEach(async () => {
    await mockHttpEnd(listener)
  })

  it('should define initial state values', () => {
    const store = useRemoveStore()

    expect(store.$id).toBe('user.remove')
    expect(store.removed).toBeUndefined()
    expect(store.mercureRemoved).toBeUndefined()
    expect(store.loading).toBeFalsy()
    expect(store.error).toBeUndefined()
  })

  it('remove()', async () => {
    const store = useRemoveStore()
    const item = {
      '@id': '/users/delete',
      '@context': '/context/User',
      '@type': 'User'
    }

    store.$patch({ mercureRemoved: item, error: { statusMessage: 'Hello World' } as ApiResponseError<User> })
    expect(store.mercureRemoved).toStrictEqual(item)
    expect(store.error).toBeDefined()

    await store.remove(item)

    expect(store.error).toBeUndefined()
    expect(store.removed).toStrictEqual(item)
    expect(store.mercureRemoved).toBeUndefined()
    expect(store.loading).toBeFalsy()
  })
})
