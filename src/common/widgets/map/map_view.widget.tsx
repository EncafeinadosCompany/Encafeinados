import React, { useState, useCallback, useMemo, useEffect } from "react";
import { ArrowLeft } from "@/common/ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/common/styles/leaflet-markercluster.css";
import "@/common/styles/mapMarkers.css";
import "@/common/styles/desktopDetails.css";
import toast from "react-hot-toast";

// API imports
import { useApprovedStores } from "@/api/queries/stores/stores.query";
import { useBranchesByStore } from "@/api/queries/stores/stores.query";
import { useBranches } from "@/api/queries/branches/branch.query";

// Hooks personalizados
import { useFavorites } from "@/common/hooks/map/useFavorites";
import { useGeolocation } from "@/common/hooks/map/useGeolocation";
import { useMapData } from "@/common/hooks/map/useMapData";
import { useBranchSearch } from "@/common/hooks/map/useBranchSearch";
import { useRouteNavigation } from "@/common/hooks/map/useRouteNavigation";
import { useMapSearch } from "@/common/hooks/map/useMapSearch";
import { useMapLoading } from "@/common/hooks/map/useMapLoading";
import { useUrlNavigation } from "@/common/hooks/map/useUrlNavigation";
import { useCafeDetails } from "@/common/hooks/map/useCafeDetails";

// Moléculas
import MapFocus from "@/common/molecules/map/map_focus.molecule";
import FilterModal from "@/common/molecules/map/filter_modal.molecule";
import SmartClusterGroup from "@/common/molecules/map/smart_custer_group.molecule";
import UserMarker from "@/common/molecules/map/user_marker.molecule";
import DirectRouteLine from "@/common/molecules/map/direct_route_line.molecule";
import RouteControls from "@/common/molecules/map/route_controls.molecule";
import CafeDetail from "@/common/molecules/map/cafe_detail.molecule";
import MapSidebar from "@/common/molecules/map/map_sidebar.molecule";
import MapController from "@/common/molecules/map/map_controller.molecule";
import MapSearchBar from "@/common/molecules/map/map_search_bar.molecule";
import MapControls from "@/common/molecules/map/map_controls.molecule";
import FilterIndicator from "@/common/molecules/map/filter_indicator.molecule";
import MapLoadingOverlay from "@/common/molecules/map/map_loading_overlay.molecule";

import { containerVariants, pulseVariants } from "./map_animations.widget";

import { Coffee } from "@/common/ui/icons";
import { useAppData } from "@/common/context/app_data.context";

export interface MapViewProps {
  view?: boolean;
}

