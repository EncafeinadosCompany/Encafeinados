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
    const parts = new Set<string>();

    // 📍 Dirección exacta en formato colombiano
    if (address.road) {
      let streetAddress = address.road;
      
      // Formato colombiano: Calle/Carrera/Avenida + número
      if (address.house_number) {
        // Detectar formato colombiano y asegurar consistencia
        const isColombianStreet = /^(calle|carrera|avenida|diagonal|transversal|circular|autopista)/i.test(streetAddress);
        
        if (isColombianStreet) {
          // Normalizar formato para calles colombianas
          const streetType = streetAddress.match(/^(calle|carrera|avenida|diagonal|transversal|circular|autopista)/i)?.[0] || '';
          const streetRest = streetAddress.replace(/^(calle|carrera|avenida|diagonal|transversal|circular|autopista)/i, '').trim();
          
          // Formatear según convención: "Calle 10 # 43-15"
          streetAddress = `${streetType.charAt(0).toUpperCase() + streetType.slice(1).toLowerCase()} ${streetRest}`;
          streetAddress += ` # ${address.house_number}`;
          
          // Agregar complemento si existe
          if (address.unit || address.door || address.floor) {
            streetAddress += ` ${address.unit || address.door || address.floor}`;
          }
        } else {
          // Formato estándar para otras vías
          streetAddress += ` #${address.house_number}`;
        }
      }
      parts.add(streetAddress);
    }

    // 📌 Zona residencial, conjunto o urbanización (común en Colombia)
    if (address.residential || address.hamlet || address.place) {
      parts.add(address.residential || address.hamlet || address.place);
    }

    // 🏙 Barrio (muy importante en Colombia)
    if (address.suburb || address.neighbourhood) {
      parts.add(address.suburb || address.neighbourhood);
    }
    
    // Localidad o comuna (específico de ciudades colombianas grandes)
    if (address.borough || address.quarter || address.city_district) {
      parts.add(address.borough || address.quarter || address.city_district);
    }

    // 🏛 Ciudad o municipio - asegurar que Medellín tenga tilde
    if (address.city || address.town || address.village || address.municipality) {
      let cityName = address.city || address.town || address.village || address.municipality;
      // Asegurar que Medellín tenga tilde
      if (cityName.toLowerCase() === 'medellin') {
        cityName = 'Medellín';
      }
      parts.add(cityName);
    }

    // 🌎 Departamento - asegurar que Antioquia esté bien escrito
    if (address.state || address.region) {
      let stateName = address.state || address.region;
      // Normalizar Antioquia
      if (stateName.toLowerCase() === 'antioquia') {
        stateName = 'Antioquia';
      }
      parts.add(stateName);
    }
    
    // Agregar "Colombia" si no está ya incluido y estamos en Colombia
    if ((address.country === "Colombia" || address.country_code === "co") && !parts.has("Colombia")) {
      parts.add("Colombia");
    }

    // ❌ Eliminar duplicados y formatear
    const formattedAddress = Array.from(parts).join(", ");

    // 🔹 Si la dirección es muy corta o no tiene sentido, usar alternativas
    if (formattedAddress.length < 10 || parts.size < 2) {
      // Opción 1: Usar nombre de visualización limpio
      const cleanDisplayName = addressData.display_name
        ?.replace(/,\s*Colombia$/, ", Colombia")
        ?.replace(/,\s*,/g, ",")
        ?.replace(/medellin/i, "Medellín")
        ?.replace(/antioquia/i, "Antioquia");
      
      // Opción 2: Construir una dirección simplificada
      const simplifiedAddress = [
        address.road,
        address.suburb || address.neighbourhood,
        "Medellín",
        "Colombia"
      ].filter(Boolean).join(", ");
      
      return cleanDisplayName || simplifiedAddress || "Dirección no disponible";
    }
    
    return formattedAddress;
  } catch (error) {
    console.error("Error formateando dirección:", error);
    // Fallback: intentar usar display_name limpio
    const cleanDisplayName = addressData.display_name
      ?.replace(/,\s*Colombia$/, ", Colombia")
      ?.replace(/,\s*,/g, ",")
      ?.replace(/medellin/i, "Medellín")
      ?.replace(/antioquia/i, "Antioquia");
    return cleanDisplayName || "Dirección no disponible";
  }
};
  
