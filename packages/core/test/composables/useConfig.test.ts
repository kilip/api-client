import { describe, expect, it } from "vitest";
import { useApiEntrypoint, useConfig } from "#api-core";

describe('useConfig', () => {

  it('configure defaults', () => {
    const config = useConfig()

    expect(config.get('entrypoint')).toBe('https://localhost')
    expect(config.get('prefix')).toBe('/')


    config.set('prefix', '/api')
    expect(config.get('prefix')).toBe('/api')
    expect(useApiEntrypoint()).toBe('https://localhost/api')
  })
})
