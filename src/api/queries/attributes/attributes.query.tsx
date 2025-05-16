import { useQuery } from '@tanstack/react-query'
import AuthClient from '@/api/client/axios'
import { Attribute, Attributes } from '@/api/types/attributes/attributes.type'


const authClient = new AuthClient()

export const useAttributes = () => {
    return useQuery<Attribute[]>({
      queryKey: ['attributes'],
      queryFn: async () => {
        const response = await authClient.get<Attributes>('/attributes')
        return response.attributes
      },
    })
  }
  