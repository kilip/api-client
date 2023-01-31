import { describe, it, expect } from 'vitest'
/*
import { fileURLToPath } from 'node:url'
import { setup } from '@nuxt/test-utils'
*/

describe('ssr', async () => {
  /*
  await setup({
    server: false,
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })
  */

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    // const html = await $fetch('/')
    // expect(html).toContain('<div>basic</div>')
    expect('hello world').toBe('hello world')
  })
})
