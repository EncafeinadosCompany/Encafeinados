import { useState, useEffect, useCallback } from 'react';
import L from 'leaflet';

export const useCafeDetails = (
  cafes: any[],
  mapInstance: L.Map | null,
  showRouteControls: boolean,
  searchParams: URLSearchParams
) => {
  const [activeCafe, setActiveCafe] = useState<number | null>(null);
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
  }, [shouldResetMapOnClose, showRouteControls, mapInstance, searchParams, activeCafe]);
  
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);
  
  return {
    activeCafe,
    setActiveCafe,
    activeCafeData,
    setActiveCafeData,
    shouldResetMapOnClose,
    setShouldResetMapOnClose,
    copied,
    handleCloseDetails,
    copyToClipboard
  };
};