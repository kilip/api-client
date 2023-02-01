import { describe, expect, it } from 'vitest'
import { makeCreateStore } from '../src/create'
import type { User } from './types'
import './setup'

const useStore = makeCreateStore<User>('user', 'users')

describe('makeCreateStore', () => {
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
