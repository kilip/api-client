import { describe, expect, it } from 'vitest'
import { defineResource } from '../src'
import './setup'
import type { User } from './types'

const useUserResource = defineResource<User>('user', '/users')

describe('useApiResource', () => {
  it('find() should returns items when exists', async () => {
    const {
      find,
      useListStore

    } = useUserResource

    await find()
    const store = useListStore()
    expect(store.items).toBeDefined()
  })
})
