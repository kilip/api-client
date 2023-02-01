import { afterAll, beforeAll } from 'vitest'
import { server } from './server'

// Establish API mocking before all tests.
beforeAll(async () => {
  await server.listen()
})
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
// afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(async () => {
  await server.close()
})
