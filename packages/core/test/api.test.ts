import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { Listener } from 'listhen'
import { useApi } from '../src/api'
import { mockHttpEnd, mockHttpStart } from '../../../test'
import type { User } from './types'
import { app } from './mock/h3'

describe('useApi', () => {
  let listener: Listener

  beforeEach(async () => {
    listener = await mockHttpStart(app)
  })

  afterEach(async () => {
    await mockHttpEnd(listener)
  })

  it('find()', async () => {
    const { find } = useApi()

    const {
      items,
      hubUrl,
      error,
      view,
      totalItems
    } = await find<User>('/users')

    expect(items).toBeDefined()
    expect(hubUrl).toBeDefined()
    expect(error).toBeUndefined()
    expect(view).toBeDefined()
    expect(totalItems).toBeDefined()

    expect(totalItems).toBe(10)
  })

  it('findOne()', async () => {
    const { findOne } = useApi()

    const { item, hubUrl, error } = await findOne<User>('/users/5')
    expect(error).toBeUndefined()
    expect(hubUrl).toBeDefined()
    expect(item).toBeDefined()
  })

  it('create()', async () => {
    const { create } = useApi()

    const { created, hubUrl, error } = await create<User>('/users/create', {
      id: 3,
      '@id': '/users/create',
      '@context': '/context/User',
      '@type': 'User'
    })

    expect(error).toBeUndefined()
    expect(hubUrl).toBeDefined()
    expect(created).toBeDefined()
  })

  it('update()', async () => {
    const { update } = useApi()

    const { updated, error, hubUrl } = await update<User>('/users/update', {
      '@id': '/users/update',
      '@context': '/context/User',
      '@type': 'User',
      name: 'Hello World'
    })

    expect(error).toBeUndefined()
    expect(hubUrl).toBeDefined()
    expect(updated).toBeDefined()
  })

  it('delete()', async () => {
    const { remove } = useApi()
    const { data, error, hubUrl, response } = await remove<User>('/users/delete')
    expect(response).toBeDefined()
    expect(error).toBeUndefined()
    expect(hubUrl).toBeUndefined()
    expect(data).toBeDefined()
    expect(data).toStrictEqual({
      code: 201,
      message: 'User resource deleted'
    })
  })
})
