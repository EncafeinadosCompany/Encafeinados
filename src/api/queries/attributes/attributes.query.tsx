import { useQuery } from '@tanstack/react-query'
import AuthClient from '@/api/client/axios'
import { Attribute, AttributeByID, Attributes } from '@/api/types/attributes/attributes.type'


const authClient = new AuthClient()

export const useAttributes = () => {
  return useQuery<Attribute[]>({
    queryKey: ['attributes'],
    queryFn: async () => {
      const response = await authClient.get<Attributes>('/attributes')
      return response.attributes
    },
    staleTime: 5 * 60 * 1000,

  })
}


export const useBranchAttributes = (branchId: string) => {
  return useQuery<AttributeByID, Error>({
    queryKey: ["branch-attributes", branchId],
    queryFn: async (): Promise<AttributeByID> => {
      const response = await authClient.get<AttributeByID>(`/branch-attributes/${branchId}`)
      return response
    },
    enabled: !!branchId
  })
}
