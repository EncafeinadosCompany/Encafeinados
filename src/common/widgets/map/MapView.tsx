import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Search, Filter, Coffee, Star, Clock, MapPin, Heart, 
  Share2, Navigation, Route, ExternalLink, Copy, Map as MapIcon, X
} from 'lucide-react'; // Cambiado de @/common/ui/icons a lucide-react
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import '@/common/styles/desktopDetails.css';

//   COMMENTS FOR EACH SECTION ARE NECESSARY IN THIS MODULE BECAUSE I GET LOST :(

// API imports
import { useBranches } from '@/api/queries/stores/branchesQueries';
import { useApprovedStores } from '@/api/queries/stores/storesQueries';

// Types
import { Cafe } from '@/common/types/map/mapTypes';

// Hooks
import { useFavorites } from '@/common/hooks/map/useFavorites';
import { useGeolocation } from '@/common/hooks/map/useGeolocation';
import { useMapData } from '@/common/hooks/map/useMapData';
import { useSearchFilter } from '@/common/hooks/map/useSearchFilter';
import { useRouteNavigation } from '@/common/hooks/map/useRouteNavigation';

// Components
import UserLocationMarker from '@/common/atoms/map/UserLocationMarker';
import MapFocus from '@/common/molecules/map/MapFocus';
import FilterModal from '@/common/molecules/map/filterModal';
import HighlightText from '@/common/atoms/common/HighlightText';
import { Popover, PopoverContent, PopoverTrigger } from "@/common/ui/popover";
import SmartClusterGroup from '@/common/molecules/map/SmartClusterGroup';
import UserMarker from '@/common/molecules/map/UserMarker'; 
import DirectRouteLine from '@/common/molecules/map/DirectRouteLine';
import RouteControls from '@/common/molecules/map/RouteControls';
import '@/common/styles/mapMarkers.css';
import CafeDetail from '@/common/molecules/map/CafeDetail';

// Animations
import { containerVariants, cardVariants, pulseVariants } from './mapAnimations';
import { useBranchesByStore } from '@/api/queries/stores/storesQueries';

// Componente para capturar la instancia del mapa
const MapController: React.FC<{ setMapInstance: (map: L.Map) => void }> = ({ setMapInstance }) => {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      setMapInstance(map);
      
      // Asegurar que los controles personalizados estén por encima del mapa
      setTimeout(() => {
        const mapContainer = map.getContainer();
        const controlContainer = mapContainer.querySelector('.leaflet-control-container') as HTMLElement;
        if (controlContainer) {
          controlContainer.style.zIndex = '400';
        }
        
        // Solución para eventos táctiles: prevenir eventos problemáticos
        function handleTouchMove(e: TouchEvent) {
          // Si el evento tiene múltiples toques (gesto de zoom/pinch)
          if (e.touches.length > 1) {
            e.stopPropagation();
          }
        }
        
        mapContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
        
        return () => {
          mapContainer.removeEventListener('touchmove', handleTouchMove);
        };
      }, 100);
    }
  }, [map, setMapInstance]);
  
  return null;
};

// ==============================
// MAIN COMPONENT
// ==============================

