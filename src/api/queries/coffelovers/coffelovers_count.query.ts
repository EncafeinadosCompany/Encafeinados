import { useQuery } from '@tanstack/react-query';
import AuthClient from '@/api/client/axios';

interface CoffeloversCountResponse {
  totalClients: number;
}

const authClient = new AuthClient();

const getCoffeloversCount = async (): Promise<CoffeloversCountResponse> => {
  const response = await authClient.get<CoffeloversCountResponse>('/clients/count');
  return response;
};

export const useCoffeloversCount = () => {
  return useQuery({
    queryKey: ['coffelovers-count'],
    queryFn: getCoffeloversCount,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
  });
};
