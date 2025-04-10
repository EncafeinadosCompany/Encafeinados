import AuthClient from "@/api/client/axios"
import { useQuery } from "@tanstack/react-query"

const authClient = new AuthClient()


export interface criteriaResponseData {
id: number,
name: string,
description: string,
active: boolean,
requires_image: boolean,
}

export const useCriteria= () => {
    return useQuery<criteriaResponseData[], Error>({
      queryKey: ['criteria status'],
      queryFn: async () => {
        const response = await authClient.get<criteriaResponseData[]>(`/criteria/status/true`)
        return response
      } 
    })
  }