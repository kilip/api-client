import type { ApiHydraItem } from '@doyolabs/api-client-core'
import { makeCreateStore } from './create'
import { makeListStore } from './list'
import { makeUpdateStore } from './update'
import { makeRemoveStore } from './remove'
import { makeShowStore } from './show'

export const defineResource = <NameT extends ApiHydraItem>(resourceName: string, resourcePath?: string) => {
  const path = resourcePath || `/${resourceName}`
  const useListStore = makeListStore<NameT>(resourceName, path)
  const useShowStore = makeShowStore<NameT>(resourceName)
  const useCreateStore = makeCreateStore<NameT>(resourceName, path)
  const useUpdateStore = makeUpdateStore<NameT>(resourceName, path)
  const useRemoveStore = makeRemoveStore<NameT>(resourceName)

  return {
    useListStore,
    useShowStore,
    useCreateStore,
    useUpdateStore,
    useRemoveStore
  }
}
