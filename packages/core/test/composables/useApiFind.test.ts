import { Mock, beforeEach, describe, expect, test, vi } from "vitest";
import { useApiFind } from "#api-core";
import { User } from "../types";
import { useApiCore } from "../../src/composables/useApiCore";

describe('useApiFind', () => {
  const json = [{id: 'test'}]

  beforeEach(async () => {
    fetchMock.resetMocks
    const data = {
      'hydra:member': json,
      'hydra:view': {},
      'hydra:totalItems': 1
    }

    fetchMock.mockResponseOnce(JSON.stringify(data), {
      headers: {
        link: `<https://localhost/.well-known/mercure>; rel="mercure"`
      }
    })

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
    expect(error).toBeUndefined()
    expect(hubUrl).toStrictEqual(new URL('https://localhost/.well-known/mercure'))
  })
})
