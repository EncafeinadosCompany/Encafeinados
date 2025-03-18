// src/api/queries/coffeeQueries.ts
import { useQuery } from '@tanstack/react-query'
import { Coffee } from '../types/coffeeTypes'
import { mockCoffees } from '../mocks/coffeeMocks'

export const useCoffees = () => {
  return useQuery<Coffee[]>({
    queryKey: ['coffees'],
    queryFn: async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockCoffees), 1000)
      })
    },
  })
}