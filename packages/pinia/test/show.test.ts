import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import './setup'
import type { Listener } from 'listhen'
import { useApiCore } from '@doyolabs/api-client-core'
import { defineResource } from '../src/resource'
import { mockHttpEnd, mockHttpStart } from '../../../test'
import { app } from './mock/h3'

const { useShowStore } = defineResource('user', '/users')

describe('makeShowStore', () => {
  let listener: Listener

  beforeEach(async () => {
    listener = await mockHttpStart(app)
    useApiCore().options.entrypoint = listener.url
  })

  afterEach(async () => {
    await mockHttpEnd(listener)
  })

  it('should define initial state values', () => {
    const store = useShowStore()

    expect(store.$id).toBe('user.show')
    expect(store.hubUrl).toBe(undefined)
    expect(store.error).toBe(undefined)
    expect(store.loading).toBeFalsy()
  })

  it('retrieve()', async () => {
    const store = useShowStore()

    await store.retrieve('/users/5')

    expect(store.error).toBeUndefined()
    expect(store.loading).toBeFalsy()
    expect(store.hubUrl).toBeDefined()
    expect(store.retrieved).toBeDefined()
  })
})
