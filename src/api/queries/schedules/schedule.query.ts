import { useQuery } from '@tanstack/react-query';
import AuthClient from '@/api/client/axios';
import { BranchSchedule } from '@/api/types/schedules/schedule.types';

const authClient = new AuthClient();

export const useBranchSchedules = (branchId: number | undefined) => {
  return useQuery<BranchSchedule[]>({
    queryKey: ['branches','branch-schedules', branchId],
    queryFn: async () => {
      if (!branchId) {
        console.warn("useBranchSchedules: No branchId provided");
        return [];
      }
      
      try {
        console.log(`Fetching schedules for branch ${branchId}...`);
        
        // La respuesta es directamente un array de schedules
        const response = await authClient.get<BranchSchedule[]>(`/branch-schedule/branch/${branchId}`);
        
        console.log("API Response raw:", response);
        
        // Validar que la respuesta es un array válido
        if (!Array.isArray(response)) {
          console.warn("API response is not an array:", response);
          return [];
        }
        
        // Validar estructura de cada schedule
        const validSchedules = response.filter((schedule: any) => {
          const isValid = schedule && 
                         typeof schedule.id === 'number' &&
                         typeof schedule.day === 'string' &&
                         typeof schedule.open_time === 'string' &&
                         typeof schedule.close_time === 'string';
          
          if (!isValid) {
            console.warn("Invalid schedule item:", schedule);
          }
          
          return isValid;
        });
        
        console.log(`Validated ${validSchedules.length} of ${response.length} schedules for branch ${branchId}`);
        
        return validSchedules;
      } catch (error: any) {
        console.error(`Error fetching schedules for branch ${branchId}:`, {
          error: error.message || error,
          status: error.response?.status,
          data: error.response?.data
        });
        
        // En caso de error, retornar array vacío en lugar de throw
        // para que el componente pueda mostrar "Horario no disponible"
        return [];
      }
    },
    enabled: !!branchId,
    staleTime: 10 * 60 * 1000, // Cache por 10 minutos
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // No reintentar si es un error 404 (horarios no encontrados)
      if (error?.response?.status === 404) {
        return false;
      }
      // Reintentar hasta 2 veces para otros errores
      return failureCount < 2;
    }
  });
};
