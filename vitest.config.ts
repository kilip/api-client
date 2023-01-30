import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '#api-core': resolve('./packages/core/src'),
      '#api-pinia': resolve('./packages/pinia/src')
    }
  },
  test: {
    globals: true,
    include: [
      '**/test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**', '**/cypress/**',
       '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
    ],
    "setupFiles": [
      '/test/setup.ts'
    ]
  }
})
