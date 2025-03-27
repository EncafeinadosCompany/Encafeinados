import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Coffee, Star, Clock, MapPin, Heart, Share2, Navigation, X, Route } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

//   COMMENTS FOR EACH SECTION ARE NECESSARY IN THIS MODULE BECAUSE I GET LOST :(

// API imports
import { useBranches } from '@/api/queries/branchesQueries';
import { useStores, useBranchesByStore } from '@/api/queries/storesQueries';
// Types
import { LatLngTuple, Cafe } from '@/common/types/map/mapTypes';

// Utils
import { calculateDistance } from '@/common/utils/map/mapUtils';

// Hooks
import { useFavorites } from '@/common/hooks/map/useFavorites';
import { useGeolocation } from '@/common/hooks/map/useGeolocation';
import { useMapData } from '@/common/hooks/map/useMapData';

// Components
import UserLocationMarker from '@/common/atoms/map/UserLocationMarker';
import MapFocus from '@/common/molecules/map/MapFocus';
import RouteLine from '@/common/molecules/map/RouteLine';

// Animations
import { containerVariants, cardVariants, pulseVariants } from './mapAnimations';

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
  const [showDirections, setShowDirections] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<number | undefined>(undefined);

  // Custom hooks
  const { favorites, toggleFavorite } = useFavorites();
  const { 
    userLocation, 
    locatingUser, 
    accuracy,
    errorMessage,
    getUserLocation 
  } = useGeolocation(mapInstance);

  // ==============================
  // API DATA FETCHING
  // ==============================
  const { data: branchesData, isLoading: branchesLoading, error: branchesError } = useBranches();
  const { data: storesData, isLoading: storesLoading } = useStores();
  const { data: filteredBranchesData } = useBranchesByStore(selectedStore);

  // ==============================
  // DERIVED STATE / COMPUTED VALUES 
  // ==============================
  const {
    defaultCenter,
    cafes,
    cafePositions,
    filteredCafes,
    sortedCafes,
    activeCafeData,
    availableStores,
    customIcon
  } = useMapData(
    branchesData,
    filteredBranchesData,
    userLocation,
    activeCafe,
    searchTerm,
    storesData
  );


  // ==============================
  // CALLBACKS
  // ==============================


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
              className="w-full h-11 pl-10 pr-12 rounded-full shadow-lg border-none outline-none focus:ring-2 focus:ring-[#D4A76A] transition-all duration-300 bg-white border-black/10"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6F4E37]" size={18} />
            <motion.button
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-[#6F4E37] text-white p-1.5 rounded-full hover:bg-[#5d4230] transition-colors duration-300"
              whileTap={{ scale: 0.9 }}
            >
              <Filter size={16} />
            </motion.button>
          </motion.div>

          {/* View toggle buttons */}
          {/* View toggle buttons */}
          <div className="hidden md:flex bg-white/90 backdrop-blur-sm rounded-full shadow-lg overflow-hidden">
            <button
              className={`px-4 py-2 transition-colors duration-300 ${viewMode === 'map' ? 'bg-[#6F4E37] text-white' : 'text-[#6F4E37] hover:bg-gray-100'
                }`}
              onClick={() => {
                setViewMode('map');
                setShowSidebar(false); // Añadir esta línea para ocultar la barra lateral
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

          {/* Cafe markers */}
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


        {/* Para mostrar errores de ubicación (opcional) */}
        {errorMessage && (
          <div className="absolute bottom-44 right-4 left-4 md:left-auto md:w-72 z-30 bg-red-50 text-red-700 p-3 rounded-lg shadow-lg">
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}
      </div>

      {/* Sidebar with cafe list */}
      <AnimatePresence>
        {/* Mostrar sidebar si: 
            1. Es modo móvil y showSidebar es true, O
            2. Es modo escritorio y viewMode es 'list' 
        */}
        {(
          (showSidebar && window.innerWidth < 768) ||
          (viewMode === 'list' && window.innerWidth >= 768)
        ) && (
            <motion.div
              className={`absolute top-0 bottom-0 ${viewMode === 'list' && window.innerWidth >= 768
                  ? 'right-0 w-1/2'
                  : 'right-0 w-full md:w-96'
                } bg-white z-20 shadow-2xl rounded-l-3xl md:rounded-l-3xl overflow-hidden`}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="h-full flex flex-col">
                <div className="p-6 pt-20 flex justify-between items-center border-b border-gray-100">
                  <h2 className="text-xl font-bold text-[#2C1810] flex items-center gap-2">
                    <Coffee size={20} className="text-[#6F4E37]" />
                    <span>Cafeterías cercanas</span>
                  </h2>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="text-[#6F4E37] md:hidden bg-gray-50 rounded-full p-2 hover:bg-gray-100 transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 pb-32">
                  <motion.div className="space-y-4">
                    {sortedCafes.map((cafe, index) => renderCafeCard(cafe, index))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Toggle sidebar button (mobile) */}
      {!showSidebar && (
        <motion.button
          className="absolute bottom-6 right-6 z-30 bg-[#6F4E37] text-white p-4 rounded-full shadow-xl md:hidden"
          onClick={() => setShowSidebar(true)}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.1, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          whileTap={{ scale: 0.9 }}
        >
          <Coffee size={24} />
        </motion.button>
      )}

      {/* Selected Cafe Popup/Details */}
      <AnimatePresence>
        {activeCafe && (
          <motion.div
            className="absolute md:left-1/2 md:right-auto md:top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 left-0 right-0 bottom-0 md:w-96 md:h-auto bg-white md:rounded-2xl shadow-2xl z-40 overflow-hidden"
            initial={{ y: "100%", opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 30 }}
          >
            {activeCafeData && renderCafeDetail(activeCafeData)}
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
    </motion.div>
  );
};