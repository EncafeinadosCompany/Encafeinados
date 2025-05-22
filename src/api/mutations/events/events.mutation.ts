import AuthClient from "@/api/client/axios";
import { EvenType } from "@/api/types/events/events.types";
import { useError } from "@/common/hooks/auth/useErrors";
import { handleApiError } from "@/common/utils/errors/handle_api_error.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const authClient = new AuthClient();

export const useEventMutation = () => {
    const queryClient = useQueryClient()
    const useErrors = useError("events")
  
    return useMutation<any, Error, EvenType>({
      mutationFn: async (formData: EvenType): Promise<any> => {
  
        try {
          const response = await authClient.post<EvenType>('/events', formData); 
          return response;
    
        } catch (error: any) {
          throw handleApiError(error)
        }
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['events'] });
        console.log(data)
        toast.success("Evento creado correctamente");
      },
      onError: (error: any) => {
        useErrors(error);
      }
    })
  }