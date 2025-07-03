import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Filter, Coffee, Navigation, Map as MapIcon, X} from "@/common/ui/icons";
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import '@/common/styles/leaflet-markercluster.css';
import '@/common/styles/mapMarkers.css';
import '@/common/styles/desktopDetails.css';

//   COMMENTS FOR EACH SECTION ARE NECESSARY IN THIS MODULE BECAUSE I GET LOST :(

// API imports

import { useApprovedStores } from '@/api/queries/stores/stores.query';
import { useBranchesByStore } from '@/api/queries/stores/stores.query';

// Types
import { Cafe } from '@/api/types/map/map_search.types';

// Hooks
import { useFavorites } from '@/common/hooks/map/useFavorites';
import { useGeolocation } from '@/common/hooks/map/useGeolocation';
import { useMapData } from '@/common/hooks/map/useMapData';
import { useBranchSearch } from '@/common/hooks/map/useBranchSearch';
import { useRouteNavigation } from '@/common/hooks/map/useRouteNavigation';

// Components
import MapFocus from '@/common/molecules/map/map_focus.molecule';
import FilterModal from '@/common/molecules/map/filter_modal.molecule';
import HighlightText from '@/common/atoms/HighlightText';
import SmartClusterGroup from '@/common/molecules/map/smart_custer_group.molecule';
import UserMarker from '@/common/molecules/map/user_marker.molecule'; 
import DirectRouteLine from '@/common/molecules/map/direct_route_line.molecule';
import RouteControls from '@/common/molecules/map/route_controls.molecule';
import '@/common/styles/mapMarkers.css';
import CafeDetail from '@/common/molecules/map/cafe_detail.molecule';
import MapSidebar from '@/common/molecules/map/map_sidebar.molecule';
import { containerVariants, cardVariants, pulseVariants } from './map_animations.widget';
import { useBranches, useSearchBranches } from '@/api/queries/branches/branch.query';
import LoadingSpinner from '@/common/atoms/LoadingSpinner';
import { useAppData } from '@/common/context/AppDataContext';
// import 'leaflet.markercluster/dist/leaflet.markercluster.css';
import '@/common/styles/leaflet-markercluster.css';

