import AuthClient from "@/api/client/axios"
import { EventClienType, EventDto } from "@/api/types/events/events.types"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"

const authClient = new AuthClient()


export const useEventAll= () => {
    return useQuery<EventDto[], Error>({
      queryKey: ['events'],
      queryFn: async () => {
        const response = await authClient.get<EventDto[]>(`/events`)
        return response
      } 
    })
  }


  export const useEventByStatus= () => {
    return useQuery<EventDto[], Error>({
      queryKey: ['events-status'],
      queryFn: async () => {
        const response = await authClient.get<EventDto[]>(`/events/status/PUBLISHED`)
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