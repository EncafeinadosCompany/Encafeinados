import AuthClient from "@/api/client/axios";
import { EventDto } from "@/api/types/events/events.types";
import { useError } from "@/common/hooks/auth/useErrors";
import { handleApiError } from "@/common/utils/errors/handle_api_error.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const authClient = new AuthClient();

export const useEventMutation = () => {
    const queryClient = useQueryClient()
    const useErrors = useError("events")
    const navigate = useNavigate()
  
    return useMutation<any, Error, EventDto>({
      mutationFn: async (formData: EventDto): Promise<any> => {
  
        try {
          const response = await authClient.post<EventDto>('/events', formData); 
          return response;
    
        } catch (error: any) {
          throw handleApiError(error)
        }
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['events'] })
        navigate(`/admin/albums?event=${data.event.id}?start_time=${data.event.start_date}?end_time=${data.event.end_date}`)
        toast.success("Evento creado correctamente");
      },
      onError: (error: any) => {
        useErrors(error);
      }
    })
  }


  export const useClientEventMutation = () => {
    const queryClient = useQueryClient()
    const useErrors = useError("eventsClient")
    const navigate = useNavigate()
  
    return useMutation<any, Error, number >({
      mutationFn: async (id: number): Promise<any> => {
  
        try {
          const response = await authClient.post<any>('/event-client', {event_id: id}); 
          return response;
    
        } catch (error: any) {
          throw handleApiError(error)
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['events'] })
        navigate(`/coffeelover/album`)
        toast.success("Registro exitoso");
      },
      onError: (error: any) => {
        useErrors(error);
      }
    })
  }