const MapController: React.FC<{
  setMapInstance: (map: L.Map) => void;
  setTotalTiles: (total: number) => void;
  setTilesLoaded: (loaded: number) => void;
  setLoadingProgress: (progress: number) => void;
  setMapLoaded: (loaded: boolean) => void;
}> = ({
  setMapInstance,
  setTotalTiles,
  setTilesLoaded,
  setLoadingProgress,
  setMapLoaded
}) => {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      setMapInstance(map);
      
      setTimeout(() => {
        const mapContainer = map.getContainer();
        const controlContainer = mapContainer.querySelector('.leaflet-control-container') as HTMLElement;
        if (controlContainer) {
          controlContainer.style.zIndex = '400';
        }
        
        mapContainer.addEventListener('touchmove', () => {}, { passive: true });
      }, 100);
      
      let loadedTiles = 0;
      let totalTilesCount = 0;
      
      setLoadingProgress(30);
      
      const backupTimer = setTimeout(() => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (loadedTiles === 0) {
          if (isMobile) {
            let fakeTotalTiles = 12;
            let fakeLoadedTiles = 0;
            
            let progress = 30;
            const interval = setInterval(() => {
              progress += Math.floor(Math.random() * 4) + 2;
              setLoadingProgress(progress);
              
              fakeLoadedTiles = Math.ceil((progress - 30) / 70 * fakeTotalTiles);
              setTotalTiles(fakeTotalTiles);
              setTilesLoaded(fakeLoadedTiles);
              
              if (progress >= 90) {
                clearInterval(interval);
                setTimeout(() => {
                  setLoadingProgress(95);
                  setTimeout(() => {
                    setLoadingProgress(100);
                    setTimeout(() => setMapLoaded(true), 300);
                  }, 200);
                }, 300);
              }
            }, 200);
            
            return () => clearInterval(interval);
          } else {
            let progress = 30;
            const interval = setInterval(() => {
              progress += Math.floor(Math.random() * 4) + 2; 
              setLoadingProgress(progress);
              
              if (progress >= 90) {
                clearInterval(interval);
                setTimeout(() => {
                  setLoadingProgress(95);
                  setTimeout(() => {
                    setLoadingProgress(100);
                    setTimeout(() => setMapLoaded(true), 300);
                  }, 200);
                }, 300);
              }
            }, 200);
            
            return () => clearInterval(interval);
          }
        }
      }, 2500);
      
      const maxWaitTimer = setTimeout(() => {
        setLoadingProgress(100);
        setTimeout(() => setMapLoaded(true), 300);
      }, 4000);
      
      function onTileLoadStart() {
        totalTilesCount++;
        setTotalTiles(totalTilesCount);
      }
      
      function onTileLoad() {
        loadedTiles++;
        setTilesLoaded(loadedTiles);
        
        const maxTiles = Math.max(10, totalTilesCount);
        const tileProgress = Math.min(Math.floor((loadedTiles / maxTiles) * 70), 70);
        const totalProgress = 30 + tileProgress;
        
        setLoadingProgress(totalProgress);
        
        if (totalProgress >= 90) {
          setTimeout(() => {
            setLoadingProgress(100);
            setTimeout(() => {
              setMapLoaded(true);
            }, 300);
          }, 200);
        }
      }
      
      map.on('tileloadstart', onTileLoadStart);
      map.on('tileload', onTileLoad);
  
      return () => {
        map.off('tileloadstart', onTileLoadStart);
        map.off('tileload', onTileLoad);
        clearTimeout(backupTimer);
        clearTimeout(maxWaitTimer);
      };
    }
  }, [map, setMapInstance, setTotalTiles, setTilesLoaded, setLoadingProgress, setMapLoaded]);
  
  return null;
};

// ==============================
// MAIN COMPONENT
// ==============================


export interface MapViewProps {
  view?: boolean;
}

