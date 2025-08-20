import { useState, useEffect, useCallback } from 'react';
import L from 'leaflet';

export const useCafeDetails = (
  cafes: any[],
  mapInstance: L.Map | null,
  showRouteControls: boolean,
  searchParams: URLSearchParams,
  setProcessedCafeIds: (callback: (prev: Set<string | number>) => Set<string | number>) => void,
  activeCafe: string | number | null,
  setActiveCafe: (cafe: string | number | null) => void
) => {
  const [activeCafeData, setActiveCafeData] = useState<any | null>(null);
  const [shouldResetMapOnClose, setShouldResetMapOnClose] = useState(false);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (activeCafe) {
      const selectedCafe = cafes.find((cafe) => cafe.id === activeCafe);
      if (selectedCafe) {
        setActiveCafeData(selectedCafe);
      }
    } else {
      setActiveCafeData(null);
    }
  }, [activeCafe, cafes]);
  
  const handleCloseDetails = useCallback(() => {
    if (activeCafe) {
      setProcessedCafeIds(prev => {
        const newSet = new Set(prev);
        newSet.add(activeCafe);
        return newSet;
      });
    }

    setActiveCafe(null);

    const currentParams = new URLSearchParams(searchParams);
    if (currentParams.has("cafeId")) {
      currentParams.delete("cafeId");
      const newUrl = `${window.location.pathname}${
        currentParams.toString() ? "?" + currentParams.toString() : ""
      }`;
      window.history.replaceState({}, "", newUrl);
    }

    if (shouldResetMapOnClose && !showRouteControls) {
      mapInstance?.setZoom(13, { animate: true });
    }
  }, [shouldResetMapOnClose, showRouteControls, mapInstance, searchParams, activeCafe, setProcessedCafeIds, setActiveCafe]);
  
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);
  
  return {
    activeCafeData,
    setActiveCafeData,
    shouldResetMapOnClose,
    setShouldResetMapOnClose,
    copied,
    handleCloseDetails,
    copyToClipboard
  };
};