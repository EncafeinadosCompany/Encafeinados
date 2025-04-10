import { currentLocationIcon } from "@/common/atoms/map/Icons/currentLocationIcon";
import { customIcon } from "@/common/atoms/map/Icons/customIcon";
import { formatAddress } from "@/common/utils/map/formatAddress";
import { MapController } from "@/common/utils/map/MapController";
import { Loader2, MapPin, Navigation, Search, X } from "@/common/ui/icons";
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";

interface SearchProps {
  mapRef: React.RefObject<L.Map | null>;
  isLocating: boolean;
  isSearching: boolean;
  searchQuery: string;
  suggestions: any[];
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  recentSearches: { display_name: string; lat: string; lon: string }[];
  currentPosition: [number, number] | null;
  showSuggestions: boolean;
  selectedPosition: [number, number] | null;
  setSearchQuery: (query: string) => void;
  HandleSearch: (query: string) => void;
  handleSearchFocus: () => void;
  clearSearch: () => void;
  onLocationSelect: (lat: number, lon: number, name: string) => void;
  UseCurrentLocation: () => void;
  handleSelectAddress: (lat: string, lon: string, address: string) => void;
  setSelectedPosition: (position: [number, number] | null) => void;
}

export const CardMapStore = ({
  mapRef,
  isLocating,
  isSearching,
  searchQuery,
  searchInputRef,
  recentSearches,
  showSuggestions,
  selectedPosition,
  onLocationSelect,
  currentPosition,
  suggestions,
  clearSearch,
  HandleSearch,
  setSearchQuery,
  handleSearchFocus,
  UseCurrentLocation,
  setSelectedPosition,
  handleSelectAddress,
}: SearchProps) => {
  return (
    <div className="w-full max-w-6xl bg-white rounded-xl  p-4 md:p-6 space-y-4 [container-type:inline-size]">
      <div className=" map-grid">

{/* Input de búsqueda */}
<div >
<div className="relative">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <Search className="h-5 w-5 text-gray-400" />
  </div>
  <input
    ref={searchInputRef}
    type="text"
    value={searchQuery}
    onChange={(e) => HandleSearch(e.target.value)}
    onFocus={handleSearchFocus}
    placeholder="Busca una dirección o lugar..."
    className="pl-10 pr-10 w-full p-3 border rounded-full border-gray-600 shadow-sm focus:outline-none  focus:ring-amber-500 focus:border-amber-500 transition"
  />
  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
    {searchQuery && (
      <button
        onClick={clearSearch}
        className="p-2 text-gray-400 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>
    )}
    {isSearching && (
      <Loader2 className="h-5 w-5 text-gray-400 animate-spin ml-2" />
    )}
  </div>
</div>

{/* Botón ubicación actual */}
<button
  onClick={UseCurrentLocation}
  className=" flex mt-2 items-center text-blue-600 hover:text-blue-800 text-sm"
>
  <Navigation className="h-4 w-4 mr-2" />
  {isLocating ? "Obteniendo ubicación..." : "Usar mi ubicación actual"}
  {isLocating && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
</button>

{/* Sugerencias */}
{showSuggestions && (
  <div className="bg-white border rounded-lg shadow-md max-h-80 overflow-auto">
    {searchQuery.length < 2 && recentSearches.length > 0 && (
      <div className="p-2">
        <div className="text-xs font-medium text-gray-500 mb-2">
          Búsquedas recientes
        </div>
        {recentSearches.map((item, index) => (
          <div
            key={`recent-${index}`}
            onClick={() =>
              handleSelectAddress(item.lat, item.lon, item.display_name)
            }
            className="p-2 hover:bg-gray-100 cursor-pointer flex items-start"
          >
            <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-1" />
            <span className="text-sm text-gray-800">{item.display_name}</span>
          </div>
        ))}
      </div>
    )}

    {suggestions.length > 0 ? (
      suggestions.map((item, index) => (
        <div
          key={index}
          onClick={() =>
            handleSelectAddress(item.lat, item.lon, item.display_name)
          }
          className="p-2 hover:bg-gray-100 cursor-pointer flex items-start border-t"
        >
          <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-1" />
          <span className="text-sm text-gray-800">{item.display_name}</span>
        </div>
      ))
    ) : searchQuery.length >= 2 && !isSearching ? (
      <div className="p-4 text-center text-gray-500 text-sm">
        No se encontraron resultados para "{searchQuery}"
      </div>
    ) : null}

    <div
      onClick={UseCurrentLocation}
      className="p-2 hover:bg-gray-100 cursor-pointer flex items-center border-t"
    >
      <Navigation className="h-4 w-4 text-blue-500 mr-2" />
      <span className="text-sm text-blue-600">Usar mi ubicación actual</span>
    </div>
  </div>
)}
</div>

<div>
  {/* Mapa responsivo */}
<div className="h-[250px] md:h-[250px] w-full rounded-lg overflow-hidden shadow-md border">
  <MapContainer
    center={selectedPosition || currentPosition || [4.6097, -74.0817]}
    zoom={selectedPosition || currentPosition ? 17 : 12}
    style={{ height: "100%", width: "100%" }}
    zoomControl={false}
    ref={mapRef}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      maxZoom={30}
    />
    <ZoomControl position="bottomright" />

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

    {currentPosition &&
      selectedPosition &&
      (currentPosition[0] !== selectedPosition[0] ||
        currentPosition[1] !== selectedPosition[1]) && (
        <Marker
          position={currentPosition}
          icon={currentLocationIcon}
          title="Mi ubicación actual"
        />
      )}

    <MapController position={selectedPosition || currentPosition} />
  </MapContainer>
</div>

{/* Dirección seleccionada */}
{searchQuery && (
  <div className="bg-gray-50 p-3 rounded-md border text-sm">
    <div className="text-xs text-gray-500 mb-1">Dirección seleccionada:</div>
    <div className="font-medium">{searchQuery}</div>
  </div>
)}

{/* Indicaciones */}
<div className="mt-3 text-xs text-gray-600 space-y-1">
  <p className="flex items-center">
    <MapPin className="h-4 w-4 text-red-500 mr-2" />
    Marcador rojo: ubicación seleccionada
  </p>
  {currentPosition &&
    selectedPosition &&
    (currentPosition[0] !== selectedPosition[0] ||
      currentPosition[1] !== selectedPosition[1]) && (
      <p className="flex items-center">
        <MapPin className="h-4 w-4 text-blue-500 mr-2" />
        Marcador azul: tu ubicación actual
      </p>
    )}
  <p>Haz clic en el mapa o arrastra el marcador para ajustar la posición.</p>
</div>
</div>
</div>
    </div>
    
  );
};
