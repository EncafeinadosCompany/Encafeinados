import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ArrowLeft, Search, Filter, Coffee, Star, Clock, MapPin, Heart, Share2, Navigation, X, Route } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useBranches } from '../../api/queries/branchesQueries';
import { useStores, useBranchesByStore } from '../../api/queries/storesQueries';
import { Branch, BranchesResponse } from '../../api/types/branchesTypes';
import { Store, StoresResponse } from '../../api/types/storesTypes';

// ==============================
// TYPE DEFINITIONS
// ==============================

/**
 * Geographic coordinates as [latitude, longitude]
 */
type LatLngTuple = [number, number];

/**
 * Marker position with ID
 */
interface MarkerPosition {
  id: number;
  lat: number;
  lng: number;
}

/**
 * Props for MapFocus component
 */
interface MapFocusProps {
  cafeId: number | null;
  positions: Array<{id: number, lat: number, lng: number}>;
  userLocation: LatLngTuple | null;
}

/**
 * Props for UserLocationMarker component
 */
interface UserLocationMarkerProps {
  position: LatLngTuple | null;
  pulsing?: boolean;
}
/**
 * Props for RouteLine component
 */
interface RouteLineProps {
  from: LatLngTuple | null;
  to: LatLngTuple | null;
}

/**
 * Cafe data structure
 */
interface Cafe {
  id: number;
  name: string;
  rating: number;
  reviewCount: number; 
  openTime: string; 
  image: string; 
  tags: string[]; 
  latitude: number;
  longitude: number;
  isOpen: boolean; 
  phone: string;
  address: string;
  distance: string;
  distanceValue: number;
  storeId: number; 
  storeName: string; 
}

/**
 * Animation variants for card animations
 */
interface CardVariants {
  hidden: {
    opacity: number;
    y: number;
  };
  visible: (i: number) => {
    opacity: number;
    y: number;
    transition: {
      delay: number;
      duration: number;
    };
  };
  [key: string]: any;
}

// ==============================
// UTILITY FUNCTIONS
// ==============================

/**
 * Calculates the distance between two geographic points using the Haversine formula
 * @param lat1 Latitude of the first point
 * @param lon1 Longitude of the first point
 * @param lat2 Latitude of the second point
 * @param lon2 Longitude of the second point
 * @returns Distance in kilometers (as a string with 1 decimal place)
 */
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
  const R: number = 6371; // Earth's radius in km
  const dLat: number = (lat2 - lat1) * Math.PI / 180;
  const dLon: number = (lon2 - lon1) * Math.PI / 180;
  const a: number = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance: number = R * c;
  
  return distance.toFixed(1);
};

/**
 * Get saved cafe IDs from localStorage
 * @returns Array of favorite cafe IDs
 */
const getFavoritesFromStorage = (): number[] => {
  const favorites = localStorage.getItem('favoriteCafes');
  return favorites ? JSON.parse(favorites) : [];
};

/**
 * Creates a simulated route between two points
 * @param from Starting coordinates
 * @param to Ending coordinates
 * @returns Array of route coordinates
 */
const simulateRoute = (from: LatLngTuple, to: LatLngTuple): LatLngTuple[] => {
  const numPoints = 5;
  const points: LatLngTuple[] = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const fraction = i / numPoints;
    const lat = from[0] + (to[0] - from[0]) * fraction;
    const lng = from[1] + (to[1] - from[1]) * fraction;
    
    // Add some variation for a more natural route
    const jitter = i > 0 && i < numPoints ? (Math.random() - 0.5) * 0.005 : 0;
    
    points.push([lat + jitter, lng + jitter]);
  }
  
  return points;
};

// ==============================
// ANIMATION VARIANTS
// ==============================

/**
 * Container animation variants
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

/**
 * Card animation variants
 */
const cardVariants: CardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: i * 0.1,
      duration: 0.5
    }
  })
};

/**
 * Pulse animation variants
 */
const pulseVariants = {
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
};

// ==============================
// SUB-COMPONENTS
// ==============================

/**
 * Component to center the map on the selected café or user location
 */
