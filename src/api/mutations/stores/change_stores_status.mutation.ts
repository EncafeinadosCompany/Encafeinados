import AuthClient from '@/api/client/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query'


interface ChangeStoreStatusProps {
  storeId: number;
  status: boolean;
  reason?: string;
}


const authClient = new AuthClient()

export const useChangeStoreStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ storeId, status, reason }: ChangeStoreStatusProps) => {
      // Construir el payload según sea aprobación o rechazo
      const payload = status 
        ? { status: true }
        : { status: false, reason };
        
      const response = await authClient.patch(`/stores/status/${storeId}`, payload);
      return response;
    },
    onSuccess: () => {
      // Invalidar consultas relevantes para actualizar la UI
      queryClient.invalidateQueries({ queryKey: ['stores', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['stores', 'approved'] });
      queryClient.invalidateQueries({ queryKey: ['stores', 'rejected'] });
    },
  });
};