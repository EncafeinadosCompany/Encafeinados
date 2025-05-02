
import AuthClient from '@/api/client/axios'
import { getAuthStorage } from '@/common/utils/authStorage'
import { useQuery } from '@tanstack/react-query'

interface  coffeecoins  {
    quantity: number
    
}

const authClient = new AuthClient()


export const useCoffeeCoinsQuery = () => {
    return useQuery<coffeecoins,Error>({
        queryKey: ['coffecoins'],
        queryFn: async (): Promise<coffeecoins> => {
            try {
                const {user} = getAuthStorage()
                const {id} = user
                const response = await authClient.get<coffeecoins>(`/coffee-coins/${id}`)
         
                return response
            } catch (error) {
                throw error
            }
        }
    })
}
