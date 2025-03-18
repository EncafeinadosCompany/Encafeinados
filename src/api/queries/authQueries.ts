// src/api/queries/authQueries.ts
import { useQuery } from '@tanstack/react-query'
import { User } from '../types/authTypes'
import { mockUser } from '../mocks/authMocks'

export const useCurrentUser = () => {
  return useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockUser), 1000)
      })
    },
  })
}