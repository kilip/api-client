import { useApiCore } from "./useApiCore"

export const useApiToken = (): string|undefined => {
  const core = useApiCore()
  return core.getOption('token')
}