const MapView: React.FC<MapViewProps> = ({ view: showView }) => {
  const { isMobile } = useAppData();
  const [searchParams] = useSearchParams();

  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [showRouteControls, setShowRouteControls] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedStore, setSelectedStore] = useState<number | undefined>(undefined);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const { mapLoaded, setMapLoaded, tilesLoaded, setTilesLoaded, totalTiles, setTotalTiles, loadingProgress, setLoadingProgress } = useMapLoading();
  const { favorites, toggleFavorite } = useFavorites();
  
  const {
    userLocation,
    locatingUser,
    accuracy,
    errorMessage,
    getUserLocation,
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
    isRouteActive,
  } = useRouteNavigation();

  // API Data fetching
  const { data: branchesData } = useBranches();
  const { data: storesData } = useApprovedStores();
  const { data: filteredBranchesData } = useBranchesByStore(selectedStore);

  // Map data
  const {
    defaultCenter,
    cafes,
    cafePositions,
    sortedCafes: mapDataSortedCafes,
    availableStores,
  } = useMapData(
    branchesData,
    filteredBranchesData,
    userLocation,
    null, 
    storesData
  );

  // API-based search and filter
  const {
    searchTerm: apiSearchTerm,
    setSearchTerm: setApiSearchTerm,
    filterOptions: apiFilters,
    updateFilterOptions: updateApiFilters,
    resetFilters: resetApiFilters,
    hasActiveFilters: apiHasActiveFilters,
    cafes: apiCafes,
    isLoading: apiIsLoading,
  } = useBranchSearch(userLocation || undefined);
  
  const sortedCafes = useMemo(() => {
    if (apiHasActiveFilters) {
      return apiCafes;
    }
    return cafes;
  }, [apiCafes, cafes, apiHasActiveFilters]);

  // Declare state variables that are shared across hooks
  const [activeCafe, setActiveCafe] = useState<number | null>(null);

  const {
    searchInputValue,
    setSearchInputValue,
    isTyping,
    setIsTyping,
    isSearchProcessing,
    searchFocused,
    setSearchFocused,
    searchTerm,
    handleSearchChange,
    clearSearch
  } = useMapSearch(
    mapInstance,
    sortedCafes,
    userLocation,
    setActiveCafe,
    setShowSidebar,
    setViewMode,
    setApiSearchTerm
  );

  const clearAllFilters = useCallback(() => {
    resetApiFilters();
    clearSearch();
    
    if (sortedCafes.length !== cafes.length) {
      if (mapInstance) {
        if (userLocation) {
          mapInstance.setView(userLocation, 13, {
            animate: true,
            duration: 1,
          });
        } else {
          mapInstance.setView(defaultCenter, 13, {
            animate: true,
            duration: 1,
          });
        }
      }
    }
  }, [resetApiFilters, clearSearch, mapInstance, defaultCenter, userLocation, sortedCafes.length, cafes.length]);

  const clearFiltersForNavigation = useCallback(() => {
    resetApiFilters();
    clearSearch();
  }, [resetApiFilters, clearSearch]);
  
  const {
    processedCafeIds,
    setProcessedCafeIds,
    removeCafeIdParam
  } = useUrlNavigation(
    mapLoaded,
    cafes,
    mapInstance,
    activeCafe,
    setActiveCafe,
    apiHasActiveFilters,
    apiCafes,
    clearFiltersForNavigation
  );

  const {
    activeCafeData,
    shouldResetMapOnClose,
    setShouldResetMapOnClose,
    copied,
    handleCloseDetails,
    copyToClipboard
  } = useCafeDetails(
    sortedCafes,
    mapInstance,
    showRouteControls,
    searchParams,
    setProcessedCafeIds,
    activeCafe,
    setActiveCafe
  );

  const toggleFilterModal = useCallback(() => {
    if (activeCafe) {
      setActiveCafe(null);
    }
    setIsFilterModalOpen(!isFilterModalOpen);
  }, [isFilterModalOpen, activeCafe, setActiveCafe]);

  const navigateToCafe = useCallback(
    (cafeId: number): void => {
      const selectedCafe = sortedCafes.find((cafe) => cafe.id === cafeId);
      if (!selectedCafe) return;

      if (activeCafe !== cafeId) {
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

      mapInstance?.flyTo([selectedCafe.latitude, selectedCafe.longitude], 16, {
        duration: 1.5,
        animate: true,
      });
    },
    [userLocation, sortedCafes, mapInstance, getUserLocation, activeCafe, setActiveCafe, setShowSidebar, setShouldResetMapOnClose]
  );

  const startRoute = useCallback(
    (cafeId: number) => {
      if (!userLocation) {
        toast.error("Necesitamos tu ubicación para trazar la ruta");
        getUserLocation();
        return;
      }

      const selectedCafe = sortedCafes.find((cafe) => cafe.id === cafeId);
      if (selectedCafe) {
        if (!selectedCafe.isOpen) {
          toast.error("Esta cafetería está cerrada actualmente", {
            icon: "⏰",
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
          setShowRouteControls(true);

          if (mapInstance) {
            const bounds = L.latLngBounds([
              userLocation,
              [selectedCafe.latitude, selectedCafe.longitude],
            ]);
            mapInstance.fitBounds(bounds, { padding: [50, 50] });
          }
        }, 500);

        toast.success("¡Calculando la mejor ruta para ti!", {
          icon: "🧭",
          duration: 3000,
        });
      }
    },
    [
      userLocation,
      sortedCafes,
      mapInstance,
      setRouteOrigin,
      setRouteDestination,
      setActiveCafe,
      setShowRouteControls,
      getUserLocation,
    ]
  );

  const handleCloseRouteControls = useCallback(() => {
    setShowRouteControls(false);
    clearRoute();
  }, [clearRoute, setShowRouteControls]);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  useEffect(() => {
    if (activeCafeData && userLocation && showRouteControls) {
      setRouteOrigin(userLocation);
      setRouteDestination([activeCafeData.latitude, activeCafeData.longitude]);
    }
  }, [
    activeCafeData,
    userLocation,
    showRouteControls,
    setRouteOrigin,
    setRouteDestination,
  ]);

  useEffect(() => {
    if (mapInstance) {
      const map = mapInstance;
      const resizeMap = () => {
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      };

      window.addEventListener("resize", resizeMap);
      window.addEventListener("orientationchange", resizeMap);

      return () => {
        window.removeEventListener("resize", resizeMap);
        window.removeEventListener("orientationchange", resizeMap);
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
    if (
      mapInstance &&
      sortedCafes.length > 0 &&
      sortedCafes.length < cafes.length
    ) {
      if (sortedCafes.length === 1) {
        const onlyCafe = sortedCafes[0];
        mapInstance.flyTo([onlyCafe.latitude, onlyCafe.longitude], 16, {
          duration: 1.5,
          animate: true,
        });
      } else if (sortedCafes.length > 1) {
        const bounds = new L.LatLngBounds(
          sortedCafes.map((cafe) => [cafe.latitude, cafe.longitude])
        );
        mapInstance.fitBounds(bounds, {
          padding: [50, 50],
          animate: true,
          duration: 1,
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

    mapInstance.on("click", handleMapClick);

    return () => {
      mapInstance.off("click", handleMapClick);
    };
  }, [mapInstance, activeCafe, showRouteControls, handleCloseDetails]);

  // COMPONENT RENDER
  return (
    <motion.div
      className={`${
        isMobile ? "h-[calc(100vh-64px)]" : "h-screen"
      } w-full relative bg-gray-50 font-sans ${
        viewMode === "list" && window.innerWidth >= 768
          ? "md:grid md:grid-cols-[1fr_390px]"
          : ""
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <MapLoadingOverlay 
        mapLoaded={mapLoaded} 
        loadingProgress={loadingProgress} 
        isSearchProcessing={isSearchProcessing} 
      />
      
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-white/95 via-white/80 to-white/0 pt-4 pb-12 px-4">
        <div className="flex items-center justify-between">
          {showView ? (
            <Link
              to="/"
              className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg flex items-center gap-2 hover:bg-white transition-all duration-300 group"
            >
              <ArrowLeft
                size={20}
                className="text-[#6F4E37] group-hover:-translate-x-1 transition-transform duration-300"
              />
              <span className="pr-2 text-[#6F4E37] font-medium hidden md:inline">
                Volver
              </span>
            </Link>
          ) : (
            <div></div>
          )}
          
          <MapSearchBar 
            searchInputValue={searchInputValue}
            setSearchInputValue={setSearchInputValue}
            searchFocused={searchFocused}
            setSearchFocused={setSearchFocused}
            isTyping={isTyping}
            isSearchProcessing={isSearchProcessing}
            toggleFilterModal={toggleFilterModal}
          />
          
          {/* View Mode Switcher */}
          <div className="hidden md:flex bg-white/90 backdrop-blur-sm rounded-full shadow-lg overflow-hidden">
            <button
              className={`px-4 py-2 transition-colors duration-300 ${
                viewMode === "map"
                  ? "bg-[#6F4E37] text-white"
                  : "text-[#6F4E37] hover:bg-gray-100"
              }`}
              onClick={() => {
                setViewMode("map");
                setShowSidebar(false);
              }}
            >
              Mapa
            </button>
            <button
              className={`px-4 py-2 transition-colors duration-300 ${
                viewMode === "list"
                  ? "bg-[#6F4E37] text-white"
                  : "text-[#6F4E37] hover:bg-gray-100"
              }`}
              onClick={() => {
                setViewMode("list");
                setShowSidebar(true);
              }}
            >
              Lista
            </button>
          </div>
          <div className="w-10 md:hidden"></div>
        </div>
      </div>
      
      {/* Map container */}
      <div
        className={`absolute inset-0 z-10 ${
          viewMode === "list" && window.innerWidth >= 768
            ? "md:w-[calc(100%-390px)]"
            : "w-full"
        }`}
      >
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
        <MapControls
          mapInstance={mapInstance}
          getUserLocation={getUserLocation}
          locatingUser={locatingUser}
        />

        {/* Filter indicators */}
        <FilterIndicator
          apiHasActiveFilters={apiHasActiveFilters}
          sortedCafes={sortedCafes}
          cafes={cafes}
          clearAllFilters={clearAllFilters}
          apiSearchTerm={apiSearchTerm}
          isSearchProcessing={isSearchProcessing}
          mapInstance={mapInstance}
          setActiveCafe={setActiveCafe}
          setShowSidebar={setShowSidebar}
        />
      </div>
      
      {/* Sidebar */}
      <MapSidebar
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
      
      {/* Filter modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={toggleFilterModal}
        filterOptions={apiFilters}
        updateFilterOptions={updateApiFilters}
        resetFilters={resetApiFilters}
        hasActiveFilters={apiHasActiveFilters}
        totalResults={sortedCafes.length}
        isLoading={apiIsLoading}
      />
      
      {/* Mobile list button */}
      {!showSidebar && !activeCafe && window.innerWidth < 768 && (
        <motion.button
          className="absolute bottom-24 right-4 bg-[#6F4E37] rounded-full p-3 shadow-lg pointer-events-auto"
          style={{
            position: "fixed",
            zIndex: 10,
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
      
      {/* Cafe detail modal */}
      <AnimatePresence>
        {activeCafe && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-[1px] z-[900] cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDetails}
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
                transition={{ type: "spring", damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 w-full flex justify-center py-2 bg-white md:hidden z-10">
                  <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                </div>

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
      
      {/* Route controls */}
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
    </motion.div>
  );
};

export default MapView;