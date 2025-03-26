import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, MapPin, Navigation, X, Search } from "lucide-react";

// Custom Google-like marker icon
const customIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Blue icon for current location
const currentLocationIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface MapSearchProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

// Component to recenter map when position changes
const MapController = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo(position, 17, { // Increased zoom level for better precision
        animate: true,
        duration: 1.5
      });
    }
  }, [position, map]);
  
  return null;
};

// Format address to be more readable and Google-like
const formatAddress = (addressData: any): string => {
  if (!addressData) return "";
  
  try {
    const address = addressData.address || {};
    
    // Build a more structured address like Google Maps
    const parts = [];
    
    // Street address
    if (address.road) {
      let streetAddress = address.road;
      if (address.house_number) {
        streetAddress += ` #${address.house_number}`;
      }
      parts.push(streetAddress);
    }
    
    // Neighborhood/suburb
    if (address.suburb || address.neighbourhood) {
      parts.push(address.suburb || address.neighbourhood);
    }
    
    // City
    if (address.city || address.town || address.village) {
      parts.push(address.city || address.town || address.village);
    }
    
    // State/province and country
    if (address.state) {
      parts.push(address.state);
    }
    
    if (address.country) {
      parts.push(address.country);
    }
    
    return parts.join(", ");
  } catch (error) {
    console.error("Error formatting address:", error);
    return addressData.display_name || "";
  }
};

