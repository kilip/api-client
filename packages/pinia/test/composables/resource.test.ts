import { describe, expect, it } from "vitest";
import { defineResource } from "../../src";
import { User } from "../types";
import { createPinia, setActivePinia } from "pinia";
import { createApp } from "vue";

const app = createApp({})
const pinia = createPinia()
app.use(pinia)
setActivePinia(pinia)

const useUserResource = defineResource<User>('user', '/users')

describe('useApiResource', () => {

  it('find() should returns items when exists', async () => {

    const {
      find,
      useListStore,

    } = useUserResource

    const items = await find()
    const store = useListStore()

    expect(items).toBeDefined()
    expect(store.items).toStrictEqual(items)

  })
})
