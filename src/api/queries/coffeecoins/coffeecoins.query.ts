
import AuthClient from '@/api/client/axios'
import { getAuthStorage } from '@/common/utils/auth_storage.utils'
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
                const response = await authClient.get<coffeecoins>(`/clients/user/${id}`)
                return response
            } catch (error) {
                throw error
            }
        },
        staleTime: Infinity,
        gcTime: Infinity,  
        refetchOnWindowFocus: false,
        refetchOnMount: false,   
        refetchOnReconnect: false,   
    })
}