const LocationMarker = ({ onLocationSelect }: MapSearchProps) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Obtener ubicación exacta
  useEffect(() => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        await fetchAddress(lat, lng);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error obteniendo ubicación:", err);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Click en el mapa para mover marcador
  useMapEvents({
    click: async (e) => {
      setIsLoading(true);
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      await fetchAddress(lat, lng);
      setIsLoading(false);
    },
  });

  // Obtener dirección desde OpenStreetMap con más detalles
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&namedetails=1`
      );
      const data = await response.json();
      const formattedAddress = formatAddress(data);
      setAddress(formattedAddress);
      onLocationSelect(lat, lng, formattedAddress);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  return position ? (
    <Marker 
      position={position} 
      icon={customIcon} 
      draggable={true}
      eventHandlers={{
        dragend: async (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setPosition([position.lat, position.lng]);
          await fetchAddress(position.lat, position.lng);
        },
      }}
    />
  ) : null;
};

const MapSearch: React.FC<MapSearchProps> = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    { display_name: string; lat: string; lon: string; address: any }[]
  >([]);
  const [recentSearches, setRecentSearches] = useState<
    { display_name: string; lat: string; lon: string }[]
  >([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Save recent searches to localStorage
  const saveRecentSearch = (search: { display_name: string; lat: string; lon: string }) => {
    const updatedSearches = [
      search,
      ...recentSearches.filter(item => item.display_name !== search.display_name)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentMapSearches', JSON.stringify(updatedSearches));
  };

  // Obtener ubicación actual al cargar
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Función para obtener ubicación actual
  const getCurrentLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCurrentPosition([lat, lng]);
        setSelectedPosition([lat, lng]);
        
        // Obtener dirección de la ubicación actual usando API más actual
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
  };


  // Buscar direcciones con debounce
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setShowSuggestions(true);

    if (query.length < 2) {
        setSuggestions([]);
        return;
    }

    // Limpiar timeout previo antes de hacer una nueva búsqueda
    if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true);
        try {
            // Optimización de dirección
            const enhancedQuery = `${query}, Medellín, Colombia`;

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enhancedQuery)}&addressdetails=1&limit=3&countrycodes=co&namedetails=1&accept-language=es&bounded=1&dedupe=1&extratags=1`,
                {
                    headers: {
                        'User-Agent': 'EncafeinadosApp/1.0',
                        'Accept-Language': 'es'
                    }
                }
            );

            if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

            const data = await response.json();

            // Verificar si hay resultados
            if (data.length === 0) {
                console.warn("No se encontraron resultados.");
                setSuggestions([]);
                return;
            }

            // Transformar los resultados para mejorar su formato
            const formattedSuggestions = data.map((item: any) => ({
                lat: item.lat,
                lon: item.lon,
                display_name: formatAddress(item) // <- Usa una función que limpie y formatee bien la dirección
            }));

            setSuggestions(formattedSuggestions);
        } catch (error) {
            console.error("Error buscando dirección:", error);
            setSuggestions([]);
        } finally {
            setIsSearching(false);
        }
    }, 300); // Debounce de 300ms
};
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
    saveRecentSearch({ display_name: name, lat, lon });
    
    // Blur input to hide keyboard on mobile
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  // Usar ubicación actual
  const useCurrentLocation = () => {
    if (currentPosition && currentAddress) {
      setSelectedPosition(currentPosition);
      setSearchQuery(currentAddress);
      onLocationSelect(currentPosition[0], currentPosition[1], currentAddress);
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      getCurrentLocation();
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
    <div className="relative p-4 bg-white rounded-lg shadow-md">
      {/* Buscador con estilo Google Maps */}
      <div className="relative mb-2">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={handleSearchFocus}
          placeholder="Busca una dirección o lugar..."
          className="pl-10 pr-10 w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          {isSearching && (
            <div className="pr-3 flex items-center">
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            </div>
          )}
        </div>
      </div>
      
      {/* Botón de ubicación actual */}
      <button 
        onClick={useCurrentLocation}
        className="mb-3 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <Navigation className="h-4 w-4 mr-1" />
        <span className="text-sm">{isLocating ? "Obteniendo ubicación..." : "Usar mi ubicación actual"}</span>
        {isLocating && <Loader2 className="h-4 w-4 ml-1 animate-spin" />}
      </button>
      
      {/* Sugerencias con mejor estilo */}
      {showSuggestions && (
        <div className="relative bg-white text-yellow-950 w-full left-0 right-0 mx-4 border rounded-lg shadow-lg mt-1 z-10 max-h-80 overflow-auto">
          {/* Recent searches */}
          {searchQuery.length < 2 && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 px-3 py-1">Búsquedas recientes</div>
              {recentSearches.map((item, index) => (
                console.log(item),
                <div
                  key={`recent-${index}`}
                  onClick={() => handleSelectAddress(item.lat, item.lon, item.display_name)}
                  
                    
                  className="p-3 cursor-pointer hover:bg-gray-100 rounded-md flex items-start"
                >
                  <div className="bg-gray-100 rounded-full p-1 mr-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                  </div>
                  <span className="text-sm text-amber-900">{item.display_name}</span>
                </div>
              ))}
              <div className="border-t my-1"></div>
            </div>
          )}
          
          {/* Current suggestions */}
          {suggestions.length > 0 ? (
            suggestions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSelectAddress(item.lat, item.lon, item.display_name)}
                className="p-3 cursor-pointer hover:bg-gray-100 border-b last:border-b-0 flex items-start"
              >
                <div className="bg-gray-100 rounded-full p-1 mr-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                </div>
                <span className="text-sm">{item.display_name}</span>
              </div>
            ))
          ) : searchQuery.length >= 2 && !isSearching ? (
            <div className="p-4 text-center text-gray-500">
              No se encontraron resultados para "{searchQuery}"
            </div>
          ) : null}
          
          {/* Use current location option in suggestions */}
          <div
            onClick={useCurrentLocation}
            className="p-3 cursor-pointer hover:bg-gray-100 border-t flex items-center"
          >
            <div className="bg-blue-100 rounded-full p-1 mr-2">
              <Navigation className="h-4 w-4 text-blue-500" />
            </div>
            <span className="text-sm">Usar mi ubicación actual</span>
          </div>
        </div>
      )}

      {/* Mapa con mejor estilo */}
      <div className="mt-4 h-[200px] w-full rounded-lg overflow-hidden shadow-md border border-gray-300">
        <MapContainer
          center={selectedPosition || currentPosition || [6.2442, -75.5812]} // Default to Bogotá, Colombia
          zoom={selectedPosition || currentPosition ? 17 : 12} // Higher zoom for better precision
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          ref={mapRef}
        >
          {/* Higher quality map tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            maxZoom={19}
          />
           <TileLayer
            url="https://tiles.stadiamaps.com/tiles/stamen_terrain_labels/{z}/{x}/{y}{r}.png"
            attribution="&copy; <a href='https://stadiamaps.com/'>Stadia Maps</a>"
            maxZoom={20}
          />
          <ZoomControl position="bottomright" />
          
          {/* Marker for selected location */}
          {selectedPosition && (
            <Marker 
              position={selectedPosition} 
              icon={customIcon} 
              draggable={true}
              eventHandlers={{
                dragend: async (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  const newPos: [number, number] = [position.lat, position.lng];
                  setSelectedPosition(newPos);
                  
                  // Update address after drag
                  try {
                    const response = await fetch(
                      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=18&addressdetails=1&namedetails=1`
                    );
                    const data = await response.json();
                    const formattedAddress = formatAddress(data);
                    setSearchQuery(formattedAddress);
                    onLocationSelect(position.lat, position.lng, formattedAddress);
                  } catch (error) {
                    console.error("Error fetching address after drag:", error);
                  }
                },
              }}
            />
          )}
          
          {/* Marker for current location (if different from selected) */}
          {currentPosition && selectedPosition && 
           (currentPosition[0] !== selectedPosition[0] || currentPosition[1] !== selectedPosition[1]) && (
            <Marker 
              position={currentPosition} 
              icon={currentLocationIcon}
              title="Mi ubicación actual"
            />
          )}
          
          <MapController position={selectedPosition || currentPosition} />
        </MapContainer>
      </div>
      
      {/* Selected address display */}
      {searchQuery && (
        <div className="mt-3 p-2 bg-gray-50 rounded-md border border-gray-200">
          <div className="text-xs font-medium text-gray-500 mb-1">Dirección seleccionada:</div>
          <div className="text-sm font-medium">{searchQuery}</div>
        </div>
      )}
      
      {/* Instrucciones */}
      <div className="mt-3 text-xs text-gray-600 space-y-1">
        <p className="flex items-center">
          <MapPin className="h-4 w-4 text-red-500 mr-1" />
          <span>Marcador rojo: ubicación seleccionada</span>
        </p>
        {currentPosition && selectedPosition && 
         (currentPosition[0] !== selectedPosition[0] || currentPosition[1] !== selectedPosition[1]) && (
          <p className="flex items-center">
            <MapPin className="h-4 w-4 text-blue-500 mr-1" />
            <span>Marcador azul: tu ubicación actual</span>
          </p>
        )}
        <p>Haz clic en el mapa o arrastra el marcador para ajustar la posición.</p>
      </div>
    </div>
  );
};

export default MapSearch;