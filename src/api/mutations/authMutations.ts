// src/api/mutations/authMutations.ts
import { useMutation } from '@tanstack/react-query'
import { LoginFormData } from '../types/authTypes'
import { mockUser } from '../mocks/authMocks'

// Simular un login
export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (formData: LoginFormData) => {
      // Simular una llamada a la API
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockUser), 1000)
      })
    },
  })
}