const MapView: React.FC<MapViewProps> = ({ view: showView }) => {
  const { isMobile } = useAppData();
  const [searchParams] = useSearchParams();
  
  // ==============================
  // STATE MANAGEMENT
  // ==============================
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [tilesLoaded, setTilesLoaded] = useState<number>(0);
  const [totalTiles, setTotalTiles] = useState<number>(0);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [activeCafe, setActiveCafe] = useState<number | null>(null);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [showDirections, setShowDirections] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedStore, setSelectedStore] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTermLocal] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [isSearchProcessing, setIsSearchProcessing] = useState(false);
  const lastToastRef = useRef('');
  const [copied, setCopied] = useState(false);
  const [showRouteControls, setShowRouteControls] = useState<boolean>(false);
  const [shouldResetMapOnClose, setShouldResetMapOnClose] = useState(false);
  const [view, setView] = useState(true);
  const [activeCafeData, setActiveCafeData] = useState<Cafe | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Custom hooks
  const { favorites, toggleFavorite } = useFavorites();
  const {
    userLocation,
    locatingUser,
    accuracy,
    errorMessage,
    getUserLocation
  } = useGeolocation(mapInstance);
  const {
    transportMode,
    setTransportMode,
    origin: routeOrigin,
    destination: routeDestination,
    setOrigin: setRouteOrigin,
    setDestination: setRouteDestination,
    isCalculatingRoute: isRouteLoading,
    setIsCalculatingRoute: setIsRouteLoading,
    routeInfo,
    setRouteInfo,
    routeCoordinates,
    clearRoute,
    isRouteActive
  } = useRouteNavigation();

  // ==============================
  // API DATA FETCHING
  // ==============================
  const { data: branchesData, isLoading: branchesLoading, error: branchesError } = useBranches();
  const { data: storesData, isLoading: storesLoading } = useApprovedStores();
  const { data: filteredBranchesData } = useBranchesByStore(selectedStore);

  // ==============================
  // DERIVED STATE / COMPUTED VALUES 
  // ==============================
  const {
    defaultCenter,
    cafes,
    cafePositions,
    filteredCafes,
    sortedCafes: mapDataSortedCafes,
    activeCafeData: derivedActiveCafeData,
    availableStores
  } = useMapData(
    branchesData,
    filteredBranchesData,
    userLocation,
    activeCafe,
    storesData
  );

  // ==============================
  // SEARCH AND FILTER (API-BASED)
  // ==============================

  // Hook para búsqueda y filtros basado en API
  const {
    searchTerm: apiSearchTerm,
    setSearchTerm: setApiSearchTerm,
    filterOptions: apiFilters,
    updateFilterOptions: updateApiFilters,
    resetFilters: resetApiFilters,
    hasActiveFilters: apiHasActiveFilters,
    cafes: apiCafes,
    isLoading: apiIsLoading
  } = useBranchSearch(userLocation || undefined);

  // Usar datos de la API cuando están disponibles, sino usar datos locales
  const sortedCafes = useMemo(() => {
    return apiCafes.length > 0 ? apiCafes : cafes;
  }, [apiCafes, cafes]);

  const availableTags = useMemo(() => {
    const allTags = cafes.flatMap(cafe => cafe.tags);
    return [...new Set(allTags)];
  }, [cafes]);

  const toggleFilterModal = useCallback(() => {
    if (activeCafe) {
      setActiveCafe(null); 
    }
    setIsFilterModalOpen(!isFilterModalOpen);
  }, [isFilterModalOpen, activeCafe]);

  useEffect(() => {
    setApiSearchTerm(searchTerm);
  }, [searchTerm, setApiSearchTerm]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInputValue(value);
    setIsTyping(true);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInputValue !== debouncedSearchValue) {
        setDebouncedSearchValue(searchInputValue);
      }
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInputValue, debouncedSearchValue]);

  useEffect(() => {
    if (!debouncedSearchValue || debouncedSearchValue.length < 3) {
      setIsTyping(false);
      if (debouncedSearchValue === '') {
        setSearchTermLocal('');
        setApiSearchTerm('');
      }
      return;
    }

    setIsSearchProcessing(true);
    setIsTyping(false);

    const currentSearch = debouncedSearchValue.trim();

    const filterTimer = setTimeout(() => {
      setSearchTermLocal(currentSearch);
      setApiSearchTerm(currentSearch);

      const resultTimer = setTimeout(() => {
        const searchHash = `${currentSearch}-${sortedCafes.length}`;
        const shouldShowToast = lastToastRef.current !== searchHash;

        if (sortedCafes.length > 0) {
          if (userLocation) {
            const closestCafe = sortedCafes[0];
            if (activeCafe !== closestCafe.id || shouldShowToast) {
              setActiveCafe(closestCafe.id);

              if (mapInstance) {
                mapInstance.flyTo(
                  [closestCafe.latitude, closestCafe.longitude],
                  16,
                  { duration: 1.5, animate: true }
                );
              }
            }
          } else {
            const firstResult = sortedCafes[0];
            if (activeCafe !== firstResult.id || shouldShowToast) {
              setActiveCafe(firstResult.id);

              if (mapInstance) {
                mapInstance.flyTo(
                  [firstResult.latitude, firstResult.longitude],
                  16,
                  { duration: 1.5, animate: true }
                );
              }
            }
          }

          if (window.innerWidth < 768) {
            setShowSidebar(false);
            setViewMode('map');
          }

          if (shouldShowToast) {
            lastToastRef.current = searchHash;

            if (sortedCafes.length === 1) {
              toast.success(`¡Encontrada "${sortedCafes[0].name}"!`, {
                icon: '🎯',
                duration: 2000,
                id: searchHash
              });
            } else {
              toast.success(`Mostrando el más cercano de ${sortedCafes.length} resultados`, {
                icon: '📍',
                duration: 2000,
                id: searchHash
              });
            }
          }
        } else if (shouldShowToast) {
          lastToastRef.current = searchHash;
          toast.error('No se encontraron cafeterías con ese nombre', {
            duration: 2000,
            id: searchHash
          });
        }

        setIsSearchProcessing(false);
      }, 400);

      return () => clearTimeout(resultTimer);
    }, 200);

        return () => clearTimeout(filterTimer);
  }, [debouncedSearchValue, userLocation, mapInstance, sortedCafes.length]);

  // ==============================
  // CALLBACKS
  // ==============================

