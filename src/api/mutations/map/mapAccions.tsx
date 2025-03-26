import { useRef } from "react";
import MapSettings, { getCurrentLocationProps, recentSearchesProps } from "./mapMutations";



interface handleSelectAddressProps {
    onLocationSelect: (lat: number, lon: number, name: string) => void;
    setSearchQuery: (query: string) => void;
    setSelectedPosition: (position: [number, number] | null) => void;
    setSuggestions: (suggestions: any[]) => void;
    setShowSuggestions: (show: boolean) => void;
    searchInputRef: React.RefObject<HTMLInputElement>;
    resentRecentSearches:  recentSearchesProps;
    
}

export const handleSelectAddress = ({onLocationSelect, setSearchQuery, setSelectedPosition, setShowSuggestions, setSuggestions,searchInputRef, resentRecentSearches}:handleSelectAddressProps,lat: string, lon: string, name: string) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    setSelectedPosition([latitude, longitude]);
    setSearchQuery(name);
    setSuggestions([]);
    setShowSuggestions(false);
    onLocationSelect(latitude, longitude, name);
    
    // Save to recent searches
    MapSettings.saveRecentSearch({ display_name: name, lat, lon }, {recentSearches: resentRecentSearches.recentSearches, setRecentSearches: resentRecentSearches.setRecentSearches});
    
    // Blur input to hide keyboard on mobile
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };


interface useCurrentLocationProps {
    onLocationSelect: (lat: number, lon: number, name: string) => void;
    setSelectedPosition: (position: [number, number] | null) => void;
    setSearchQuery: (query: string) => void;
    setSuggestions: (suggestions: any[]) => void;
    setShowSuggestions: (show: boolean) => void;
    currentPosition: [number, number] | null;
    currentAddress: string;
    getCurrentLocation: getCurrentLocationProps;
}



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
  
  // Clear search input

  interface clearSearchProps {
    setSearchQuery: (query: string) => void;
    setSuggestions: (suggestions: any[]) => void;
    searchInputRef: React.RefObject<HTMLInputElement>;
  }

 export const clearSearch = ({searchInputRef,setSuggestions,setSearchQuery}:clearSearchProps) => {
    setSearchQuery("");
    setSuggestions([]);
    searchInputRef.current?.focus();
  };
  
  // Focus handler for search input
  interface handleSearchFocusProps {
    setShowSuggestions: (show: boolean) => void;
    setSuggestions: (suggestions: any[]) => void;
    searchQuery: string;
    recentSearches: any[];
  }
export const handleSearchFocus = ({setShowSuggestions,searchQuery,recentSearches,setSuggestions}:handleSearchFocusProps) => {
    setShowSuggestions(true);
    if (searchQuery.length < 2 && recentSearches.length > 0) {
      setSuggestions([]);
    }
  };

