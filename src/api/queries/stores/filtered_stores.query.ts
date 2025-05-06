import { useMemo } from 'react';
import { useStores } from './stores.query';
import { Store, StoresResponse } from '@/api/types/stores/stores.type';

export const useFilteredStores = () => {
  const { data: storesResponse, isLoading, error } = useStores();

  const approvedStores = useMemo((): Store[] => {

    const allStores =
      storesResponse && storesResponse.stores && storesResponse.stores.stores
        ? storesResponse.stores.stores
        : [];

    return allStores.filter((store) => store.status === 'APPROVED');
    
  }, [storesResponse]);

  const filteredStoresResponse: StoresResponse | undefined =
    approvedStores.length > 0
      ? { message: 'Filtered approved stores', stores: { stores: approvedStores } }
      : undefined;

  return { data: filteredStoresResponse, isLoading, error };
};