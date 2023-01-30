import { useApiResource } from "../src/composables"
import { User } from "./types"

export const useUserResource = () => {
  return useApiResource<User>('user')
}
