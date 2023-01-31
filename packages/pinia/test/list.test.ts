import { describe, expect, it } from 'vitest'
import { makeListStore } from '../src/list'
import './setup'
import type { User } from './types'

describe('makeListStore', () => {
  it('getItems() runs successfully', async () => {
    const useStore = makeListStore<User>('user', '/users')
    const store = useStore()
    await store.loadItems()

    expect(store.items).toHaveLength(10)
  })
})
