import AuthClient from "@/api/client/axios"
import { EvenType } from "@/api/types/events/events.types"
import { useQuery } from "@tanstack/react-query"

const authClient = new AuthClient()


export const useEventAll= () => {
    return useQuery<EvenType[], Error>({
      queryKey: ['events'],
      queryFn: async () => {
        const response = await authClient.get<EvenType[]>(`/events`)
        return response
      } 
    })
  }


  export const useEventByStatus= () => {
    return useQuery<EvenType[], Error>({
      queryKey: ['events-status	'],
      queryFn: async () => {
        const response = await authClient.get<EvenType[]>(`/events/status/PUBLISHED`)
        return response
      } 
    })
  }