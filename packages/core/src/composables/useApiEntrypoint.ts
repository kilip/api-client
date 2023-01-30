import { useApiCore } from "./useApiCore"

export const useApiEntrypoint = (): string => {
  const core = useApiCore()
  const entrypoint  = core.getOption('entrypoint')
  const prefix = core.getOption('prefix')

  return `${entrypoint}${prefix}`
}
