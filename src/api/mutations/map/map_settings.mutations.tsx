import { getCurrentLocationProps, handleSearchProps, recentSearchesProps } from "@/api/types/map/map.types";
import { formatAddress } from "@/common/utils/map/format_address.utils";

const MapSettings = {
  getCurrentLocation: async ({
    onLocationSelect,
    setCurrentAddress,
    setIsLocating,
    setCurrentPosition,
    setSelectedPosition,
    setSearchQuery
  }: getCurrentLocationProps) => {
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCurrentPosition([lat, lng]);
        setSelectedPosition([lat, lng]);

        try {
          const response = await fetch(
            `https://us1.locationiq.com/v1/reverse?key=${import.meta.env.VITE_LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lng}&format=json`
          );
          const data = await response.json();
          const formattedAddress = formatAddress(data);
          setCurrentAddress(formattedAddress);
          setSearchQuery(formattedAddress);
          onLocationSelect(lat, lng, formattedAddress);
        } catch (error) {
          console.error("Error fetching current address:", error);
        }

        setIsLocating(false);
      },
      (err) => {
        console.error("Error obteniendo ubicación actual:", err);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  },

  saveRecentSearch: (search: { display_name: string; lat: string; lon: string }, { recentSearches, setRecentSearches }: recentSearchesProps) => {
    const updatedSearches = [
      search,
      ...(recentSearches as { display_name: string; lat: string; lon: string }[]).filter(item => item.display_name !== search.display_name)
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem('recentMapSearches', JSON.stringify(updatedSearches));
  },

  handleSearch: async (query: string, { setSearchQuery, setShowSuggestions, setSuggestions, setIsSearching, searchTimeoutRef }: handleSearchProps) => {
    setSearchQuery(query);
    setShowSuggestions(true);

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const apiKey = import.meta.env.VITE_LOCATIONIQ_API_KEY;
        const response = await fetch(
          `https://us1.locationiq.com/v1/autocomplete?key=${apiKey}&q=${encodeURIComponent(query)}&limit=5&countrycodes=co&normalizecity=1&accept-language=es`
        );
        const data = await response.json();

        const formattedSuggestions = data.map((item: any) => ({
          ...item,
          display_name: formatAddress(item)
        }));

        setSuggestions(formattedSuggestions);
      } catch (error) {
        console.error("Error searching for address:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }
};

export default MapSettings;
