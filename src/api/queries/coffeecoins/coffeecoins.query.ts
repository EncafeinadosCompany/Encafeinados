
import AuthClient from '@/api/client/axios'
import { getEncryptedItem } from '@/common/utils/security/storage_encrypted.utils';
import { useQuery } from '@tanstack/react-query'

interface  coffeecoins  {
    coffee_coins: number;
}

const authClient = new AuthClient()


export const useCoffeeCoinsQuery = () => {
    return useQuery<coffeecoins,Error>({
        queryKey: ['coffecoins'],
        queryFn: async (): Promise<coffeecoins> => {
            try {
                const id = getEncryptedItem("userId");
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
        refetchOnReconnect: false 
    })
}
