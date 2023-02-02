import { describe, expect, it, afterEach, beforeEach } from 'vitest'
import type { Listener } from 'listhen'
import { useApiCore } from '@doyolabs/api-client-core'
import { makeCreateStore } from '../src/create'
import { mockHttpEnd, mockHttpStart } from '../../../test'
import type { User } from './types'
import './setup'
import { app } from './mock/h3'

const useStore = makeCreateStore<User>('user', '/users')

describe('makeCreateStore', () => {
  let listener: Listener

  beforeEach(async () => {
    listener = await mockHttpStart(app)
    useApiCore().options.entrypoint = listener.url
  })

  afterEach(async () => {
    await mockHttpEnd(listener)
  })

  it('should initialize default state values', () => {
    const store = useStore()

    expect(store.$id).toBe('user.create')
    expect(store.created).toBeUndefined()
    expect(store.loading).toBeFalsy()
    expect(store.error).toBeUndefined()
    expect(store.violations).toBeUndefined()
  })

  it('create() action', async () => {
    const store = useStore()
    await store.create({
      '@id': '/users/create',
      '@context': '/context/User',
      '@type': 'User',
      name: 'foo bar'
    })

    expect(store.created).toBeDefined()
    expect(store.loading).toBeFalsy()
    expect(store.violations).toBeUndefined()
  })
})
