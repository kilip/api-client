import { describe, expect, it } from "vitest";
import { useApiFind } from "../../src";
import { User } from "../types";
import { useFetchMockData } from "../../../../test/mocks/setupTest";

describe('useApiFind', () => {

  useFetchMockData()

  it('should find resource', async () => {

    const find = useApiFind()

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
})
