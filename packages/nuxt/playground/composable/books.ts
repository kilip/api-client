import { defineResource } from '@kilip/api-client-pinia'

export interface Books {
  id: string
  title: string
  author: string
  description: string
  isbn: string
}

export const useBookResource = defineResource<Books>('books', '/books')