const navigateToCafe = useCallback((cafeId: number): void => {
  const selectedCafe = cafes.find(cafe => cafe.id === cafeId);
  if (!selectedCafe) return;
  
  if (activeCafe !== cafeId) {
    setActiveCafeData(selectedCafe);
    
    setActiveCafe(cafeId);
  }

  if (window.innerWidth < 768) {
    setShowSidebar(false);
  }

  if (!userLocation) {
    getUserLocation();
    setShouldResetMapOnClose(false);
    return;
  }

  mapInstance?.flyTo(
    [selectedCafe.latitude, selectedCafe.longitude],
    16,
    { duration: 1.5, animate: true }
  );
}, [userLocation, cafes, mapInstance, getUserLocation, activeCafe]);

const startRoute = useCallback((cafeId: number) => {
  if (!userLocation) {
    toast.error("Necesitamos tu ubicación para trazar la ruta");
    getUserLocation();
    return;
  }

  const selectedCafe = cafes.find(cafe => cafe.id === cafeId);
  if (selectedCafe) {
    // Verificar si la cafetería está cerrada
    if (!selectedCafe.isOpen) {
      toast.error("Esta cafetería está cerrada actualmente", {
        icon: '⏰',
        duration: 3000,
      });
      return;
    }

    setTimeout(() => {
      setActiveCafe(null);
    }, 300);

    setTimeout(() => {
      setRouteOrigin(userLocation);
      setRouteDestination([selectedCafe.latitude, selectedCafe.longitude]);
      setActiveCafeData(selectedCafe);
      setShowRouteControls(true);
      
      if (mapInstance) {
        const bounds = L.latLngBounds([
          userLocation,
          [selectedCafe.latitude, selectedCafe.longitude]
        ]);
        mapInstance.fitBounds(bounds, { padding: [50, 50] });
      }
    }, 500);

    toast.success("¡Calculando la mejor ruta para ti!", {
      icon: '🧭',
      duration: 3000,
    });
  }
}, [userLocation, cafes, mapInstance, setRouteOrigin, setRouteDestination, getUserLocation]);

const setupRoute = useCallback((cafeId: number) => {
  if (!userLocation) {
    toast.error("Necesitamos tu ubicación para trazar la ruta");
    getUserLocation();
    return;
  }

  const selectedCafe = cafes.find(cafe => cafe.id === cafeId);
  if (selectedCafe) {
    if (!selectedCafe.isOpen) {
      toast.error("No puedes navegar a una cafetería cerrada", {
        icon: '⏰',
        duration: 3000,
      });
      return;
    }
    
    setActiveCafe(null);
    setIsRouteLoading(true); 
    
    setTimeout(() => {
      setRouteOrigin(userLocation);
      setRouteDestination([selectedCafe.latitude, selectedCafe.longitude]);
      setShowRouteControls(true);
    }, 100);
  }
}, [userLocation, cafes, setRouteOrigin, setRouteDestination, getUserLocation, setIsRouteLoading]);

const copyToClipboard = useCallback((text: string) => {
  navigator.clipboard.writeText(text);
  setCopied(true);
  
  const popoverElement = document.querySelector('.popover-content');
  if (popoverElement) {
    
  }
  
  setTimeout(() => setCopied(false), 2000);
}, []);

const handleCloseRouteControls = useCallback(() => {
  setShowRouteControls(false);
  clearRoute();
}, [clearRoute]);

