import React, { useState, useEffect, useMemo } from 'react';
import { useMap, Marker, Tooltip } from 'react-leaflet';
import { Cafe } from '@/api/types/map/map_search.types';
import CafeMarker from './cafe_marker.molecule';
import L from 'leaflet';

// Define la estructura de un cluster
interface ClusterData {
  id: string;
  position: [number, number];
  cafes: Cafe[];
}

interface SmartClusterGroupProps {
  cafes: Cafe[];
  activeCafe: number | null;
  setActiveCafe: (id: number) => void;
  setShowSidebar: (show: boolean) => void;
}

// Props para el marcador de cluster
interface ClusterMarkerProps {
  position: [number, number];
  count: number;
  onClick: () => void;
}

const SmartClusterGroup: React.FC<SmartClusterGroupProps> = ({
  cafes,
  activeCafe,
  setActiveCafe,
  setShowSidebar,
}) => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  
  // Actualizar zoom cuando cambia
  useEffect(() => {
    const handleZoom = () => {
      setZoom(map.getZoom());
    };
    
    map.on('zoomend', handleZoom);
    return () => {
      map.off('zoomend', handleZoom);
    };
  }, [map]);
  
  // Determinar radio de agrupación basado en el zoom
  const getClusterRadius = () => {
    // Umbral de zoom para decidir si agrupar o no
    if (zoom >= 15) return 0;       // No agrupar (marcadores individuales)
    if (zoom >= 13) return 80;      // Agrupar puntos muy cercanos
    if (zoom >= 11) return 150;     // Agrupar puntos moderadamente cercanos
    return 300;                     // Agrupar puntos distantes
  };
  
  // Calcular clusters o marcadores individuales
  const { clusters, singleCafes } = useMemo(() => {
    const clusterRadius = getClusterRadius();
    
    // Si el zoom es alto, mostrar todos los marcadores individualmente
    if (clusterRadius === 0) {
      return { clusters: [] as ClusterData[], singleCafes: cafes };
    }
    
    // Variables para el algoritmo de clustering
    const result: ClusterData[] = [];
    const processed = new Set<number>();
    const singles: Cafe[] = [];
    
    // Procesar cada café para encontrar grupos
    for (let i = 0; i < cafes.length; i++) {
      const cafe = cafes[i];
      
      // Si ya está en un grupo, saltar
      if (processed.has(cafe.id)) continue;
      
      // Cafés que estarán en este grupo
      const groupCafes = [cafe];
      processed.add(cafe.id);
      
      // Buscar cafés cercanos para agrupar
      for (let j = 0; j < cafes.length; j++) {
        if (i === j) continue;
        const otherCafe = cafes[j];
        
        if (processed.has(otherCafe.id)) continue;
        
        // Calcular distancia entre cafés
        const distance = L.latLng(cafe.latitude, cafe.longitude)
          .distanceTo(L.latLng(otherCafe.latitude, otherCafe.longitude));
        
        // Agrupar si están dentro del radio
        if (distance <= clusterRadius) {
          groupCafes.push(otherCafe);
          processed.add(otherCafe.id);
        }
      }
      
      // Si solo hay 1 café, es un marcador individual
      if (groupCafes.length === 1) {
        singles.push(cafe);
      } 
      // Si hay múltiples, es un grupo
      else {
        // Calcular el centro del grupo (promedio de coordenadas)
        const sumLat = groupCafes.reduce((sum, c) => sum + c.latitude, 0);
        const sumLng = groupCafes.reduce((sum, c) => sum + c.longitude, 0);
        const centerLat = sumLat / groupCafes.length;
        const centerLng = sumLng / groupCafes.length;
        
        result.push({
          id: `cluster-${cafe.id}`,
          position: [centerLat, centerLng] as [number, number],
          cafes: groupCafes
        });
      }
    }
    
    return { clusters: result, singleCafes: singles };
  }, [cafes, zoom]);
  
  // Manejar clic en un grupo
  const handleClusterClick = (cluster: ClusterData) => {
    const bounds = L.latLngBounds(
      cluster.cafes.map((cafe: Cafe) => [cafe.latitude, cafe.longitude] as [number, number])
    );
    
    // Hacer zoom para mostrar todos los cafés del grupo
    map.fitBounds(bounds, { 
      padding: [50, 50],
      maxZoom: 15 // No hacer zoom más allá del umbral de clustering
    });
  };
  
  return (
    <>
      {/* Primero renderizar los clusters para que queden abajo */}
      {clusters.map(cluster => (
        <ClusterMarker
          key={cluster.id}
          position={cluster.position}
          count={cluster.cafes.length}
          onClick={() => handleClusterClick(cluster)}
        />
      ))}
      
      {/* Luego renderizar los marcadores individuales */}
      {singleCafes.map(cafe => {
        const marker = L.marker([cafe.latitude, cafe.longitude], {
          icon: L.icon({
            iconUrl: 'path/to/icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
          })
        })
        .bindTooltip(cafe.name, {
          permanent: false,
          direction: 'top',
          className: 'cafe-tooltip',
          offset: [0, -35]
        })
        .on('click', () => {
          setActiveCafe(cafe.id);
          setShowSidebar(true);
        });

        return (
          <CafeMarker
            key={cafe.id}
            cafe={cafe}
            isActive={activeCafe === cafe.id}
            onClick={() => {
              setActiveCafe(cafe.id);
              if (window.innerWidth >= 768) {
                setShowSidebar(true);
              }
            }}
          />
        );
      })}
      
      {/* Por último, asegurar que el marcador activo siempre esté visible */}
      {activeCafe && cafes.some(c => c.id === activeCafe) && !singleCafes.some(c => c.id === activeCafe) && (
        <CafeMarker
          key={`active-${activeCafe}`}
          cafe={cafes.find(c => c.id === activeCafe)!} // El '!' asegura que no es undefined (ya verificado con some)
          isActive={true}
          onClick={() => {}}
        />
      )}
    </>
  );
};

// Componente para mostrar el marcador de un grupo
const ClusterMarker: React.FC<ClusterMarkerProps> = ({ position, count, onClick }) => {
  const sizeBase = count < 3 ? 38 : count < 6 ? 42 : count < 10 ? 46 : 50;
  
  const clusterIcon = L.divIcon({
    className: 'cluster-marker-container',
    html: `
      <div class="cluster-marker" style="width:${sizeBase}px;height:${sizeBase}px;">
        <span>${count}</span>
      </div>
    `,
    iconSize: [sizeBase, sizeBase],
    iconAnchor: [sizeBase/2, sizeBase/2],
  });
  
  return (
    <Marker
      position={position}
      icon={clusterIcon}
      eventHandlers={{ click: onClick }}
      zIndexOffset={900} // Debajo de los marcadores individuales
    >
      <Tooltip direction="top" offset={[0, -20]} permanent={false}>
        {count} cafeterías cercanas
      </Tooltip>
    </Marker>
  );
};

export default SmartClusterGroup;