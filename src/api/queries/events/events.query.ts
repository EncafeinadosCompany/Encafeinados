import AuthClient from "@/api/client/axios"
import { EventClienType, EvenType } from "@/api/types/events/events.types"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"

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
      queryKey: ['events-status'],
      queryFn: async () => {
        const response = await authClient.get<EvenType[]>(`/events/status/PUBLISHED`)
        return response
      } 
    })
  }

  export const useClientEvent = (
    id: number,
    options?: UseQueryOptions<EventClienType[]> 
  ) => {
    return useQuery<EventClienType[]>({
      queryKey: ['clientEvent', id],
      queryFn: async () => {
        const response = await authClient.get<EventClienType[]>(`/event-client/${id}`);
        return response;
      },
      ...options 
    });
  };