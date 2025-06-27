import AuthClient from "@/api/client/axios"
import { useQuery } from "@tanstack/react-query"

const authClient = new AuthClient()

export const useQuantityVisitByBranch= (id?:number) => {
    return useQuery<{quantity:number}, Error>({
      queryKey: ['vista-data'],
      queryFn: async () => {
        const response = await authClient.get<{quantity:number}>(`/register-visit/${id}`)
        return response
      },
      enabled: id !== undefined && id !== null,
    })
  }