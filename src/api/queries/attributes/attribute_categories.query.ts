import { useQuery } from '@tanstack/react-query';
import AuthClient from '@/api/client/axios';
import { AttributeCategoriesResponse, AttributesByCategoryResponse } from '@/api/types/attributes/attribute_categories.types';

const authClient = new AuthClient();

export const useAttributeCategories = () => {
  return useQuery<AttributeCategoriesResponse>({
    queryKey: ['attribute-categories'],
    queryFn: async () => {
      const response = await authClient.get<AttributeCategoriesResponse>('/attribute-categories');
      return response;
    },
    staleTime: 1000 * 60 * 10 // Cache por 10 minutos
  });
};

export const useAttributesByCategory = (categoryId: number) => {
  return useQuery<AttributesByCategoryResponse>({
    queryKey: ['attributes', 'category', categoryId],
    queryFn: async () => {
      const response = await authClient.get<AttributesByCategoryResponse>(`/attributes/category/${categoryId}`);
      return response;
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 10 // Cache por 10 minutos
  });
};
