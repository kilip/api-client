import { useApiCore } from './core'

export const useApiEntrypoint = (): string => {
  const core = useApiCore()
  const { entrypoint, prefix } = core.options
  return `${entrypoint}${prefix}`
}
