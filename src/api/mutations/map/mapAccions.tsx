import { handleSearchFocusProps, handleSelectAddressProps, useCurrentLocationProps } from "@/api/types/mapTypes";
import MapSettings  from "./mapMutations";

export const handleSelectAddress = ({onLocationSelect, setSearchQuery, setSelectedPosition, setShowSuggestions, setSuggestions,searchInputRef, resentRecentSearches}:handleSelectAddressProps,lat: string, lon: string, name: string) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    setSelectedPosition([latitude, longitude]);
    setSearchQuery(name);
    setSuggestions([]);
    setShowSuggestions(false);
    onLocationSelect(latitude, longitude, name);
    MapSettings.saveRecentSearch({ display_name: name, lat, lon }, {recentSearches: resentRecentSearches.recentSearches, setRecentSearches: resentRecentSearches.setRecentSearches});
    
    // Blur input to hide keyboard on mobile
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };


export const useCurrentLocation = ({ currentAddress, currentPosition,onLocationSelect,setSelectedPosition, setSearchQuery, setShowSuggestions, setSuggestions, getCurrentLocation}:useCurrentLocationProps) => {
    if (currentPosition && currentAddress) {
      setSelectedPosition(currentPosition);
      setSearchQuery(currentAddress);
      onLocationSelect(currentPosition[0], currentPosition[1], currentAddress);
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      MapSettings.getCurrentLocation(getCurrentLocation);
    }
  };
  
  // Focus handler for search input

export const handleSearchFocus = ({setShowSuggestions,searchQuery,recentSearches,setSuggestions}:handleSearchFocusProps) => {
    setShowSuggestions(true);
    if (searchQuery.length < 2 && recentSearches.length > 0) {
      setSuggestions([]);
    }
  };

