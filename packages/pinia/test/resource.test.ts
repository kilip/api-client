import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import './setup'
import type { Listener } from 'listhen'
import { useApiCore } from '@doyolabs/api-client-core'
import { mockHttpEnd, mockHttpStart } from '../../../test'
import { defineResource } from '../src'
import type { User } from './types'
import { app } from './mock/h3'

const useUserResource = defineResource<User>('user', '/users')

describe('useApiResource', () => {
  let listener: Listener

  beforeEach(async () => {
    listener = await mockHttpStart(app)
    useApiCore().options.entrypoint = listener.url
  })

  afterEach(async () => {
    await mockHttpEnd(listener)
  })

  it('find() should returns items when exists', async () => {
    const { useListStore } = useUserResource
    const store = useListStore()
    await store.loadItems()
    expect(store.items).toBeDefined()
  })
})
