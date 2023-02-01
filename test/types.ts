import type { ApiHydraItem } from '../packages/core/src/types'

export interface Geo {
  lat: number
  lng: number
}

export interface Address {
  street: string
  suite: string
  city: string
  geo: Geo
}

export interface Company {
  name: string
  catchPhrase: string
  bs: string
}

export interface User extends ApiHydraItem {
  id?: number
  name?: string
  username?: string
  email?: string
  address?: Address
  phone?: string
  website?: string
  company?: Company
}
