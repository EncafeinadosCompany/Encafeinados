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
  setTotalTiles,
  setTilesLoaded,
  setLoadingProgress,
  setMapLoaded
}) => {
  const map = useMap();
  const tileLoadingRef = useRef({
    total: 0,
    loaded: 0,
  });
  
  useEffect(() => {
    if (map) {
      setMapInstance(map);
      
      map.attributionControl.setPrefix('');
      
      map.on('layeradd', (e) => {
        if (e.layer instanceof L.TileLayer) {
          e.layer.on('loading', () => {
            tileLoadingRef.current.total += 16; // Estimado de tiles a cargar
            setTotalTiles(tileLoadingRef.current.total);
          });
          
          e.layer.on('load', () => {
            tileLoadingRef.current.loaded += 1;
            setTilesLoaded(tileLoadingRef.current.loaded);
            
            const progress = Math.min(
              100,
              Math.round(
                (tileLoadingRef.current.loaded / tileLoadingRef.current.total) * 100
              )
            );
            
            setLoadingProgress(progress);
            
            if (progress >= 98) {
              setTimeout(() => {
                setMapLoaded(true);
              }, 500);
            }
          });
          
          e.layer.on('tileloadstart', () => {
            tileLoadingRef.current.total += 1;
            setTotalTiles(tileLoadingRef.current.total);
          });
          
          e.layer.on('tileload', () => {
            tileLoadingRef.current.loaded += 1;
            setTilesLoaded(tileLoadingRef.current.loaded);
            
            const progress = Math.min(
              100,
              Math.round(
                (tileLoadingRef.current.loaded / tileLoadingRef.current.total) * 100
              )
            );
            
            setLoadingProgress(progress);
            
            if (progress >= 98) {
              setTimeout(() => {
                setMapLoaded(true);
              }, 500);
            }
          });
        }
      });

      // Configurar zoom mínimo y máximo
      map.setMinZoom(8);
      map.setMaxZoom(19);
      
      // Configurar límites de vista (opcional)
      const southWest = L.latLng(-5.0, -85.0);
      const northEast = L.latLng(13.0, -70.0);
      const bounds = L.latLngBounds(southWest, northEast);
      map.setMaxBounds(bounds);
      
      // Establecer un timeout de seguridad para mostrar el mapa
      // en caso de que la carga de tiles no se complete correctamente
      setTimeout(() => {
        setMapLoaded(true);
      }, 5000);
    }
  }, [map, setMapInstance, setTotalTiles, setTilesLoaded, setLoadingProgress, setMapLoaded]);

  // Componente no renderiza nada visible
  return null;
};

export default MapController;