import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@kilip/api-client-core': resolve('./packages/core/src/index.ts'),
      '@kilip/api-client-mocks': resolve('./test/mocks')
    }
  },
  esbuild: {
    tsconfigRaw: '{}'
  },
  test: {
    setupFiles: [
      '/test/mocks/setupTest.js'
    ]
  }
})
