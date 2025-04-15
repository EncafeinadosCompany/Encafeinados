import AuthClient from "@/api/client/axios"
import { criteriaResponseData } from "@/api/types/criteriaTypes"
import { useQuery } from "@tanstack/react-query"

const authClient = new AuthClient()




export const useCriteria= () => {
    return useQuery<criteriaResponseData[], Error>({
      queryKey: ['criteria status'],
      queryFn: async () => {
        const response = await authClient.get<criteriaResponseData[]>(`/criteria/status/true`)
        return response
      } 
    })
  }