const MapView: React.FC = () => {
  // ==============================
  // STATE MANAGEMENT
  // ==============================
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
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
    activeCafeData,
    availableStores
  } = useMapData(
    branchesData,
    filteredBranchesData,
    userLocation,
    activeCafe,
    storesData
  );

  // ==============================
  // SEARCH AND FILTER
  // ==============================

  const availableTags = useMemo(() => {
    const allTags = cafes.flatMap(cafe => cafe.tags);
    return [...new Set(allTags)];
  }, [cafes]);

  // Usar nuestro nuevo hook para búsqueda y filtrado
  const {
    searchTerm: filterSearchTerm,
    setSearchTerm: setFilterSearchTerm,
    filterOptions,
    updateFilterOptions,
    resetFilters,
    sortedCafes,
    isFilterModalOpen,
    toggleFilterModal
  } = useSearchFilter(cafes);

  useEffect(() => {
    setFilterSearchTerm(searchTerm);
  }, [searchTerm, setFilterSearchTerm]);

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
        setFilterSearchTerm('');
      }
      return;
    }

    setIsSearchProcessing(true);
    setIsTyping(false);

    const currentSearch = debouncedSearchValue.trim();

    const filterTimer = setTimeout(() => {
      setSearchTermLocal(currentSearch);
      setFilterSearchTerm(currentSearch);

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

  // Modificar la función hasActiveFilters para excluir filtros predeterminados
  const hasActiveFilters = useMemo(() => {
    // Verificar si hay un término de búsqueda activo
    const hasSearchTerm = Boolean(searchTerm);
    
    // Verificar si hay filtros personalizados aplicados (excluyendo la ordenación por defecto)
    const hasCustomFilters = Object.entries(filterOptions).some(([key, value]) => {
      // Ignorar el filtro de ordenación por distancia que es el predeterminado
      if (key === 'sortBy' && value === 'distance') return false;
      
      // Ignorar valores por defecto o vacíos
      if (
        (key === 'minRating' && value === 0) ||
        (key === 'maxDistance' && value === 100) ||
        (key === 'selectedTags' && (!value || value.length === 0)) ||
        (key === 'selectedStore' && value === 0) ||
        value === false
      ) {
        return false;
      }
      
      return true;
    });
    
    // Solo mostrar el indicador si hay búsqueda o filtros personalizados
    return hasSearchTerm || hasCustomFilters;
  }, [searchTerm, filterOptions]);

  // ==============================
  // CALLBACKS
  // ==============================

/**
 * Handles sharing cafe location
 */
const handleShare = useCallback((cafe: Cafe) => {
  const googleMapsUrl = `https://maps.google.com/maps?q=${cafe.latitude},${cafe.longitude}&z=17&t=m&hl=es&q=${encodeURIComponent(cafe.name)}`;
  if (navigator.share) {
    navigator.share({
      title: `${cafe.name} - Encafeina2`,
      text: `¡Visita ${cafe.name} en ${cafe.address || 'esta ubicación'}!`,
      url: googleMapsUrl
    }).catch(error => {
      console.log('Error compartiendo', error);
      window.open(googleMapsUrl, '_blank');
    });
  } else {
    window.open(googleMapsUrl, '_blank');
  }
}, []);

/**
 * Starts navigation to a cafe
 */
const navigateToCafe = useCallback((cafeId: number): void => {
  if (activeCafe && activeCafe !== cafeId) {
    setActiveCafe(null);
    setTimeout(() => {
      setActiveCafe(cafeId);
    }, 100);
  } else {
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

  const selectedCafe = cafes.find(cafe => cafe.id === cafeId);
  if (selectedCafe) {
    mapInstance?.flyTo(
      [selectedCafe.latitude, selectedCafe.longitude],
      16,
      { duration: 1.5, animate: true }
    );
  }
}, [userLocation, cafes, setActiveCafe, mapInstance, getUserLocation, activeCafe]);

const setupRoute = useCallback((cafeId: number) => {
  if (!userLocation) {
    toast.error("Necesitamos tu ubicación para trazar la ruta");
    getUserLocation();
    return;
  }

  const selectedCafe = cafes.find(cafe => cafe.id === cafeId);
  if (selectedCafe) {
    setActiveCafe(null);
    setTimeout(() => {
      setRouteOrigin(userLocation);
      setRouteDestination([selectedCafe.latitude, selectedCafe.longitude]);
      setShowRouteControls(true);

      if (mapInstance) {
        const bounds = L.latLngBounds(
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(selectedCafe.latitude, selectedCafe.longitude)
        );
        mapInstance.fitBounds(bounds, { padding: [50, 50] });
      }
    }, 300);
  }
}, [userLocation, cafes, mapInstance, setRouteOrigin, setRouteDestination, getUserLocation]);

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

// Asegurarnos de que clearAllFilters funcione correctamente
const clearAllFilters = useCallback(() => {
  // Limpiar filtros del hook
  resetFilters();
  
  // Restablecer input y búsqueda
  setSearchInputValue('');
  setDebouncedSearchValue('');
  setSearchTermLocal('');
  setFilterSearchTerm('');
  
  // Limpiar estado de procesamiento
  setIsSearchProcessing(false);
  setIsTyping(false);
  
  // Resetear referencia de toast
  lastToastRef.current = '';
  
  // Si estamos mostrando resultados filtrados, volver a mostrar todos
  if (sortedCafes.length !== cafes.length) {
    // Restablecer vista del mapa a una posición que muestre todas las cafeterías
    if (mapInstance) {
      // Si hay ubicación del usuario, centrar ahí
      if (userLocation) {
        mapInstance.setView(userLocation, 13, {
          animate: true,
          duration: 1
        });
      } else {
        // Si no hay ubicación, usar vista predeterminada
        mapInstance.setView(defaultCenter, 13, {
          animate: true,
          duration: 1
        });
      }
    }
  }
}, [resetFilters, setFilterSearchTerm, mapInstance, defaultCenter, userLocation, sortedCafes.length, cafes.length]);

// ==============================
// EFFECTS
// ==============================

// Load map and get user location when component mounts
useEffect(() => {
  const timer = setTimeout(() => {
    setMapLoaded(true);
    getUserLocation();
  }, 800);

  return () => clearTimeout(timer);
}, [getUserLocation]);

// Update route when active cafe changes
useEffect(() => {
  if (activeCafeData && userLocation && showRouteControls) {
    setRouteOrigin(userLocation);
    setRouteDestination([activeCafeData.latitude, activeCafeData.longitude]);
  }
}, [activeCafeData, userLocation, showRouteControls, setRouteOrigin, setRouteDestination]);

useEffect(() => {
  if (activeCafe && window.innerWidth < 768) {
    setShowSidebar(false);
  }
  if (showRouteControls) {
    setShowSidebar(false);
  }
}, [activeCafe, showRouteControls]);

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

// Añade este useEffect para mejorar el flujo de interacción
useEffect(() => {
  // Si estamos mostrando detalles de una cafetería, asegurarnos de que no hay elementos de UI que interfieran
  if (activeCafe) {
    // Cerrar la barra lateral en móvil, pero mantenerla en desktop si está en modo lista
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
    // Si se están mostrando controles de ruta, ocultarlos
    if (showRouteControls) {
      setShowRouteControls(false);
    }
  }
  
  // Si se muestran controles de ruta, ocultar otros elementos de UI que puedan interferir
  if (showRouteControls) {
    setShowSidebar(false);
  }
}, [activeCafe, showRouteControls]);

// Añadir este useEffect para ajustar la vista del mapa cuando cambian los filtros
useEffect(() => {
  // Solo ajustar cuando hay resultados filtrados y son menos que el total
  if (mapInstance && sortedCafes.length > 0 && sortedCafes.length < cafes.length) {
    // Si solo hay un resultado, hacer zoom a ese café
    if (sortedCafes.length === 1) {
      const onlyCafe = sortedCafes[0];
      mapInstance.flyTo(
        [onlyCafe.latitude, onlyCafe.longitude],
        16,
        { duration: 1.5, animate: true }
      );
    } 
    // Con múltiples resultados, ajustar el mapa para mostrarlos todos
    else if (sortedCafes.length > 1) {
      const bounds = new L.LatLngBounds(
        sortedCafes.map(cafe => [cafe.latitude, cafe.longitude])
      );
      
      // Añadir un pequeño padding
      mapInstance.fitBounds(bounds, {
        padding: [50, 50],
        animate: true,
        duration: 1
      });
    }
  }
}, [sortedCafes, cafes.length, mapInstance]);

// ==============================
// RENDER FUNCTIONS
// ==============================

/**
 * Renders a cafe card for the sidebar
 */
const renderCafeCard = (cafe: Cafe, index: number) => (
  <motion.div
    key={cafe.id}
    custom={index}
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    className={`rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${activeCafe === cafe.id ? 'ring-2 ring-[#D4A76A]' : 'ring-1 ring-gray-100'}`}
    onClick={() => setActiveCafe(cafe.id)}
  >
    <div className="relative">
      <img
        src={cafe.image}
        alt={cafe.name}
        className="w-full h-36 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        {cafe.tags.map((tag, i) => (
          <span key={i} className="text-xs font-medium bg-white/90 text-[#6F4E37] px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <motion.button
        className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(cafe.id);
        }}
      >
        <Heart
          size={16}
          className={`${favorites.includes(cafe.id) ? 'fill-red-500 text-red-500' : 'text-[#6F4E37]'}`}
        />
      </motion.button>
    </div>

    <div className="p-4 bg-white">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg text-[#2C1810] line-clamp-1">
          <HighlightText text={cafe.name} highlight={searchTerm} />
        </h3>
        <div className="flex items-center gap-1 text-amber-500">
          <Star size={16} className="fill-amber-500" />
          <span className="font-medium">{cafe.rating}</span>
          <span className="text-xs text-gray-500">({cafe.reviewCount})</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <MapPin size={14} className="text-[#6F4E37]" />
          <span>{cafe.distance}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} className="text-[#6F4E37]" />
          <span>{cafe.openTime}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <motion.button
          className="flex-1 bg-[#6F4E37] text-white py-2 rounded-lg font-medium hover:bg-[#5d4230] transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Ver detalles
        </motion.button>
        <motion.button
          className="w-10 h-10 flex items-center justify-center border border-[#6F4E37] text-[#6F4E37] rounded-lg hover:bg-[#6F4E37] hover:text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            navigateToCafe(cafe.id);
          }}
        >
          <Route size={18} />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// ==============================
