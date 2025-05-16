import { useQuery } from '@tanstack/react-query';
import AuthClient from '@/api/client/axios';
import { CoffeeLoverProfile } from '@/api/types/coffelovers/coffelovers.type';

const authClient = new AuthClient();

export const useCoffeeLoverProfile = () => {
  const userId = 1;
  
  // const userId = localStorage.getItem("userId");

  return useQuery<CoffeeLoverProfile>({
    queryKey: ['coffeeLoverProfile', userId],
    queryFn: async () => {
      const response = await authClient.get<CoffeeLoverProfile>(`/clients/${userId}`);
      return response;
    },
  });
};