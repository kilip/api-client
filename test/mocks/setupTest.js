import { readFileSync } from 'node:fs'
import path from 'node:path'
import { beforeEach, afterEach } from 'vitest'
import { createApp, eventHandler, toNodeListener } from 'h3'
import { listen } from 'listhen'
import { useApiCore } from '../../packages/core/src/core'

let listener
useApiCore().options.entrypoint = 'http://localhost:3000'

const users = (event) => {
  event.node.res.setHeader('Content-Type', 'application/ld+json')
  event.node.res.setHeader('link', '<http://localhost:3000/.well-known/mercure>; rel="mercure"')
  const json = readFileSync(path.join(__dirname, '/fixtures/users.json'))
  const parsed = JSON.parse(json)

  const hydra = {
    '@context': '/context/User',
    '@id': 'https://localhost:3000/users',
    '@type': 'User',
    'hydra:member': parsed,
    'hydra:totalItems': parsed.length,
    'hydra:view': {
      '@id': 'https://localhost:3000/users?page=2',
      'hydra:first': 'https://localhost:3000/users?page=1',
      'hydra:last': 'https://localhost:3000/users?page=10',
      'hydra:next': 'https://localhost:3000/users?page=3',
      'hydra:previous': 'https://localhost:3000/users?page=1'
    }
  }
  return JSON.stringify(hydra)
}

export function useFetchMockData () {
  beforeEach(async () => {
    const app = createApp()
      .use('/users', eventHandler(users))
      .use('/users?username', eventHandler(users))
      .use('/error/401', eventHandler((event) => {
        event.node.res.setHeader('Content-Type', 'application/json')
        event.node.res.statusCode = 401
        event.node.res.statusText = 'An error occured'
        return { code: 401, message: 'Invalid credentials.' }
      }))

    listener = await listen(toNodeListener(app))
  })

  afterEach(async () => {
    await listener.close
  })
}
/*
import { setupServer } from 'msw/node'
import { handlers } from './handlers'
import { afterAll, beforeAll, afterEach } from 'vitest'
import { useApiCore } from '../../packages/core/src/composables'

useApiCore().options.entrypoint = 'http://localhost:3000'
const server = setupServer(...handlers)

console.log(server)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
*/
