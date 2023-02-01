import { readFileSync } from 'node:fs'
import path from 'node:path'
import { afterAll, beforeAll, beforeEach, afterEach } from 'vitest'
import { createApp, eventHandler, toNodeListener } from 'h3'
import type { Listener } from 'listhen'
import { listen } from 'listhen'
import { useApiCore } from '../../packages/core/src/core'

const getUsers = () => {
  const json = readFileSync(path.join(__dirname, '/fixtures/users.json'))
  return JSON.parse(json)
}

const users = (event) => {
  event.node.res.setHeader('Content-Type', 'application/ld+json')
  event.node.res.setHeader('link', '<http://localhost:3000/.well-known/mercure>; rel="mercure"')
  const data = getUsers()

  const hydra = {
    '@context': '/context/User',
    '@id': 'https://localhost:3000/users',
    '@type': 'User',
    'hydra:member': data,
    'hydra:totalItems': data.length,
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

const setHeader = (event) => {
  event.node.res.setHeader('Content-Type', 'application/ld+json')
  event.node.res.setHeader('link', '<http://localhost:3000/.well-known/mercure>; rel="mercure"')
}

// returns a single user
const user = (event) => {
  setHeader(event)
  const data = getUsers()
  return data[5]
}

const app = createApp()
  .use('/users/violations', eventHandler((event) => {
    event.node.res.setHeader('Content-Type', 'application/json')
    event.node.res.statusCode = 422
    const json = readFileSync(path.join(__dirname, '/fixtures/violations.json'))
    const data = JSON.parse(json.toString())
    return data
  }))
  .use('/users/delete', eventHandler((event) => {
    event.node.res.setHeader('Content-Type', 'application/json')
    event.node.res.statusCode = 201
    event.node.res.statusMessage = 'User resource deleted'
    return { code: 201, message: 'User resource deleted' }
  }))
  .use('/users/create', eventHandler((event) => {
    setHeader(event)
    event.node.res.statusCode = 201
    event.node.res.statusMessage = 'User resource created'
    const data = getUsers()
    return data[1]
  }))
  .use('/users/update', eventHandler((event) => {
    setHeader(event)
    event.node.res.statusCode = 200
    event.node.res.statusMessage = 'User resource updated'
    const data = getUsers()
    return data[1]
  }))
  .use('/users/5', eventHandler(user))
  .use('/users', eventHandler(users))
  .use('/users?username', eventHandler(users))
  .use('/error/401', eventHandler((event) => {
    event.node.res.setHeader('Content-Type', 'application/json')
    event.node.res.statusCode = 401
    event.node.res.statusMessage = 'An error occured'
    return { code: 401, message: 'Invalid credentials.' }
  }))

let listener: Listener
useApiCore().options.entrypoint = 'http://localhost:3000'

beforeAll(async () => {
  listener = await listen(toNodeListener(app), {

  })
})

afterAll(async () => {
  await listener.close()
})
