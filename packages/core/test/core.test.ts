import { describe, expect, it } from 'vitest'
import { useApiCore } from '../src'
import { useFetchMockData } from '../../../test/mocks/setupTest'

describe('useApiCore', () => {
  useFetchMockData()

  it('useApiCore() returns a static ApiCore instance', () => {
    const core = useApiCore()
    expect(core.options.entrypoint).toBe('http://localhost:3000')
    expect(core.options.prefix).toBe('/')
    expect(core.options.token).toBeUndefined()
  })
})