// COMPONENT RENDER
// ==============================

return (
  <motion.div
    className={`h-screen w-full relative bg-gray-50 font-sans ${
      viewMode === 'list' && window.innerWidth >= 768 ? 'md:grid md:grid-cols-[1fr_390px]' : ''
    }`}
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {/* Nota: quité overflow-hidden para evitar problemas de scroll */}

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
          <motion.div
            className="w-16 h-16 text-[#6F4E37]"
            animate={{
              rotate: 360,
              transition: { duration: 2, repeat: Infinity, ease: "linear" }
            }}
          >
            <Coffee size={64} />
          </motion.div>
          <motion.p
            className="mt-4 text-[#6F4E37] font-medium"
            animate={{
              opacity: [0.5, 1, 0.5],
              transition: { duration: 1.5, repeat: Infinity }
            }}
          >
            Cargando tu experiencia cafetera...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Header with search and navigation */}
    <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-white/95 via-white/80 to-white/0 pt-4 pb-12 px-4">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg flex items-center gap-2 hover:bg-white transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-[#6F4E37] group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="pr-2 text-[#6F4E37] font-medium hidden md:inline">Volver</span>
        </Link>

        <motion.div
          className={`relative transition-all duration-300 ${searchFocused ? 'w-full md:w-96' : 'w-48 md:w-64'}`}
          layout
        >
          <div className="relative">
            <input
              type="text"
              value={searchInputValue} 
              onChange={(e) => {
                // Actualizar el valor, pero el debounce controlará cuándo se aplica
                setSearchInputValue(e.target.value);
                // Mostrar el estado de "escribiendo"
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
            
            {/* Icono que cambia según el estado */}
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
            
            {/* Mostrar contador de caracteres si está escribiendo y no alcanza el mínimo */}
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
        
        {/* User location marker */}
        <UserMarker position={userLocation} pulsing={true} />
        <SmartClusterGroup
          cafes={sortedCafes} // Cambiamos cafes por sortedCafes (cafés ya filtrados)
          activeCafe={activeCafe} 
          setActiveCafe={setActiveCafe}
          setShowSidebar={setShowSidebar}
        />
        
        {/* Direct route line */}
        {routeOrigin && routeDestination && (
          <DirectRouteLine
            from={routeOrigin}
            to={routeDestination}
            color="#6F4E37"
            weight={4}
            opacity={0.7}
          />
        )}

        {/* Component to manage map focus */}
        <MapFocus
          cafeId={activeCafe}
          positions={cafePositions}
          userLocation={userLocation}
        />

        {/* Map controller to capture map instance */}
        <MapController setMapInstance={setMapInstance} />
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

      {/* User location button - with extremely high z-index */}
      <motion.button
        className="absolute bottom-28 right-4 z-[999] bg-white rounded-full p-3 shadow-lg pointer-events-auto"
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

      {/* Indicator for active filters */}
      <AnimatePresence>
        {hasActiveFilters && (
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

      {/* Button to view all results */}
      <AnimatePresence>
        {searchTerm && sortedCafes.length > 1 && !isSearchProcessing && (
          <motion.button
            className="absolute top-24 left-[285px] z-[400] bg-[#6F4E37] text-white rounded-full px-3 py-2 shadow-lg pointer-events-auto flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => {
              // Ajustar el mapa para mostrar todos los resultados
              if (mapInstance && sortedCafes.length > 1) {
                const bounds = new L.LatLngBounds(
                  sortedCafes.map(cafe => [cafe.latitude, cafe.longitude])
                );
                
                // Añadir un pequeño padding
                mapInstance.fitBounds(bounds, {
                  padding: [50, 50],
                  animate: true,
                  duration: 1
                });
              }
              
              // Cerrar cualquier detalle abierto
              setActiveCafe(null);
              
              // En móvil mostrar la lista de resultados
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
    </div>
    <AnimatePresence>
      {(
        (showSidebar && window.innerWidth < 768) ||
        (viewMode === 'list' && window.innerWidth >= 768)
      ) && (
        <motion.div
          className={`absolute top-0 bottom-0 ${viewMode === 'list' && window.innerWidth >= 768
            ? 'right-0 w-1/2 md:max-w-[390px] xl:max-w-[390px] ' 
            : 'right-0 w-full md:w-96'
            } bg-white z-20 shadow-2xl rounded-l-3xl md:rounded-l-3xl overflow-hidden`}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          <div className="h-full flex flex-col">
            <div className="flex-none p-6 pt-20 md:pt-24 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#2C1810] flex items-center gap-2">
                <Coffee size={20} className="text-[#6F4E37]" />
                <span>Cafeterías cercanas</span>
                {sortedCafes.length > 0 && (
                  <span className="ml-2 bg-gray-100 text-[#6F4E37] text-xs rounded-full px-2 py-1">
                    {sortedCafes.length}
                  </span>
                )}
              </h2>
              <button
                onClick={() => {
                  setShowSidebar(false);
                  // Para dispositivos móviles, también cambiamos el modo de vista
                  if (window.innerWidth < 768) {
                    setViewMode('map');
                  }
                }}
                className="text-[#6F4E37] md:hidden bg-gray-50 rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            </div>

            {/* Cambios para arreglar scroll móvil */}
            <div 
              className="flex-1 h-full overflow-y-auto p-4 pb-32" 
              style={{ 
                WebkitOverflowScrolling: 'touch', 
                touchAction: 'pan-y',
                overscrollBehavior: 'contain',
                height: 'calc(100% - 80px)' // Resta la altura del header
              }}
            >
              {sortedCafes.length > 0 ? (
                <div className="space-y-4 pb-16">
                  {sortedCafes.map((cafe, index) => renderCafeCard(cafe, index))}
                </div>
              ) : (
                <div className="mt-8 text-center">
                  <Coffee size={48} className="mx-auto text-gray-300" />
                  <p className="mt-4 text-gray-500">No se encontraron cafeterías con los filtros actuales</p>
                  <button
                    className="mt-2 text-[#6F4E37] underline"
                    onClick={resetFilters}
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Filter Modal */}
    <FilterModal
      isOpen={isFilterModalOpen}
      onClose={toggleFilterModal}
      filterOptions={filterOptions}
      updateFilterOptions={updateFilterOptions}
      resetFilters={resetFilters}
      availableTags={availableTags}
    />

    {/* Toggle sidebar button (mobile) - increased z-index */}
    {!showSidebar && (
      <motion.button
        className="absolute bottom-16 right-4 z-[100] text-white bg-[#6F4E37] p-3 rounded-full shadow-lg md:hidden"
        onClick={() => setShowSidebar(true)}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Coffee size={20} className="text-white" />
      </motion.button>
    )}

    {/* Selected Cafe Popup/Details */}
    <AnimatePresence>
      {activeCafe && (
        <motion.div
          className="absolute left-0 right-0 bottom-0 md:left-1/2 md:right-auto md:top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:w-[65%] lg:w-[55%] xl:w-[820px] md:h-auto md:max-h-[90vh] bg-white md:rounded-2xl shadow-2xl z-[200] overflow-hidden"
          initial={{ y: "100%", opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: "100%", opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 30 }}
        >
          {activeCafeData && (
            <CafeDetail
              cafe={activeCafeData}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              navigateToCafe={setupRoute}
              onClose={handleCloseDetails}
              copyToClipboard={copyToClipboard}
              copied={copied}
            />
          )}
        </motion.div>
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
        />
      )}
    </AnimatePresence>

    {/* Añadir un overlay de "loading" cuando se está procesando la búsqueda */}
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