const handleCloseDetails = useCallback(() => {
  setActiveCafe(null);
  if (shouldResetMapOnClose && !showRouteControls) {
    mapInstance?.setZoom(13, { animate: true });
  }
}, [shouldResetMapOnClose, showRouteControls, mapInstance]);

const clearAllFilters = useCallback(() => {
  resetApiFilters();
  
  setSearchInputValue('');
  setDebouncedSearchValue('');
  setSearchTermLocal('');
  setApiSearchTerm('');
  
  setIsSearchProcessing(false);
  setIsTyping(false);
    lastToastRef.current = '';
  
  if (sortedCafes.length !== cafes.length) {
    if (mapInstance) {
      if (userLocation) {
        mapInstance.setView(userLocation, 13, {
          animate: true,
          duration: 1
        });
      } else {
        mapInstance.setView(defaultCenter, 13, {
          animate: true,
          duration: 1
        });
      }
    }
  }
}, [resetApiFilters, setApiSearchTerm, mapInstance, defaultCenter, userLocation, sortedCafes.length, cafes.length]);

// ==============================
// EFFECTS
// ==============================

useEffect(() => {
  getUserLocation();
}, [getUserLocation]);

useEffect(() => {
  if (activeCafeData && userLocation && showRouteControls) {
    setRouteOrigin(userLocation);
    setRouteDestination([activeCafeData.latitude, activeCafeData.longitude]);
  }
}, [activeCafeData, userLocation, showRouteControls, setRouteOrigin, setRouteDestination]);

useEffect(() => {
  if (activeCafe) {
    setShowSidebar(false);
    setViewMode('map');
  }
}, [activeCafe]);

useEffect(() => {
  if (mapInstance) {
    const map = mapInstance;
    const resizeMap = () => {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    };

    window.addEventListener('resize', resizeMap);
    window.addEventListener('orientationchange', resizeMap);
    
    return () => {
      window.removeEventListener('resize', resizeMap);
      window.removeEventListener('orientationchange', resizeMap);
    };
  }
}, [mapInstance]);

useEffect(() => {
  if (activeCafe) {
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
    if (showRouteControls) {
      setShowRouteControls(false);
    }
  }
  
  if (showRouteControls) {
    setShowSidebar(false);
  }
}, [activeCafe, showRouteControls]);

useEffect(() => {
  if (mapInstance && sortedCafes.length > 0 && sortedCafes.length < cafes.length) {
    if (sortedCafes.length === 1) {
      const onlyCafe = sortedCafes[0];
      mapInstance.flyTo(
        [onlyCafe.latitude, onlyCafe.longitude],
        16,
        { duration: 1.5, animate: true }
      );
    } 
    else if (sortedCafes.length > 1) {
      const bounds = new L.LatLngBounds(
        sortedCafes.map(cafe => [cafe.latitude, cafe.longitude])
      );
            mapInstance.fitBounds(bounds, {
        padding: [50, 50],
        animate: true,
        duration: 1
      });
    }
  }
}, [sortedCafes, cafes.length, mapInstance]);

useEffect(() => {
  if (!mapInstance || !activeCafe) return;
  
  const handleMapClick = (e: L.LeafletMouseEvent) => {
  
    if (window.innerWidth >= 768 && !showRouteControls && activeCafe) {
      setTimeout(() => {
        handleCloseDetails();
      }, 50);
    }
  };
  
  mapInstance.on('click', handleMapClick);
  
  return () => {
    mapInstance.off('click', handleMapClick);
  };
}, [mapInstance, activeCafe, showRouteControls, handleCloseDetails]);

useEffect(() => {
  if (activeCafe) {
    const selectedCafe = cafes.find(cafe => cafe.id === activeCafe);
    if (selectedCafe) {
      setActiveCafeData(selectedCafe);
    }
  } else {
    setActiveCafeData(null);
  }
}, [activeCafe, cafes]);