const normalizeColombianAddress = (query: string): string => {
  // Normaliza abreviaturas comunes
  return query
    .replace(/\bcl\.?\b/i, "calle")
    .replace(/\bcra\.?\b/i, "carrera")
    .replace(/\bcr\.?\b/i, "carrera")
    .replace(/\bav\.?\b/i, "avenida")
    .replace(/\bdiag\.?\b/i, "diagonal")
    .replace(/\btrans\.?\b/i, "transversal")
    .replace(/\bcir\.?\b/i, "circular")
    // Normalizar el símbolo "#" y espacios alrededor
    .replace(/\s*#\s*/g, " # ")
    // Normalizar guiones "-" y espacios alrededor
    .replace(/\s*-\s*/g, "-")
    // Normalizar espacios múltiples
    .replace(/\s+/g, " ")
    .trim();
};

// Función para parsear direcciones colombianas
const parseColombianAddress = (query: string): {
  streetType: string;
  streetNumber: string;
  streetLetter: string;
  houseNumber: string;
  houseLetter: string;
  additionalNumber: string;
  isValid: boolean;
} => {
  // Normalizar primero
  const normalized = normalizeColombianAddress(query);
  
  // Patrones más detallados para direcciones colombianas
  const fullPattern = /^(calle|carrera|avenida|diagonal|transversal|circular|autopista)\s+(\d+)([a-z]*)(?:\s*#\s*|\s+)(\d+)([a-z]*)(?:\s*-\s*|\s+)?(\d*)$/i;
  const shortPattern = /^(calle|carrera|avenida|diagonal|transversal|circular|autopista)\s+(\d+)([a-z]*)$/i;

  let match = normalized.match(fullPattern);
  
  if (match) {
    return {
      streetType: match[1].toLowerCase(),
      streetNumber: match[2],
      streetLetter: match[3],
      houseNumber: match[4],
      houseLetter: match[5],
      additionalNumber: match[6],
      isValid: true
    };
  }
  
  // Intenta con el formato simplificado (solo tipo de vía y número)
  match = normalized.match(shortPattern);
  if (match) {
    return {
      streetType: match[1].toLowerCase(),
      streetNumber: match[2],
      streetLetter: match[3] || "",
      houseNumber: "",
      houseLetter: "",
      additionalNumber: "",
      isValid: true
    };
  }
  
  return {
    streetType: "",
    streetNumber: "",
    streetLetter: "",
    houseNumber: "",
    houseLetter: "",
    additionalNumber: "",
    isValid: false
  };
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
      setAddress(formattedAddress);
      onLocationSelect(lat, lng, formattedAddress);
    } catch (error) {
      console.error("Error fetching address:", error);
      // Fallback simple: coordenadas
      const fallbackAddress = `Ubicación (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
      setAddress(fallbackAddress);
      onLocationSelect(lat, lng, fallbackAddress);
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
  
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  
    // Set new timeout for debounce
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Normalizar y analizar la consulta primero
        const normalizedQuery = normalizeColombianAddress(query);
        const parsedAddress = parseColombianAddress(query);
        
        // Estrategias de búsqueda según el tipo de entrada
        let results = [];
        
        // Estrategia 1: Dirección colombiana estructurada
        if (parsedAddress.isValid) {
          // Construir consulta estructurada para Nominatim
          let structuredQuery = "";
          
          if (parsedAddress.houseNumber) {
            // Formato completo: Tipo vía + Número + # + Número casa
            structuredQuery = `${parsedAddress.streetType} ${parsedAddress.streetNumber}${parsedAddress.streetLetter} # ${parsedAddress.houseNumber}${parsedAddress.houseLetter}${parsedAddress.additionalNumber ? '-' + parsedAddress.additionalNumber : ''}`;
          } else {
            // Formato simplificado: Tipo vía + Número
            structuredQuery = `${parsedAddress.streetType} ${parsedAddress.streetNumber}${parsedAddress.streetLetter}`;
          }
          
          // Búsqueda estructurada específica para Medellín
          const structResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&street=${encodeURIComponent(structuredQuery)}&city=Medellín&state=Antioquia&country=Colombia&addressdetails=1&limit=5&namedetails=1&accept-language=es`,
            {
              headers: {
                'User-Agent': 'EncafeinadosApp/1.0',
                'Accept-Language': 'es'
              }
            }
          );
          const structData = await structResponse.json();
          
          if (structData.length > 0) {
            results = structData;
          }
        }
        
        // Estrategia 2: Búsqueda por texto libre con contexto Medellín
        if (results.length === 0) {
          // Preparar la consulta para direcciones colombianas
          let enhancedQuery = `${normalizedQuery}, Medellín, Colombia`;
          
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enhancedQuery)}&addressdetails=1&limit=5&countrycodes=co&namedetails=1&accept-language=es`,
            {
              headers: {
                'User-Agent': 'EncafeinadosApp/1.0',
                'Accept-Language': 'es'
              }
            }
          );
          const data = await response.json();
          
          if (data.length > 0) {
            results = data;
          }
        }
        
        // Estrategia 3: Búsqueda por texto libre sin restricciones
        if (results.length === 0) {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=co&namedetails=1&accept-language=es`,
            {
              headers: {
                'User-Agent': 'EncafeinadosApp/1.0',
                'Accept-Language': 'es'
              }
            }
          );
          const data = await response.json();
          
          if (data.length > 0) {
            results = data;
          }
        }
        
        // Mejorar los resultados: priorizar los que estén en Medellín
        interface OSMAddressResult {
          address?: {
            city?: string;
            municipality?: string;
            [key: string]: any;  // For other address properties
          };
          lat: string;
          lon: string;
          display_name: string;
          [key: string]: any;  // For other properties in the result
        }

        results = results.sort((a: OSMAddressResult, b: OSMAddressResult) => {
          const aInMedellin: boolean = !!a.address && 
            !!(a.address.city?.toLowerCase() === 'medellín' || 
             a.address.municipality?.toLowerCase() === 'medellín');
          const bInMedellin: boolean = !!b.address && 
            !!(b.address.city?.toLowerCase() === 'medellín' || 
             b.address.municipality?.toLowerCase() === 'medellín');
          
          if (aInMedellin && !bInMedellin) return -1;
          if (!aInMedellin && bInMedellin) return 1;
          return 0;
        });
        
        // Process and format the suggestions
        const formattedSuggestions = results.map((item: any) => ({
          ...item,
          display_name: formatAddress(item)
        }));
        
        setSuggestions(formattedSuggestions);
      } catch (error) {
        console.error("Error searching for address:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce
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
  suggestions.map((item, index) => {
    // Determinar el tipo de lugar para mostrar icono apropiado
    let placeType = "location";
    if (item.address) {
      if (item.address.road) placeType = "address";
      else if (item.address.building || item.address.amenity) placeType = "building";
      else if (item.address.suburb || item.address.neighbourhood) placeType = "neighborhood";
    }
    
    return (
      <div
        key={index}
        onClick={() => handleSelectAddress(item.lat, item.lon, item.display_name)}
        className="p-3 cursor-pointer hover:bg-gray-100 border-b last:border-b-0 flex items-start"
      >
        <div className={`rounded-full p-1 mr-2 ${
          placeType === 'address' ? 'bg-blue-100' : 
          placeType === 'building' ? 'bg-green-100' : 
          placeType === 'neighborhood' ? 'bg-amber-100' : 'bg-gray-100'
        }`}>
          <MapPin className={`h-4 w-4 ${
            placeType === 'address' ? 'text-blue-500' : 
            placeType === 'building' ? 'text-green-500' : 
            placeType === 'neighborhood' ? 'text-amber-500' : 'text-gray-500'
          }`} />
        </div>
        <div>
          <span className="text-sm font-medium">{item.display_name}</span>
          {item.address && item.address.city && (
            <div className="text-xs text-gray-500">
              {[
                item.address.suburb || item.address.neighbourhood,
                item.address.city === 'Medellín' ? 'Medellín' : item.address.city
              ].filter(Boolean).join(", ")}
            </div>
          )}
        </div>
      </div>
    );
  })
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
          center={selectedPosition || currentPosition || [4.6097, -74.0817]} // Default to Bogotá, Colombia
          zoom={selectedPosition || currentPosition ? 17 : 12} // Higher zoom for better precision
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          ref={mapRef}
        >
          {/* Higher quality map tiles */}
          <TileLayer
             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={30}
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