import { useEffect, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import L from 'leaflet';

export const useUrlNavigation = (
  mapLoaded: boolean,
  cafes: any[],
  mapInstance: L.Map | null,
  activeCafe: string | number | null,
  setActiveCafe: (id: string | number | null) => void,
  apiHasActiveFilters: boolean,
  apiCafes: any[],
  clearFiltersForNavigation: () => void
) => {
  const [searchParams] = useSearchParams();
  const [processedCafeIds, setProcessedCafeIds] = useState<Set<string | number>>(new Set());
  
  const removeCafeIdParam = useCallback(() => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.delete("cafeId");
    const newUrl = `${window.location.pathname}${
      currentParams.toString() ? "?" + currentParams.toString() : ""
    }`;
    window.history.replaceState({}, "", newUrl);
  }, []);
  
  useEffect(() => {
    if (!mapLoaded || !cafes.length || !mapInstance) return;

    const cafeId = searchParams.get("cafeId");
    if (!cafeId) return;

    // Check if it's a pure number (legacy ID) or a UID string
    const isNumericId = /^\d+$/.test(cafeId);
    const actualCafeId = isNumericId ? parseInt(cafeId, 10) : cafeId;

    if (activeCafe === actualCafeId || processedCafeIds.has(actualCafeId)) {
      if (processedCafeIds.has(actualCafeId)) {
        const currentParams = new URLSearchParams(searchParams);
        currentParams.delete("cafeId");
        const newUrl = `${window.location.pathname}${
          currentParams.toString() ? "?" + currentParams.toString() : ""
        }`;
        window.history.replaceState({}, "", newUrl);
      }
      return;
    }

    const selectedCafe = cafes.find((cafe) => cafe.id === actualCafeId);
    if (!selectedCafe) {
      toast.error("La cafetería seleccionada no se encuentra disponible");
      return;
    }

    let needsFilterClear = false;
    if (
      apiHasActiveFilters &&
      !apiCafes.find((cafe) => cafe.id === actualCafeId)
    ) {
      needsFilterClear = true;

      clearFiltersForNavigation();

      toast.success(
        "Se limpiaron los filtros para mostrar la cafetería seleccionada",
        {
          duration: 3000,
          icon: "🔍",
        }
      );
    }
    const showCafe = () => {
      setActiveCafe(actualCafeId);

      mapInstance.flyTo([selectedCafe.latitude, selectedCafe.longitude], 16, {
        duration: 1.5,
        animate: true,
      });
    };

    if (needsFilterClear) {
      setTimeout(() => {
        showCafe();
        removeCafeIdParam();
      }, 300);
    } else {
      showCafe();
      removeCafeIdParam();
    }
  }, [mapLoaded, cafes, mapInstance, searchParams, activeCafe, clearFiltersForNavigation, apiHasActiveFilters, apiCafes, processedCafeIds, removeCafeIdParam, setActiveCafe]);
  
  return {
    processedCafeIds,
    setProcessedCafeIds,
    removeCafeIdParam
  };
};