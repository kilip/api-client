import type { App } from 'h3'
import { toNodeListener } from 'h3'
import type { Listener } from 'listhen'
import { listen } from 'listhen'
import { useApiCore } from '../packages/core/src'

export async function mockHttpStart (app: App): Promise<Listener> {
  const listener = await listen(toNodeListener(app))
  useApiCore().options.entrypoint = listener.url
  return listener
}

export async function mockHttpEnd (listener: Listener) {
  await listener.close()
}
