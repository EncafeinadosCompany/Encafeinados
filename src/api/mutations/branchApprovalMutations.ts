import { useMutation, useQueryClient } from '@tanstack/react-query'
import AuthClient from '../client/axios'

const authClient = new AuthClient()

// Mutación para aprobar una sucursal
export const useApproveBranchMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (approvalId: number) => {
      // Obtener el userId del localStorage
      const userId = localStorage.getItem('userId');
      
      console.log('userId from localStorage:', userId); // Depuración
      
      if (!userId) {
        throw new Error('No se encontró ID de usuario en el sistema. Por favor, inicia sesión nuevamente.');
      }
      
      return await authClient.patch(`/branch-approvals/${approvalId}`, {
        status: true,
        approvedById: parseInt(userId)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['branches', 'PENDING'] });
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    }
  });
};

// Mutación para rechazar una sucursal
export const useRejectBranchMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ approvalId, reason }: { approvalId: number; reason: string }) => {
      // Obtener el userId del localStorage con verificación
      const userId = localStorage.getItem('userId');
      
      console.log('userId from localStorage:', userId); // Depuración
      
      if (!userId) {
        throw new Error('No se encontró ID de usuario en el sistema. Por favor, inicia sesión nuevamente.');
      }
      
      return await authClient.patch(`/branch-approvals/${approvalId}`, {
        status: false,
        approvedById: parseInt(userId),
        comments: reason
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['branches', 'PENDING'] });
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    }
  });
};