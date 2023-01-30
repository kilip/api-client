import { beforeEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { createApp } from "vue";
import { User } from "../types";
import { useUserResource } from "../useUserResource";

const app = createApp({})
const pinia = createPinia()
app.use(pinia)
setActivePinia(pinia)

describe('useApiResource', () => {
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

  it('should find resources', async () => {
    const mock = await import('#api-core')
    const { find, useListStore } = useUserResource()
    const store = useListStore()
    const items = await find()

    expect(items).toStrictEqual(json)
    expect(items).toStrictEqual(store.items)
  })
})
