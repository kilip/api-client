import { useApiCore } from '@doyolabs/api-client-core'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { Listener } from 'listhen'
import { mockHttpEnd, mockHttpStart } from '../../../test'
import { makeListStore } from '../src/list'
import './setup'
import type { User } from './types'
import { app } from './mock/h3'

describe('makeListStore', () => {
  let listener: Listener

  beforeEach(async () => {
    listener = await mockHttpStart(app)
    useApiCore().options.entrypoint = listener.url
  })

  afterEach(async () => {
    await mockHttpEnd(listener)
  })

  it('getItems() runs successfully', async () => {
    const useStore = makeListStore<User>('user', '/users')
    const store = useStore()
    await store.loadItems()

    expect(store.items).toHaveLength(10)
  })
})
