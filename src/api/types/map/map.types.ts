
export interface handleSelectAddressProps {
    onLocationSelect: (lat: number, lon: number, name: string) => void;
    setSearchQuery: (query: string) => void;
    setSelectedPosition: (position: [number, number] | null) => void;
    setSuggestions: (suggestions: any[]) => void;
    setShowSuggestions: (show: boolean) => void;
    searchInputRef: React.RefObject<HTMLInputElement>;
    resentRecentSearches:  recentSearchesProps;
}

export interface useCurrentLocationProps {
    onLocationSelect: (lat: number, lon: number, name: string) => void;
    setSelectedPosition: (position: [number, number] | null) => void;
    setSearchQuery: (query: string) => void;
    setSuggestions: (suggestions: any[]) => void;
    setShowSuggestions: (show: boolean) => void;
    currentPosition: [number, number] | null;
    currentAddress: string;
    getCurrentLocation: getCurrentLocationProps;
}

export interface handleSearchFocusProps {
    setShowSuggestions: (show: boolean) => void;
    setSuggestions: (suggestions: any[]) => void;
    searchQuery: string;
    recentSearches: any[];
}

export interface handleSearchProps {
    setSearchQuery: (query: string) => void;
    setSuggestions: (suggestions: any[]) => void;
    setShowSuggestions: (show: boolean) => void;
    setIsSearching: (isSearching: boolean) => void;
    onLocationSelect: (lat: number, lng: number, address: string) => void;
    searchTimeoutRef: React.RefObject<NodeJS.Timeout | null>;
  }
  
  
  export interface MapSearchProps {
    onLocationSelect: (lat: number, lng: number, address: string) => void;
  }
  
  
  export interface getCurrentLocationProps {
    onLocationSelect: (lat: number, lng: number, address: string) => void;
    setIsLocating: (isLocating: boolean) => void;
    setCurrentPosition: (position: [number, number] | null) => void;
    setCurrentAddress: (address: string) => void;
    setSearchQuery: (query: string) => void;
    setSelectedPosition: (position: [number, number] | null) => void;
    setSuggestions: (suggestions: any[]) => void;
    setShowSuggestions: (show: boolean) => void;
  }
  
  export interface recentSearchesProps  {
    recentSearches: { display_name: string; lat: string; lon: string; }[],
    setRecentSearches: (searches: { display_name: string; lat: string; lon: string }[]) => void;
  };