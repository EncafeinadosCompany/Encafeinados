import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapControllerProps {
  setMapInstance: (map: L.Map) => void;
  setTotalTiles: (count: number) => void;
  setTilesLoaded: (count: number) => void;
  setLoadingProgress: (progress: number) => void;
  setMapLoaded: (loaded: boolean) => void;
}

const MapController: React.FC<MapControllerProps> = ({
  setMapInstance,
  setLoadingProgress,
  setMapLoaded
}) => {
  const map = useMap();
  const progressRef = useRef(0);
  const intervalRef = useRef<any>(null);
  
  useEffect(() => {
    if (map) {
      setMapInstance(map);
      
      // Configuración básica
      map.attributionControl.setPrefix('');
      map.setMinZoom(8);
      map.setMaxZoom(19);
      
      // Simulamos un progreso de carga más fiable
      intervalRef.current = setInterval(() => {
        progressRef.current += 5;
        if (progressRef.current >= 100) {
          progressRef.current = 100;
          clearInterval(intervalRef.current);
          setTimeout(() => {
            setMapLoaded(true);
          }, 300);
        }
        setLoadingProgress(progressRef.current);
      }, 150);
      
      // Timeout de seguridad
      setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setLoadingProgress(100);
        setMapLoaded(true);
      }, 5000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [map, setMapInstance, setLoadingProgress, setMapLoaded]);

  return null;
};

export default MapController;