useEffect(() => {
  if (!mapLoaded || !cafes.length || !mapInstance) return;
  
  const cafeId = searchParams.get('cafeId');
  if (!cafeId) return;
  
  const cafeIdNumber = parseInt(cafeId, 10);
  if (isNaN(cafeIdNumber)) return;
  
  const selectedCafe = cafes.find(cafe => cafe.id === cafeIdNumber);
  if (!selectedCafe) {
    toast.error("La cafetería seleccionada no se encuentra disponible");
    return;
  }
  
  setActiveCafe(cafeIdNumber);
  
  mapInstance.flyTo(
    [selectedCafe.latitude, selectedCafe.longitude],
    16,
    { duration: 1.5, animate: true }
  );
  
}, [cafes, mapInstance, searchParams, setActiveCafe, mapLoaded]); // Añadir mapLoaded a las dependencias

// ==============================
// RENDER FUNCTIONS
// ==============================


// ==============================
// COMPONENT RENDER
// ==============================

return (
  <motion.div
    className={`${isMobile ? 'h-[calc(100vh-64px)]' : 'h-screen'} w-full relative bg-gray-50 font-sans ${
      viewMode === 'list' && window.innerWidth >= 768 ? 'md:grid md:grid-cols-[1fr_390px]' : ''
    }`}
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {/* Loading overlay */}
    <AnimatePresence>
      {!mapLoaded && (
        <motion.div
          className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center"
          exit={{
            opacity: 0,
            transition: { duration: 0.7, ease: "easeInOut" }
          }}
        >
          <LoadingSpinner 
            size="lg" 
            progress={loadingProgress} 
            message={
              loadingProgress < 30 ? "Inicializando mapa..." :
              loadingProgress < 70 ? "Cargando datos de cafeterías..." :
              loadingProgress < 100 ? "Preparando tu experiencia cafetera..." :
              "¡Listo!"
            }
            className="mb-4"
          />
       
        </motion.div>
      )}
    </AnimatePresence>
    <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-white/95 via-white/80 to-white/0 pt-4 pb-12 px-4">
      <div className="flex items-center justify-between">
        {showView ? (<Link
          to="/"
          className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg flex items-center gap-2 hover:bg-white transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-[#6F4E37] group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="pr-2 text-[#6F4E37] font-medium hidden md:inline">Volver</span>
        </Link>):(
          <div></div>
        )}

        <motion.div
          className={`relative transition-all duration-300 ${searchFocused ? 'w-full md:w-96' : 'w-48 md:w-64'}`}
          layout
        >
          <div className="relative">
            <input
              type="text"
              value={searchInputValue} 
              onChange={(e) => {
                setSearchInputValue(e.target.value);
                setIsTyping(true);
              }}
              placeholder={searchInputValue.length < 3 && searchInputValue.length > 0 
                ? "Escribe al menos 3 caracteres..." 
                : "Buscar cafeterías..."}
              className={`w-full h-11 pl-10 pr-12 rounded-full shadow-lg border-none outline-none transition-all duration-300 bg-white border-black/10 ${
                searchInputValue.length < 3 && searchInputValue.length > 0 
                  ? 'focus:ring-2 focus:ring-amber-300' 
                  : 'focus:ring-2 focus:ring-[#D4A76A]'
              }`}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            />
   
            {isTyping || isSearchProcessing ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6F4E37]"
              >
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" cy="12" r="10" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    fill="none" 
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </motion.div>
            ) : (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6F4E37]" size={18} />
            )}
            
         
            {searchInputValue.length > 0 && searchInputValue.length < 3 && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                {searchInputValue.length}/3
              </div>
            )}
          </div>

          <motion.button
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-[#6F4E37] text-white p-1.5 rounded-full hover:bg-[#5d4230] transition-colors duration-300"
            whileTap={{ scale: 0.9 }}
            onClick={toggleFilterModal}
          >
            <Filter size={16} />
          </motion.button>
        </motion.div>

        <div className="hidden md:flex bg-white/90 backdrop-blur-sm rounded-full shadow-lg overflow-hidden">
          <button
            className={`px-4 py-2 transition-colors duration-300 ${viewMode === 'map' ? 'bg-[#6F4E37] text-white' : 'text-[#6F4E37] hover:bg-gray-100'
              }`}
            onClick={() => {
              setViewMode('map');
              setShowSidebar(false); 
            }}
          >
            Mapa
          </button>
          <button
            className={`px-4 py-2 transition-colors duration-300 ${viewMode === 'list' ? 'bg-[#6F4E37] text-white' : 'text-[#6F4E37] hover:bg-gray-100'
              }`}
            onClick={() => {
              setViewMode('list');
              setShowSidebar(true);
            }}
          >
            Lista
          </button>
        </div>
        <div className="w-10 md:hidden"></div> {/* Spacer for mobile layout */}
      </div>
    </div>

    {/* Map Container */}
    <div className={`absolute inset-0 z-10 ${viewMode === 'list' && window.innerWidth >= 768 ? 'md:w-[calc(100%-390px)]' 
  : 'w-full'}`}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <UserMarker position={userLocation} pulsing={true} />
        <SmartClusterGroup
          cafes={sortedCafes} 
          activeCafe={activeCafe} 
          setActiveCafe={setActiveCafe}
          setShowSidebar={setShowSidebar}
        />
        
        {routeOrigin && routeDestination && (
          <DirectRouteLine
            from={routeOrigin}
            to={routeDestination}
            routeCoordinates={routeCoordinates}
            color="#6F4E37" 
            weight={4}
            opacity={0.7}
            transportMode={transportMode}
          />
        )}

        <MapFocus
          cafeId={activeCafe}
          positions={cafePositions}
          userLocation={userLocation}
        />
        <MapController 
          setMapInstance={setMapInstance} 
          setTotalTiles={setTotalTiles}
          setTilesLoaded={setTilesLoaded}
          setLoadingProgress={setLoadingProgress}
          setMapLoaded={setMapLoaded}
        />
      </MapContainer>

      {/* Map controls */}
      <div className="absolute top-24 right-4 z-[400] flex flex-col gap-3 pointer-events-auto">
        <motion.button
          className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => mapInstance?.zoomIn()}
        >
          <span className="text-xl font-bold text-[#6F4E37]">+</span>
        </motion.button>
        <motion.button
          className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => mapInstance?.zoomOut()}
        >
          <span className="text-xl font-bold text-[#6F4E37]">−</span>
        </motion.button>
      </div>

      <motion.button
        className="absolute bottom-36 right-4 z-[999] bg-white rounded-full p-3 shadow-lg pointer-events-auto"
        style={{ 
          position: 'fixed', 
          zIndex: 9999,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={getUserLocation}
        disabled={locatingUser}
      >
        <Navigation size={20} className={`${locatingUser ? 'animate-pulse' : ''} text-[#6F4E37]`} />
      </motion.button>

      <AnimatePresence>
        {apiHasActiveFilters && (
          <motion.div 
            className="absolute top-24 left-4 z-[400] bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg pointer-events-auto flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="filter-indicator"
          >
            <Filter size={16} className="text-[#6F4E37]" />
            <span className="text-sm font-medium text-[#6F4E37]">
              Mostrando {sortedCafes.length} de {cafes.length} cafeterías
            </span>
            <button 
              className="ml-1 text-[#6F4E37] hover:text-[#5d4230] transition-colors"
              onClick={clearAllFilters}
              aria-label="Limpiar filtros"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {apiSearchTerm && sortedCafes.length > 1 && !isSearchProcessing && (
          <motion.button
            className="absolute top-24 left-[285px] z-[400] bg-[#6F4E37] text-white rounded-full px-3 py-2 shadow-lg pointer-events-auto flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => {
              // Adjust map to show all search results
              if (mapInstance && sortedCafes.length > 1) {
                const bounds = new L.LatLngBounds(
                  sortedCafes.map(cafe => [cafe.latitude, cafe.longitude])
                );
                
                // Add padding to bounds
                mapInstance.fitBounds(bounds, {
                  padding: [50, 50],
                  animate: true,
                  duration: 1
                });
              }
              
              // Close any open cafe details
              setActiveCafe(null);
              
              // Show sidebar list on mobile
              if (window.innerWidth < 768) {
                setShowSidebar(true);
              }
            }}
          >
            <MapIcon size={16} />
            <span className="text-sm font-medium">Ver todos</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>    <MapSidebar
      viewMode={viewMode}
      showSidebar={showSidebar}
      sortedCafes={sortedCafes}
      activeCafe={activeCafe}
      favorites={favorites}
      searchTerm={apiSearchTerm}
      filterOptions={apiFilters} 
      totalCafeCount={cafes.length} 
      hasActiveFilters={apiHasActiveFilters}
      setShowSidebar={setShowSidebar}
      setViewMode={setViewMode}
      setActiveCafe={setActiveCafe}
      toggleFavorite={toggleFavorite}
      navigateToCafe={navigateToCafe}
      resetFilters={resetApiFilters}
      updateFilterOptions={updateApiFilters}
    />

    <FilterModal
      isOpen={isFilterModalOpen}
      onClose={toggleFilterModal}
      filterOptions={apiFilters}
      updateFilterOptions={updateApiFilters}
      resetFilters={resetApiFilters}
    />

    {!showSidebar && !activeCafe && window.innerWidth < 768 && (
      <motion.button
        className="absolute bottom-24 right-4 bg-[#6F4E37] rounded-full p-3 shadow-lg pointer-events-auto"
        style={{ 
          position: 'fixed', 
          zIndex: 9999,
        }}
        onClick={() => {
          setShowSidebar(true);
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Coffee size={20} className="text-white" />
      </motion.button>
    )}

    <AnimatePresence>
      {activeCafe && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-[1px] z-[900] cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.preventDefault();
              handleCloseDetails();
            }}
          />
          
          <motion.div
            className="fixed inset-0 z-[950] flex items-end md:items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-full md:w-[90%] lg:w-[80%] xl:w-[1000px] max-h-[90vh] bg-white md:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col pointer-events-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Barra de arrastre con indicador visual */}
              <div className="sticky top-0 w-full flex justify-center py-2 bg-white md:hidden z-10">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>
              
              {/* Wrapper para scroll */}
<div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-hidden bg-[#FBF7F4] rounded-t-3xl md:rounded-3xl">
                {activeCafeData && (
                  <CafeDetail
                    cafe={activeCafeData}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    navigateToCafe={navigateToCafe}
                    startRoute={startRoute}
                    onClose={handleCloseDetails}
                    copyToClipboard={copyToClipboard}
                    copied={copied}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Pulsating indicator on map for selected cafe */}
    {activeCafe && (
      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
        variants={pulseVariants}
        animate="pulse"
      >
        <div className="w-16 h-16 bg-[#6F4E37]/30 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-[#6F4E37]/60 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-[#6F4E37] rounded-full"></div>
          </div>
        </div>
      </motion.div>
    )}

    {/* Route Controls */}
    <AnimatePresence>
      {showRouteControls && activeCafeData && (
        <RouteControls
          isActive={showRouteControls}
          transportMode={transportMode}
          setTransportMode={setTransportMode}
          distance={routeInfo?.distance || null}
          duration={routeInfo?.time || null}
          isCalculating={isRouteLoading}
          onClose={handleCloseRouteControls}
          cafeName={activeCafeData.name}
          origin={routeOrigin}
          destination={routeDestination}
          routeInfo={routeInfo}
        />
      )}
    </AnimatePresence>

    <AnimatePresence>
      {isSearchProcessing && (
        <motion.div
          className="absolute inset-0 bg-black/10 z-[50] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="bg-white/90 backdrop-blur-sm py-2 px-4 rounded-full shadow-lg flex items-center gap-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            <svg className="animate-spin h-4 w-4 text-[#6F4E37]" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" cy="12" r="10" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="none" 
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm font-medium text-[#6F4E37]">Buscando cafeterías...</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);
};

export default MapView;