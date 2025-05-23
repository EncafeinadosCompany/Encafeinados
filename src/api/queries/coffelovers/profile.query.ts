import { useQuery } from '@tanstack/react-query';
import AuthClient from '@/api/client/axios';
import { CoffeeLoverProfileType } from '@/api/types/coffelovers/coffelovers.type';

const authClient = new AuthClient();

export const useCoffeeLoverProfile = (id:number) => {
  return useQuery<CoffeeLoverProfileType>({
    queryKey: ['coffeeLoverProfile', id],
    queryFn: async () => {
      const response = await authClient.get<CoffeeLoverProfileType>(`/clients/user/${id}`);
      return response;
    },
  });
};