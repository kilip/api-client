import { describe, expect, it } from 'vitest'
import { useApiCore } from '../src'

describe('useApiCore', () => {
  it('useApiCore() returns a static ApiCore instance', () => {
    const core = useApiCore()
    expect(core.options.entrypoint).toBe('http://localhost:3000')
    expect(core.options.prefix).toBe('/')
    expect(core.options.token).toBeUndefined()
  })
})
