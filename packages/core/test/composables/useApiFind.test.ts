import { Mock, beforeEach, describe, expect, test, vi } from "vitest";
import { useApiFind } from "#api-core";
import { User } from "../types";
import { useApiCore } from "../../src/composables/useApiCore";
import { doFetch } from "./fetch";

describe('useApiFind', () => {
  const json = [{id: 'test'}]

  beforeEach(async () => {
    fetchMock.resetMocks

    fetchMock.mockResponseOnce(JSON.stringify({
      'hydra:member': json,
      'hydra:view': {},
      'hydra:totalItems': 1
    }))
    useApiCore().hookOnce('client:fetch', doFetch)

  })

  test('successfully find items', async() => {
    const find = useApiFind()
    const {
      items,
      view,
      total,
      hubUrl,
      error,
    } = await find<User>('/user')

    expect(items).toStrictEqual(json)
    expect(total).toBe(1)
    expect(view).toBeDefined()
    expect(error).toBeNull()
  })
})
