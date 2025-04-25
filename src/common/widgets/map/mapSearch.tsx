"use client"
import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapSettings from "@/api/mutations/map/mapMutations";
import { CardMapStore } from "../../molecules/auth/stores/cardMapStore";

interface MapSearchProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
}
const MapSearch: React.FC<MapSearchProps> = ({ onLocationSelect, initialLat, 
  initialLng, 
  initialAddress = ""  }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ display_name: string; lat: string; lon: string; address: any }[]>([]);
  const [recentSearches, setRecentSearches] = useState<{ display_name: string; lat: string; lon: string }[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { getCurrentLocation, handleSearch, saveRecentSearch } = MapSettings
  const [initialPositionSet, setInitialPositionSet] = useState(Boolean(initialLat && initialLng));
  // Buscar direcciones con debounce
  const HandleSearch = (searchQuery: string) => {
    handleSearch(searchQuery,
      {
        setSearchQuery,
        setSuggestions,
        setShowSuggestions,
        setIsSearching,
        onLocationSelect,
        searchTimeoutRef
      })
  }

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentMapSearches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
      } catch (e) {
        console.error("Error loading recent searches:", e);
      }
    }
  }, []);


  const SaveRecentSearch = (search: { display_name: string; lat: string; lon: string }) => {
    saveRecentSearch({ display_name: search.display_name, lat: search.lat, lon: search.lon }, { recentSearches, setRecentSearches });
  }

  useEffect(() => {
    if (initialLat && initialLng) {

      setSelectedPosition([initialLat, initialLng]);
      if (initialAddress) {
        setSearchQuery(initialAddress);
      }

      onLocationSelect(initialLat, initialLng, initialAddress || "Selected location");
      setInitialPositionSet(true);
    } else {

      GetCurrenLocation();
    }
  }, [initialLat, initialLng, initialAddress]);

  const GetCurrenLocation = () => {

    if (!initialPositionSet) {
      getCurrentLocation({
        onLocationSelect,
        setCurrentAddress,
        setIsLocating,
        setCurrentPosition,
        setSelectedPosition,
        setSearchQuery,
        setSuggestions,
        setShowSuggestions
      });
    }
  }

 

  // Seleccionar dirección
  const handleSelectAddress = (lat: string, lon: string, name: string) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    setSelectedPosition([latitude, longitude]);
    setSearchQuery(name);
    setSuggestions([]);
    setShowSuggestions(false);
    onLocationSelect(latitude, longitude, name);

    // Save to recent searches
    SaveRecentSearch({ display_name: name, lat, lon });

    // Blur input to hide keyboard on mobile
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  const UseCurrentLocation = () => {
    if (currentPosition && currentAddress) {
      setSelectedPosition(currentPosition);
      setSearchQuery(currentAddress);
      onLocationSelect(currentPosition[0], currentPosition[1], currentAddress);
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      GetCurrenLocation();
    }
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    searchInputRef.current?.focus();
  };

  // Focus handler for search input
  const handleSearchFocus = () => {
    setShowSuggestions(true);
    if (searchQuery.length < 2 && recentSearches.length > 0) {
      setSuggestions([]);
    }
  };

  return (
    <CardMapStore
      mapRef={mapRef}
      isLocating={isLocating}
      isSearching={isSearching}
      searchQuery={searchQuery}
      searchInputRef={searchInputRef}
      recentSearches={recentSearches}
      showSuggestions={showSuggestions}
      selectedPosition={selectedPosition}
      currentPosition={currentPosition}
      suggestions={suggestions}
      clearSearch={clearSearch}
      HandleSearch={HandleSearch}
      setSearchQuery={setSearchQuery}
      handleSearchFocus={handleSearchFocus}
      UseCurrentLocation={UseCurrentLocation}
      setSelectedPosition={setSelectedPosition}
      handleSelectAddress={handleSelectAddress}
      onLocationSelect={onLocationSelect}
    ></CardMapStore>
  );
};

export default MapSearch;