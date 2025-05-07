import { currentLocationIcon } from "@/common/atoms/map/Icons/currentLocationIcon";
import { customIcon } from "@/common/atoms/map/Icons/customIcon";
import { formatAddress } from "@/common/utils/map/format_address.utils";
import { MapController } from "@/common/utils/map/map_controller.utils";
import { Loader2, MapPin, Navigation, Search, X } from "@/common/ui/icons";
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import { Button } from "@/common/ui/button";

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
    <div className="w-full max-w-6xl bg-[#FFFFFF] rounded-xl space-y-4 [container-type:inline-size]">
      <div className="map-grid">

        {/* Search input */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#546F75]" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              data-testid="search-input-location"
              value={searchQuery}
              onChange={(e) => HandleSearch(e.target.value)}
              onFocus={handleSearchFocus}
              placeholder="Busca una dirección o lugar..."
              className="pl-10 pr-10 w-full p-3 border rounded-full border-[#D4D4D4]  shadow-sm focus:outline-none focus:ring-[#DB8935] focus:border-[#DB8935] transition placeholder-slate-400 sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="p-2 text-[#546F75] hover:text-[#2B2B2B]"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              {isSearching && (
                <Loader2 className="h-5 w-5 text-[#546F75] animate-spin ml-2" />
              )}
            </div>
          </div>

          {/* Current location button */}
          <button
            onClick={UseCurrentLocation}
            type="button"
            className="flex mt-2 items-center text-[#61708D] hover:text-[#020F17] text-sm"
          >
            <Navigation className="h-4 w-4 mr-2" />
            {isLocating ? "Obteniendo ubicación..." : "Usar mi ubicación actual"}
            {isLocating && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
          </button>

          {/* Suggestions */}
          {showSuggestions && (
            <div className="bg-white border border-[#D4D4D4] rounded-lg shadow-sm max-h-80 overflow-y-auto scrollbar-subtle scrollbar-track-transparent">
              {searchQuery.length < 2 && recentSearches.length > 0 && (
                <div className="p-2">
                  <div className="text-xs font-medium text-[#546F75] mb-2">
                    Búsquedas recientes
                  </div>
                  {recentSearches.map((item, index) => (
                    <div
                      key={`recent-${index}`}
                      onClick={() =>
                        handleSelectAddress(item.lat, item.lon, item.display_name)
                      }
                      className="p-2 hover:bg-[#F5E4D2] cursor-pointer flex items-start rounded"
                    >
                      <MapPin className="h-4 w-4 text-[#DB8935] mr-2 mt-1" />
                      <span className="text-sm text-[#2B2B2B]">{item.display_name}</span>
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
                    className="p-2 hover:bg-[#F5E4D2] cursor-pointer flex items-start border-t border-[#D4D4D4]"
                  >
                    <MapPin className="h-4 w-4 text-[#DB8935] mr-2 mt-1" />
                    <span className="text-sm text-[#2B2B2B]">{item.display_name}</span>
                  </div>
                ))
              ) : searchQuery.length >= 2 && !isSearching ? (
                <div className="p-4 text-center text-[#546F75] text-sm">
                  No se encontraron resultados para "{searchQuery}"
                </div>
              ) : null}

              <Button
                type="button"
                onClick={UseCurrentLocation}
                className="p-2 hover:bg-[#F5E4D2] cursor-pointer flex items-center border-none w-full justify-start"
              >
                <Navigation className="h-4 w-4 text-[#61708D] mr-2" />
                <span className="text-sm text-[#61708D]">Usar mi ubicación actual</span>
              </Button>
            </div>
          )}
        </div>

        <div>
          {/* Responsive map */}
          <div className="h-[250px] md:h-[250px] w-full rounded-lg overflow-hidden shadow-sm border border-[#D4D4D4]">
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

          {/* Selected address */}
          {searchQuery && (
            <div className="p-3 rounded-md border-none border-[#D4D4D4] text-sm mt-3">
              <div className="text-xs text-[#546F75] mb-1">Dirección seleccionada:</div>
              <div className="font-medium text-[#2B2B2B]">{searchQuery}</div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-3 text-xs text-[#546F75] space-y-1">
            <p className="flex items-center">
              <MapPin className="h-4 w-4 text-[#DB8935] mr-2" />
              Marcador naranja: ubicación seleccionada
            </p>
            {currentPosition &&
              selectedPosition &&
              (currentPosition[0] !== selectedPosition[0] ||
                currentPosition[1] !== selectedPosition[1]) && (
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 text-[#61708D] mr-2" />
                  Marcador azul: tu ubicación actual
                </p>
              )}
            <p className="flex items-start">
              <span className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#546F75" strokeWidth="1.5" fill="none" />
                  <path d="M12 8v4M12 16h.01" stroke="#546F75" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <span>Haz clic en el mapa o arrastra el marcador para ajustar la posición.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
