import { useState } from 'react';

export const useMapLoading = () => {
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [tilesLoaded, setTilesLoaded] = useState<number>(0);
  const [totalTiles, setTotalTiles] = useState<number>(0);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  
  return {
    mapLoaded,
    setMapLoaded,
    tilesLoaded,
    setTilesLoaded,
    totalTiles,
    setTotalTiles,
    loadingProgress,
    setLoadingProgress
  };
};