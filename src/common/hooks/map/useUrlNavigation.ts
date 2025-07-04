import { useEffect, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import L from 'leaflet';

export const useUrlNavigation = (
  mapLoaded: boolean,
  cafes: any[],
  mapInstance: L.Map | null,
  activeCafe: number | null,
  setActiveCafe: (id: number | null) => void,
  apiHasActiveFilters: boolean,
  apiCafes: any[],
  clearFiltersForNavigation: () => void
) => {
  const [searchParams] = useSearchParams();
  const [processedCafeIds, setProcessedCafeIds] = useState<Set<number>>(new Set());
  
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

    const cafeIdNumber = parseInt(cafeId, 10);
    if (isNaN(cafeIdNumber)) return;

    if (activeCafe === cafeIdNumber || processedCafeIds.has(cafeIdNumber)) {
      if (processedCafeIds.has(cafeIdNumber)) {
        const currentParams = new URLSearchParams(searchParams);
        currentParams.delete("cafeId");
        const newUrl = `${window.location.pathname}${
          currentParams.toString() ? "?" + currentParams.toString() : ""
        }`;
        window.history.replaceState({}, "", newUrl);
      }
      return;
    }

    const selectedCafe = cafes.find((cafe) => cafe.id === cafeIdNumber);
    if (!selectedCafe) {
      toast.error("La cafetería seleccionada no se encuentra disponible");
      return;
    }

    let needsFilterClear = false;
    if (
      apiHasActiveFilters &&
      !apiCafes.find((cafe) => cafe.id === cafeIdNumber)
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
      setActiveCafe(cafeIdNumber);

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