const MapFocus: React.FC<MapFocusProps> = ({ cafeId, positions, userLocation }) => {
  const map = useMap();
  
  useEffect(() => {
    if (cafeId) {
      const position = positions.find(pos => pos.id === cafeId);
      if (position) {
        map.flyTo([position.lat, position.lng], 15, {
          duration: 2
        });
      }
    } else if (userLocation) {
      map.flyTo(userLocation, 15, {
        duration: 2
      });
    }
  }, [cafeId, map, positions, userLocation]);
  
  return null;
};

/**
 * Component to show the user's location on the map
 */
const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({ position, pulsing = false }) => {
  if (!position) return null;
  
  return (
    <Marker 
      position={position}
      icon={L.divIcon({
        className: 'user-location-marker',
        html: `<div class="user-marker ${pulsing ? 'pulsing' : ''}">
                <div class="user-marker-inner"></div>
              </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })}
    />
  );
};

/**
 * Component to draw a route line between two points
 */
const RouteLine: React.FC<RouteLineProps> = ({ from, to }) => {
  const [routePoints, setRoutePoints] = useState<LatLngTuple[]>([]);
  
  useEffect(() => {
    if (!from || !to) return;
    setRoutePoints(simulateRoute(from, to));
  }, [from, to]);
  
  if (!routePoints.length) return null;
  
  return (
    <Polyline 
      positions={routePoints}
      color="#6F4E37"
      weight={4}
      opacity={0.7}
      dashArray="10, 10"
    />
  );
};

// ==============================
// MAIN COMPONENT
// ==============================

export const MapView: React.FC = () => {
  // ==============================
  // STATE MANAGEMENT
  // ==============================
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [activeCafe, setActiveCafe] = useState<number | null>(null);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);
  const [locatingUser, setLocatingUser] = useState<boolean>(false);
  const [showDirections, setShowDirections] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [favorites, setFavorites] = useState<number[]>(getFavoritesFromStorage());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<number | undefined>(undefined);
  
   // ==============================
  // API DATA FETCHING
  // ==============================
  
  const { data: branchesData, isLoading: branchesLoading, error: branchesError } = useBranches();
  
  // Fetch all stores (for filtering)
  const { data: storesData, isLoading: storesLoading } = useStores();
  
  // Fetch branches filtered by store (if a store is selected)
  const { data: filteredBranchesData } = useBranchesByStore(selectedStore);
  
  // ==============================
  // DERIVED STATE / COMPUTED VALUES
  // ==============================
  
  // Center of the map (Medellín by default)
  const defaultCenter: LatLngTuple = [6.2476, -75.5658];

// Map branches from API to our cafe data structure
const cafes: Cafe[] = useMemo(() => {
  if (!branchesData) return [];

  // Determine which branches data to use (filtered or all)
  const branches = filteredBranchesData?.branch || branchesData.branch || [];
  
  return branches.map(branch => {
    // Skip branches with missing location data
    if (!branch.location) return null;
    
    const baseData = {
      id: branch.id,
      name: branch.name,
      rating: branch.average_rating || 4.5, // Default rating if none provided
      reviewCount: Math.floor(Math.random() * 100) + 50, // Random review count (50-150)
      openTime: "7:00 AM - 8:00 PM", // Default opening hours
      image: branch.store?.logo || "https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Use logo or default
      tags: ["Coffee", "Specialty"], // Default tags
      latitude: branch.location.latitude,
      longitude: branch.location.longitude,
      isOpen: branch.status,
      phone: branch.phone_number,
      address: branch.location.address,
      storeId: branch.store_id,
      storeName: branch.store?.name || 'Unknown',
    };
    
    // Calculate distance if user location is available
    if (userLocation) {
      const distanceKm = calculateDistance(
        userLocation[0], userLocation[1], 
        branch.location.latitude, branch.location.longitude
      );
      return {
        ...baseData,
        distance: `${distanceKm} km`,
        distanceValue: parseFloat(distanceKm)
      };
    }
    
    // Default distance when user location is not available
    return {
      ...baseData,
      distance: "Unknown distance",
      distanceValue: 999 // High value to sort to the end
    };
  }).filter(Boolean) as Cafe[]; // Filter out null values and type cast
}, [branchesData, filteredBranchesData, userLocation]);

  // Create marker positions from cafe data
  const cafePositions = useMemo(() => 
    cafes.map(cafe => ({
      id: cafe.id,
      lat: cafe.latitude,
      lng: cafe.longitude
    })), 
  [cafes]);

  const filteredCafes = useMemo(() => {
    if (!searchTerm) return cafes;
    
    const lowerSearch = searchTerm.toLowerCase();
    return cafes.filter(cafe => 
      cafe.name.toLowerCase().includes(lowerSearch) || 
      cafe.address.toLowerCase().includes(lowerSearch) ||
      cafe.storeName.toLowerCase().includes(lowerSearch)
    );
  }, [cafes, searchTerm]);
  
  // Sort cafes by distance
  const sortedCafes = useMemo(() => 
    [...filteredCafes].sort((a, b) => a.distanceValue - b.distanceValue), 
  [filteredCafes]);
  
  // Get data for the currently active cafe
  const activeCafeData = useMemo(() => 
    activeCafe ? cafes.find(cafe => cafe.id === activeCafe) : null,
  [activeCafe, cafes]);
  
  // Extract available stores for the filter
  const availableStores = useMemo(() => {
    if (!storesData?.stores?.store) return [];
    
    return storesData.stores.store.map(store => ({
      id: store.id,
      name: store.name
    }));
  }, [storesData]);
  
  
  // Custom marker icon
  const customIcon = useMemo(() => new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  }), []);
  
  // ==============================
  // CALLBACKS
  // ==============================
  
  /**
   * Gets the user's current geolocation
   */
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");
      return;
    }
    
    setLocatingUser(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        if (mapInstance) {
          mapInstance.flyTo([latitude, longitude], 15);
        }
        setLocatingUser(false);
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
        alert("No pudimos obtener tu ubicación. Por favor, verifica los permisos de ubicación.");
        setLocatingUser(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }, [mapInstance]);
  
  /**
   * Toggles the favorite status of a cafe
   */
  const toggleFavorite = useCallback((cafeId: number): void => {
    const newFavorites: number[] = favorites.includes(cafeId)
      ? favorites.filter((id: number) => id !== cafeId)
      : [...favorites, cafeId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteCafes', JSON.stringify(newFavorites));
  }, [favorites]);
  
  /**
   * Starts navigation to a cafe
   */
  const navigateToCafe = useCallback((cafeId: number): void => {
    if (!userLocation) {
      getUserLocation();
      return;
    }
    
    setActiveCafe(cafeId);
    setShowDirections(true);
  }, [getUserLocation, userLocation]);
  
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
  
  // ==============================
  // DERIVED STATE / COMPUTED VALUES
  // ==============================
  
  // Generate cafe data with dynamically calculated distances
 

  
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
          <h3 className="font-bold text-lg text-[#2C1810] line-clamp-1">{cafe.name}</h3>
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
  
  /**
   * Renders the cafe detail popup/sheet
   */
  const renderCafeDetail = (cafe: Cafe) => (
    <div key={cafe.id} className="relative">
      <div className="relative h-48 w-full">
        <img 
          src={cafe.image} 
          alt={cafe.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <button 
          onClick={() => setActiveCafe(null)}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md"
        >
          <ArrowLeft size={20} className="text-[#6F4E37] transform rotate-45" />
        </button>
        
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="font-bold text-2xl text-white">{cafe.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={18} className="fill-amber-400" />
              <span className="font-medium text-white">{cafe.rating}</span>
              <span className="text-sm text-white/80">({cafe.reviewCount} reseñas)</span>
            </div>
            <motion.button
              className="bg-white/20 backdrop-blur-sm p-1.5 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(cafe.id);
              }}
            >
              <Heart 
                size={18} 
                className={`${favorites.includes(cafe.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} 
              />
            </motion.button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-[#6F4E37]">
            <Clock size={18} />
            <span className="font-medium">{cafe.openTime}</span>
            <span className="text-xs py-0.5 px-2 bg-green-50 text-green-600 rounded-full font-medium">
              {cafe.isOpen ? 'Abierto ahora' : 'Cerrado'}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-[#6F4E37]">
            <MapPin size={18} />
            <span className="font-medium">{cafe.distance} de distancia</span>
          </div>
          <motion.button 
            className="text-[#6F4E37] bg-[#FAF3E0] p-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateToCafe(cafe.id)}
          >
            <Navigation size={18} />
          </motion.button>
        </div>
        
        <div className="py-3">
          <h4 className="font-medium text-[#2C1810] mb-2">Características</h4>
          <div className="flex flex-wrap gap-2">
            {cafe.tags.map((tag, i) => (
              <span key={i} className="text-sm font-medium bg-gray-50 text-[#6F4E37] px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
            <span className="text-sm font-medium bg-gray-50 text-[#6F4E37] px-3 py-1 rounded-full">
              Wi-Fi
            </span>
            <span className="text-sm font-medium bg-gray-50 text-[#6F4E37] px-3 py-1 rounded-full">
              Terraza
            </span>
          </div>
        </div>
        
        <div className="flex gap-3 py-4">
          <motion.button 
            className="flex-1 bg-[#6F4E37] text-white py-3 rounded-xl font-medium hover:bg-[#5d4230] transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Coffee size={18} />
            <span>Ver menú</span>
          </motion.button>
          <motion.button 
            className="w-12 h-12 flex items-center justify-center border border-[#6F4E37] text-[#6F4E37] rounded-xl hover:bg-[#6F4E37] hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
  
  // ==============================
  // COMPONENT RENDER
  // ==============================
  
  return (
    <motion.div 
      className="h-screen w-full relative bg-gray-50 overflow-hidden font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* CSS styles for user marker */}
      <style>{`
        .user-marker {
          width: 24px;
          height: 24px;
          background-color: rgba(111, 78, 55, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .user-marker.pulsing {
          animation: pulse 2s infinite;
        }
        
        .user-marker-inner {
          width: 12px;
          height: 12px;
          background-color: #6F4E37;
          border-radius: 50%;
          border: 2px solid white;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(111, 78, 55, 0.5);
          }
          
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(111, 78, 55, 0);
          }
          
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(111, 78, 55, 0);
          }
        }
      `}</style>
      
      {/* Loading overlay for map or API data */}
      <AnimatePresence>
        {(!mapLoaded || branchesLoading) && (
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
              {branchesLoading ? "Buscando cafeterías cercanas..." : "Cargando tu experiencia cafetera..."}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error message if API fails */}
      {branchesError && (
        <div className="absolute inset-0 bg-white/90 z-50 flex flex-col items-center justify-center p-6 text-center">
          <X size={48} className="text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-[#2C1810] mb-2">No pudimos cargar las cafeterías</h3>
          <p className="text-gray-600 mb-6">Hubo un problema al conectar con nuestro servidor. Por favor intenta nuevamente.</p>
          <button 
            className="bg-[#6F4E37] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#5d4230]"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      )}
      
      {/* Header with search and navigation */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-white/90 to-white/0 pt-4 pb-8 px-4">
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
            <input 
              type="text" 
              placeholder="Buscar cafeterías..." 
              className="w-full h-11 pl-10 pr-12 rounded-full shadow-lg border-none outline-none focus:ring-2 focus:ring-[#D4A76A] transition-all duration-300"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6F4E37]" size={18} />
            <motion.button 
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-[#6F4E37] text-white p-1.5 rounded-full hover:bg-[#5d4230] transition-colors duration-300"
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                // Show filter dropdown or modal
                // You can implement a filter component for stores here
              }}
            >
              <Filter size={16} />
            </motion.button>
          </motion.div>
          
          {/* Store filter dropdown */}
          {availableStores.length > 0 && (
            <div className="hidden md:block relative ml-2">
              <select
                className="h-11 pl-4 pr-8 rounded-full shadow-lg border-none outline-none focus:ring-2 focus:ring-[#D4A76A] bg-white"
                value={selectedStore || ''}
                onChange={(e) => setSelectedStore(e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">Todas las tiendas</option>
                {availableStores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Coffee size={16} className="text-[#6F4E37]" />
              </div>
            </div>
          )}
          
          {/* View toggle buttons */}
          <div className="hidden md:flex bg-white/90 backdrop-blur-sm rounded-full shadow-lg overflow-hidden">
            <button 
              className={`px-4 py-2 transition-colors duration-300 ${
                viewMode === 'map' ? 'bg-[#6F4E37] text-white' : 'text-[#6F4E37] hover:bg-gray-100'
              }`}
              onClick={() => setViewMode('map')}
            >
              Mapa
            </button>
            <button 
              className={`px-4 py-2 transition-colors duration-300 ${
                viewMode === 'list' ? 'bg-[#6F4E37] text-white' : 'text-[#6F4E37] hover:bg-gray-100'
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
      <div className={`absolute inset-0 z-10 ${viewMode === 'list' && window.innerWidth >= 768 ? 'md:w-1/2' : 'w-full'}`}>
        <MapContainer 
          center={defaultCenter}
          zoom={14} 
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
          className="z-10"
          ref={(map: L.Map | null) => {
            if (map) setMapInstance(map);
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User location marker */}
          <UserLocationMarker position={userLocation} pulsing={true} />
          
          {/* Cafe markers from API data */}
          {cafePositions.map(position => (
            <Marker 
              key={position.id} 
              position={[position.lat, position.lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => {
                  setActiveCafe(position.id);
                  if (window.innerWidth >= 768) {
                    setShowSidebar(true);
                  }
                },
              }}
            >
              <Popup className="cafe-popup">
                <div className="p-1">
                  <p className="font-bold text-[#2C1810]">{cafes.find(cafe => cafe.id === position.id)?.name}</p>
                  <p className="text-sm text-gray-600">{cafes.find(cafe => cafe.id === position.id)?.distance}</p>
                  <button 
                    className="mt-2 w-full bg-[#6F4E37] text-white text-sm py-1 rounded"
                    onClick={() => navigateToCafe(position.id)}
                  >
                    Cómo llegar
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Route line between user location and selected cafe */}
          {showDirections && userLocation && activeCafeData && (
            <RouteLine 
              from={userLocation} 
              to={[activeCafeData.latitude, activeCafeData.longitude]} 
            />
          )}
          
          {/* Component to manage map focus */}
          <MapFocus 
            cafeId={activeCafe} 
            positions={cafePositions} 
            userLocation={userLocation} 
          />
        </MapContainer>
        
        {/* Map controls */}
        <div className="absolute top-24 right-4 z-30 flex flex-col gap-3">
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
        
        {/* User location button */}
        <motion.button 
          className="absolute bottom-28 right-4 z-30 bg-white rounded-full p-3 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={getUserLocation}
          disabled={locatingUser}
        >
          <Navigation size={20} className={`${locatingUser ? 'animate-pulse' : ''} text-[#6F4E37]`} />
        </motion.button>
      </div>
      
      {/* Sidebar with cafe list */}
      <AnimatePresence>
        {(showSidebar || (viewMode === 'list' && window.innerWidth >= 768)) && (
          <motion.div 
            className={`absolute top-0 bottom-0 ${viewMode === 'list' && window.innerWidth >= 768 ? 'right-0 w-1/2 md:block' : 'right-0 w-full md:w-96'} bg-white z-20 shadow-2xl rounded-l-3xl md:rounded-l-3xl overflow-hidden`}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="h-full flex flex-col">
              <div className="p-6 pt-20 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-xl font-bold text-[#2C1810] flex items-center gap-2">
                  <Coffee size={20} className="text-[#6F4E37]" />
                  <span>
                    {sortedCafes.length === 0 
                      ? "No hay cafeterías disponibles" 
                      : `${sortedCafes.length} cafeterías ${selectedStore ? 'filtradas' : 'cercanas'}`}
                  </span>
                </h2>
                <button 
                  onClick={() => setShowSidebar(false)}
                  className="text-[#6F4E37] md:hidden bg-gray-50 rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 pb-32">
                {sortedCafes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <Coffee size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">No encontramos cafeterías</h3>
                    <p className="text-gray-400 mt-2">
                      {searchTerm 
                        ? "Intenta con otra búsqueda o elimina los filtros" 
                        : "No hay cafeterías disponibles en esta zona"}
                    </p>
                    {(searchTerm || selectedStore) && (
                      <button 
                        className="mt-4 bg-[#6F4E37] text-white px-4 py-2 rounded-lg"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedStore(undefined);
                        }}
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </div>
                ) : (
                  <motion.div className="space-y-4">
                    {sortedCafes.map((cafe, index) => renderCafeCard(cafe, index))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* The rest of your component remains the same */}
    </motion.div>
  );
};