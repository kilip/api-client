import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import './setup'
import type { ApiSubmissionErrors } from '@doyolabs/api-client-core'
import { useApiCore } from '@doyolabs/api-client-core'
import type { Listener } from 'listhen'
import { defineResource } from '../src/resource'
import { mockHttpStart, mockHttpEnd } from '../../../test'
import type { User } from './types'
import { app } from './mock/h3'

const { useUpdateStore } = defineResource<User>('user', '/users')

// @TODO: perform violations tests
describe('makeUpdateStore', () => {
  let listener: Listener

  beforeEach(async () => {
    listener = await mockHttpStart(app)
    useApiCore().options.entrypoint = listener.url
  })

  afterEach(async () => {
    await mockHttpEnd(listener)
  })

  it('should define initial state values', () => {
    const store = useUpdateStore()

    expect(store.$id).toBe('user.update')
    expect(store.updated).toBeUndefined()
    expect(store.retrieved).toBeUndefined()
    expect(store.loading).toBeFalsy()
    expect(store.error).toBeUndefined()
    expect(store.hubUrl).toBeUndefined()
    expect(store.violations).toBeUndefined()
    expect(store.isLoading).toBeFalsy()
  })

  it('load() should load resource', async () => {
    const store = useUpdateStore()

    await store.load(5)
    expect(store.retrieved).toBeDefined()
    expect(store.isLoading).toBeFalsy()
    expect(store.hubUrl).toBeDefined()
    expect(store.error).toBeUndefined()
  })

  it('update() should update resource', async () => {
    const store = useUpdateStore()

    await store.update({
      '@id': '/users/5',
      '@context': '/context/User',
      '@type': 'User',
      name: 'Hello World'
    })

    expect(store.loading).toBeFalsy()
    expect(store.error).toBeUndefined()
    expect(store.updated).toBeDefined()
    expect(store.hubUrl).toBeDefined()

    expect(store.updated?.name).toBe('Mrs. Dennis Schulist')
  })

  it('violations() returns value from errors.violations', () => {
    const store = useUpdateStore()
    const violations: ApiSubmissionErrors = {
      some: {
        propertyPath: 'any',
        code: 'any',
        message: 'any'
      }
    }
    const error = { violations }

    store.$patch({ error })

    expect(store.violations).toBeDefined()
    expect(store.violations).toStrictEqual(violations)
  })
})
