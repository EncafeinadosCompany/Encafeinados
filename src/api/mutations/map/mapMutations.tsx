import { getCurrentLocationProps, handleSearchProps, recentSearchesProps } from "@/api/types/mapTypes";
import { formatAddress } from "@/common/utils/map/formatAddress";

const MapSettings = {
  getCurrentLocation: async({onLocationSelect, setCurrentAddress, setIsLocating, setCurrentPosition, setSelectedPosition , setSearchQuery}:getCurrentLocationProps) => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCurrentPosition([lat, lng]);
        setSelectedPosition([lat, lng]);       
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&namedetails=1&accept-language=es`,
            {
              headers: {
                'User-Agent': 'EncafeinadosApp/1.0',
                'Accept-Language': 'es'
              }
            }
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
        maximumAge: 0 // Siempre obtener posición fresca
      }
    );
  },

  saveRecentSearch: (search: { display_name: string; lat: string; lon: string },{recentSearches,setRecentSearches}:recentSearchesProps) => {
    const updatedSearches = [
      search,
      ...(recentSearches as { display_name: string; lat: string; lon: string }[]).filter(item => item.display_name !== search.display_name)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentMapSearches', JSON.stringify(updatedSearches));
  },

  handleSearch: async (query: string, {setSearchQuery, setShowSuggestions, setSuggestions,setIsSearching, searchTimeoutRef}:handleSearchProps) => {
    setSearchQuery(query);
    setShowSuggestions(true);
    
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounce
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Preparar la consulta para direcciones colombianas
        let enhancedQuery = query;
        
        // Detectar formato de dirección colombiana (Cra, Calle, Av, etc.)
        const colombianAddressPattern = /^(cra\.?|carrera|calle|cl\.?|av\.?|avenida|diag\.?|diagonal|trans\.?|transversal)\s*\d+\s*[a-z]?\s*#?\s*\d+\s*[a-z]?(-|\s)\d+/i;
        
        if (colombianAddressPattern.test(query)) {
          // Si es una dirección colombiana, añadir Medellín, Colombia para mejorar resultados
          enhancedQuery = `${query}, Medellín, Colombia`;
        } else {
          // Para búsquedas generales, añadir contexto de Colombia
          enhancedQuery = `${query}, Colombia`;
        }
        
        // Primera búsqueda con contexto específico de Medellín
        let response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enhancedQuery)}&addressdetails=1&limit=5&countrycodes=co&namedetails=1&accept-language=es`,
          {
            headers: {
              'User-Agent': 'EncafeinadosApp/1.0',
              'Accept-Language': 'es'
            }
          }
        );
        let data = await response.json();
        
        // Si no hay resultados, intentar con la consulta original sin modificar
        if (data.length === 0) {
          response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=co&namedetails=1&accept-language=es`,
            {
              headers: {
                'User-Agent': 'EncafeinadosApp/1.0',
                'Accept-Language': 'es'
              }
            }
          );
          data = await response.json();
        }
        
        // Si aún no hay resultados, intentar búsqueda estructurada para direcciones colombianas
        if (data.length === 0 && colombianAddressPattern.test(query)) {
          // Extraer componentes de la dirección colombiana
          const addressParts = query.match(colombianAddressPattern);
          if (addressParts) {
            const structuredQuery = {
              street: query,
              city: "Medellín",
              country: "Colombia"
            };
            
            response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&street=${encodeURIComponent(structuredQuery.street)}&city=${encodeURIComponent(structuredQuery.city)}&country=${encodeURIComponent(structuredQuery.country)}&addressdetails=1&limit=5&namedetails=1&accept-language=es`,
              {
                headers: {
                  'User-Agent': 'EncafeinadosApp/1.0',
                  'Accept-Language': 'es'
                }
              }
            );
            data = await response.json();
          }
        }
        
        // Process and format the suggestions
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
    }, 300); // Reduced debounce time for more responsive feel
  }

} 

export default MapSettings;






