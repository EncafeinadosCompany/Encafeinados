import { useState, useCallback } from 'react';

export const useMapLoading = () => {
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  
  const setTotalTiles = useCallback(() => {}, []);
  const setTilesLoaded = useCallback(() => {}, []);
  
  return {
    mapLoaded,
    setMapLoaded,
    loadingProgress,
    setLoadingProgress,
    tilesLoaded: 0,
    totalTiles: 100,
    setTotalTiles,
    setTilesLoaded
  };
};