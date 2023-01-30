import { useConfig } from "./useConfig"

export const useApiEntrypoint = (): string => {
  const config  = useConfig()

  return `${config.get('entrypoint')}${config.get('prefix')}`
}
