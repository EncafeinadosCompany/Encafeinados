import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { Cafe } from '@/api/types/map/map_search.types';
import CafeMarker from './cafe_marker.molecule';

interface SmartClusterGroupProps {
  cafes: Cafe[];
  activeCafe: string | number | null;
  setActiveCafe: (id: string | number) => void;
  setShowSidebar: (show: boolean) => void;
}

interface MarkerClusterGroupOptions extends L.LayerOptions {
  maxClusterRadius?: number;
  spiderfyOnMaxZoom?: boolean;
  showCoverageOnHover?: boolean;
  zoomToBoundsOnClick?: boolean;
  disableClusteringAtZoom?: number;
  chunkedLoading?: boolean;
  removeOutsideVisibleBounds?: boolean;
  animate?: boolean;
  animateAddingMarkers?: boolean;
  spiderfyDistanceMultiplier?: number;
  iconCreateFunction?: (cluster: L.MarkerCluster) => L.Icon | L.DivIcon;
}

interface EnhancedMarkerClusterGroup extends L.MarkerClusterGroup {
  options: MarkerClusterGroupOptions;
}

const SmartClusterGroup: React.FC<SmartClusterGroupProps> = ({
  cafes,
  activeCafe,
  setActiveCafe,
  setShowSidebar,
}) => {
  const map = useMap();
  const markerClusterGroupRef = useRef<EnhancedMarkerClusterGroup | null>(null);
  const markersRef = useRef<{[key: string | number]: L.Marker}>({});
  const [activeCafeObject, setActiveCafeObject] = useState<Cafe | null>(null);
  const previousCafesRef = useRef<Cafe[]>([]);
  const updateInProgressRef = useRef(false);
  const pendingUpdateRef = useRef(false);
  
  const getOptimalClusterRadius = useCallback(() => {
    const zoom = map.getZoom();
    
    const mapSize = map.getSize();
    const bounds = map.getBounds();
    const visibleCafes = cafes.filter(cafe => 
      bounds.contains([cafe.latitude, cafe.longitude])
    );
    
    if (visibleCafes.length === 0) return 80; 
    
    const cafePositions = visibleCafes.map(cafe => {
      const latLng = L.latLng(cafe.latitude, cafe.longitude);
      return map.latLngToContainerPoint(latLng);
    });
    
    let totalMinDistance = 0;
    let minDistancesCount = 0;
    
    cafePositions.forEach((pos, i) => {
      let minDistance = Infinity;
      
      cafePositions.forEach((otherPos, j) => {
        if (i !== j) {
          const distance = pos.distanceTo(otherPos);
          if (distance < minDistance) {
            minDistance = distance;
          }
        }
      });
      
      if (minDistance !== Infinity) {
        totalMinDistance += minDistance;
        minDistancesCount++;
      }
    });
    
    const avgMinDistance = minDistancesCount > 0 ? 
      totalMinDistance / minDistancesCount : 80;
    
    if (visibleCafes.length > 100) {
      return Math.max(18, avgMinDistance * 0.25);
    } else if (visibleCafes.length > 30) { 
      return Math.max(22, avgMinDistance * 0.35);
    } else {
      return Math.max(25, avgMinDistance * 0.55);
    }
  }, [map, cafes]);

  const createAdvancedClusterIcon = useCallback((cluster: L.MarkerCluster) => {
    const markers = cluster.getAllChildMarkers();
    const count = markers.length;
    
    let size, bgColor, textColor;
    
    if (count < 5) {
      size = 36;
      bgColor = 'rgba(111, 78, 55, 0.95)'; // Café principal con transparencia
      textColor = '#FFFFFF';
    } else if (count < 15) {
      size = 42;
      bgColor = 'rgba(93, 64, 55, 0.95)'; // Café más oscuro
      textColor = '#FFFFFF';
    } else if (count < 30) {
      size = 48;
      bgColor = 'rgba(76, 52, 44, 0.95)'; // Café aún más oscuro
      textColor = '#FFFFFF';
    } else {
      size = 54;
      bgColor = 'rgba(60, 41, 34, 0.95)'; // Café muy oscuro
      textColor = '#FFFFFF';
    }
    
    return L.divIcon({
      html: `
        <div class="clean-cluster-marker" 
             style="
               width: ${size}px; 
               height: ${size}px; 
               background-color: ${bgColor}; 
               color: ${textColor};
             ">
          <span class="cluster-text">${count}</span>
        </div>
      `,
      className: 'custom-clean-cluster',
      iconSize: L.point(size, size),
      iconAnchor: [size/2, size/2]
    });
  }, [cafes]);

  const createLeafletMarker = useCallback((cafe: Cafe) => {
    const isActive = activeCafe === cafe.id;
    
    const zoom = map.getZoom();
    let size: number;
    if (zoom < 13) size = isActive ? 32 : 28;
    else if (zoom < 15 && zoom >= 13) size = isActive ? 38 : 34;
    else size = isActive ? 44 : 40;
    
    const marker = L.marker([cafe.latitude, cafe.longitude], {
      icon: L.divIcon({
        className: 'custom-cafe-marker',
        html: `
          <div class="${cafe.isOpen ? 'cafe-bounce-wrapper' : ''}">
            <div 
              class="cafe-marker ${isActive ? 'active' : ''} ${!cafe.isOpen ? 'closed' : ''}" 
              data-cafe-id="${cafe.id}"
              style="width:${size}px;height:${size}px;"
            >
              <div class="marker-content">
                <img 
                  src="${cafe.image}" 
                  alt="${cafe.name}" 
                  onerror="this.onerror=null;this.src='https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';" 
                />
                ${!cafe.isOpen ? '<div class="closed-dot"></div>' : ''}
                
                ${cafe.isOpen ? `
                  <div class="coffee-steam cafe-steam" style="position: absolute; top: -8px; left: 50%; transform: translateX(-50%); width: 24px; height: 20px; z-index: 10;">
                    <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                      <path d="M4 16C2 13 3 10 5 8" stroke="white" stroke-width="2" opacity="0.7" stroke-linecap="round" class="steam-path steam-1"/>
                      <path d="M12 18C9 14 10 10 12 7" stroke="white" stroke-width="2" opacity="0.7" stroke-linecap="round" class="steam-path steam-2"/>
                      <path d="M20 16C22 13 21 10 19 8" stroke="white" stroke-width="2" opacity="0.7" stroke-linecap="round" class="steam-path steam-3"/>
                    </svg>
                  </div>
                ` : ''}
              </div>
              ${isActive ? '<div class="pulse-ring"></div>' : ''}
            </div>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size/2, size],
      }),
      zIndexOffset: isActive ? 1000 : (cafe.isOpen ? 100 : 0),
      alt: cafe.id.toString(), 
    });
    
    marker.on('click', () => {
      setActiveCafe(cafe.id);
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
      
      const element = marker.getElement();
      if (element) {
        element.classList.add('clicked');
        setTimeout(() => {
          element.classList.remove('clicked');
        }, 300);
      }
    });
    
    marker.on('mouseover', () => {
      const element = marker.getElement();
      if (element) {
        const markerDiv = element.querySelector('.cafe-marker');
        if (markerDiv) markerDiv.classList.add('hovered');
      }
    });
    
    marker.on('mouseout', () => {
      const element = marker.getElement();
      if (element) {
        const markerDiv = element.querySelector('.cafe-marker');
        if (markerDiv) markerDiv.classList.remove('hovered');
      }
    });
    
    return marker;
  }, [map, activeCafe, setActiveCafe, setShowSidebar]);

  const updateMarkers = useCallback(() => {
    if (updateInProgressRef.current) {
      pendingUpdateRef.current = true;
      return;
    }
    
    updateInProgressRef.current = true;
    
    try {
      if (!map || !cafes.length) return;
      
      if (!markerClusterGroupRef.current) {
        const clusterOptions: MarkerClusterGroupOptions = {
          iconCreateFunction: createAdvancedClusterIcon,
          maxClusterRadius: getOptimalClusterRadius(),
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
          zoomToBoundsOnClick: true,
          disableClusteringAtZoom: 18,
          chunkedLoading: true,
          removeOutsideVisibleBounds: false, 
          animate: true,
          animateAddingMarkers: true,
          spiderfyDistanceMultiplier: 2,
        };
        
        markerClusterGroupRef.current = L.markerClusterGroup(clusterOptions) as EnhancedMarkerClusterGroup;
        map.addLayer(markerClusterGroupRef.current);
      }
      
      const mcg = markerClusterGroupRef.current;
      
      const previousCafes = previousCafesRef.current;
      const cafeIds = cafes.map(c => c.id);
      const previousCafeIds = previousCafes.map(c => c.id);
      
      const addedCafes = cafes.filter(c => !previousCafeIds.includes(c.id));
      const removedCafeIds = previousCafeIds.filter(id => !cafeIds.includes(id));
      const potentiallyChangedCafes = cafes.filter(c => 
        previousCafeIds.includes(c.id) && c.id !== activeCafe
      );
      
      removedCafeIds.forEach(id => {
        if (markersRef.current[id]) {
          mcg.removeLayer(markersRef.current[id]);
          delete markersRef.current[id];
        }
      });
      
      addedCafes.forEach(cafe => {
        if (cafe.id !== activeCafe) {
          const marker = createLeafletMarker(cafe);
          markersRef.current[cafe.id] = marker;
          mcg.addLayer(marker);
        }
      });
      
      potentiallyChangedCafes.forEach(cafe => {
        const previousCafe = previousCafes.find(c => c.id === cafe.id);
        const hasChanged = previousCafe && (
          previousCafe.isOpen !== cafe.isOpen ||
          previousCafe.rating !== cafe.rating ||
          previousCafe.image !== cafe.image
        );
        
        if (hasChanged) {
          if (markersRef.current[cafe.id]) {
            mcg.removeLayer(markersRef.current[cafe.id]);
          }
          const marker = createLeafletMarker(cafe);
          markersRef.current[cafe.id] = marker;
          mcg.addLayer(marker);
        }
      });
      
      if (activeCafe) {
        const activeCafeData = cafes.find(cafe => cafe.id === activeCafe);
        
        if (activeCafeData) {
          setActiveCafeObject(activeCafeData);
          
          if (markersRef.current[activeCafe]) {
            mcg.removeLayer(markersRef.current[activeCafe]);
          }
          
          if (markersRef.current['active'] && map.hasLayer(markersRef.current['active'])) {
            map.removeLayer(markersRef.current['active']);
          }
          
          const activeMarker = createLeafletMarker(activeCafeData);
          markersRef.current['active'] = activeMarker;
          activeMarker.addTo(map);
        }
      } else {
        setActiveCafeObject(null);
        
        // 1. Guarda la referencia del marcador activo que vamos a eliminar
        const activeMarker = markersRef.current['active'];
        const activeMarkerId = Object.keys(markersRef.current).find(
          key => markersRef.current[key] === activeMarker && key !== 'active'
        );
        
        if (activeMarker && map.hasLayer(activeMarker)) {
          map.removeLayer(activeMarker);
          delete markersRef.current['active'];
          
          if (activeMarkerId) {
            const cafeToRestore = cafes.find(c => c.id.toString() === activeMarkerId);
            if (cafeToRestore) {
              const restoredMarker = createLeafletMarker(cafeToRestore);
              markersRef.current[cafeToRestore.id] = restoredMarker;
              mcg.addLayer(restoredMarker);
            }
          }
        }
        
        cafes.forEach(cafe => {
          if (!markersRef.current[cafe.id] && !mcg.hasLayer(markersRef.current[cafe.id])) {
            const marker = createLeafletMarker(cafe);
            markersRef.current[cafe.id] = marker;
            mcg.addLayer(marker);
          }
        });
      }
      
      previousCafesRef.current = [...cafes];
      
      const newRadius = getOptimalClusterRadius();
      
      if (mcg.options) {
        mcg.options.maxClusterRadius = newRadius;
      }
      
      mcg.refreshClusters();
      
    } catch (error) {
      console.error("Error al actualizar marcadores:", error);
    } finally {
      updateInProgressRef.current = false;
      
      if (pendingUpdateRef.current) {
        pendingUpdateRef.current = false;
        setTimeout(updateMarkers, 10);
      }
    }
  }, [
    map, 
    cafes, 
    activeCafe, 
    createLeafletMarker, 
    createAdvancedClusterIcon,
    getOptimalClusterRadius
  ]);
  
  useEffect(() => {
    if (!map) return;
    
    let updateThrottled = false;
    
    updateMarkers();
    
    const handleZoomOrMoveEnd = () => {
      if (updateThrottled) return;
      
      updateThrottled = true;
      
      if (markerClusterGroupRef.current) {
        const optimalRadius = getOptimalClusterRadius();
        
        if (Math.abs((markerClusterGroupRef.current.options.maxClusterRadius || 80) - optimalRadius) > 5) {
          markerClusterGroupRef.current.options.maxClusterRadius = optimalRadius;
          markerClusterGroupRef.current.refreshClusters();
        }
      }
      
      setTimeout(() => {
        updateThrottled = false;
      }, 200);
    };
    
    map.on('zoomend', handleZoomOrMoveEnd);
    map.on('moveend', handleZoomOrMoveEnd);
    
    const handleViewReset = () => {
      if (!markerClusterGroupRef.current) return;
      
      const bounds = map.getBounds().pad(0.5);
      let refreshNeeded = false;
      
      Object.entries(markersRef.current).forEach(([key, marker]) => {
        if (key !== 'active' && marker) {
          const isVisible = bounds.contains(marker.getLatLng());
          
          if (!isVisible && !map.hasLayer(marker) && !markerClusterGroupRef.current?.hasLayer(marker)) {
            try {
              markerClusterGroupRef.current?.addLayer(marker);
              refreshNeeded = true;
            } catch (e) {
              console.log("No se pudo re-añadir marcador:", e);
            }
          }
        }
      });
      
      if (refreshNeeded) {
        markerClusterGroupRef.current.refreshClusters();
      }
    };
    
    map.on('viewreset', handleViewReset);
    
    return () => {
      map.off('zoomend', handleZoomOrMoveEnd);
      map.off('moveend', handleZoomOrMoveEnd);
      map.off('viewreset', handleViewReset);
    };
  }, [map, updateMarkers, getOptimalClusterRadius]);
  
  useEffect(() => {
    if (!map || !cafes.length || !markerClusterGroupRef.current) return;
    
    const mcg = markerClusterGroupRef.current;
    
    if (activeCafe === null) {
      if (markersRef.current['active'] && map.hasLayer(markersRef.current['active'])) {
        map.removeLayer(markersRef.current['active']);
        delete markersRef.current['active'];
      }
      
      mcg.clearLayers();
      
      Object.keys(markersRef.current).forEach(key => {
        if (key !== 'active') {
          delete markersRef.current[key];
        }
      });
      
      cafes.forEach(cafe => {
        const marker = createLeafletMarker(cafe);
        markersRef.current[cafe.id] = marker;
        mcg.addLayer(marker);
      });
      
      mcg.refreshClusters();
    }
    else {
      const activeCafeData = cafes.find(cafe => cafe.id === activeCafe);
      
      if (activeCafeData) {
        setActiveCafeObject(activeCafeData);
        
        if (markersRef.current[activeCafe]) {
          mcg.removeLayer(markersRef.current[activeCafe]);
        }
        
        if (markersRef.current['active'] && map.hasLayer(markersRef.current['active'])) {
          map.removeLayer(markersRef.current['active']);
        }
        
        const activeMarker = createLeafletMarker(activeCafeData);
        markersRef.current['active'] = activeMarker;
        activeMarker.addTo(map);
      }
    }
  }, [activeCafe, cafes, map, createLeafletMarker]);

  useEffect(() => {
    return () => {
      if (!map) return;
      
      if (markerClusterGroupRef.current) {
        map.removeLayer(markerClusterGroupRef.current);
      }
      
      Object.values(markersRef.current).forEach(marker => {
        if (map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      });
    };
  }, [map]);

  return (
    <>
      {activeCafeObject && (
        <CafeMarker
          key={`react-active-${activeCafeObject.id}`}
          cafe={activeCafeObject}
          isActive={true}
          onClick={() => {}}
        />
      )}
    </>
  );
};

export default SmartClusterGroup;