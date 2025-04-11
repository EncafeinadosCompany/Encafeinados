import { useMemo } from 'react';
import { useStores } from './storesQueries'; // Hook que obtiene todas las tiendas
import { Store, StoresResponse } from '@/api/types/storesTypes';

export const useFilteredStores = () => {
  const { data: storesResponse, isLoading, error } = useStores();

  // Filtra sólo las tiendas aprobadas.
  const approvedStores = useMemo((): Store[] => {
    const allStores =
      storesResponse && storesResponse.stores && storesResponse.stores.stores
        ? storesResponse.stores.stores
        : [];
    return allStores.filter((store) => store.status === 'APPROVED');
  }, [storesResponse]);

  // Devuelve la estructura similar a StoresResponse
  const filteredStoresResponse: StoresResponse | undefined =
    approvedStores.length > 0
      ? { message: 'Filtered approved stores', stores: { stores: approvedStores } }
      : undefined;

  return { data: filteredStoresResponse, isLoading, error };
};