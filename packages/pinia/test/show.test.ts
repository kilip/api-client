import { describe, expect, it } from 'vitest'
import './setup'
import { defineResource } from '../src/resource'

const { useShowStore } = defineResource('user', '/users')

describe('makeShowStore', () => {
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
