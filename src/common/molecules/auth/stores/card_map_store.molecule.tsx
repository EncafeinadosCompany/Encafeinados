import { currentLocationIcon } from "@/common/atoms/map/Icons/currentLocationIcon";
import { customIcon } from "@/common/atoms/map/Icons/customIcon";
import { formatAddress } from "@/common/utils/map/format_address.utils";
import { MapController } from "@/common/utils/map/map_controller.utils";
import {
  Loader2,
  MapPin,
  Navigation,
  Search,
  X,
  Clock,
  Info,
} from "@/common/ui/icons";
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import { Button } from "@/common/ui/button";

interface SearchProps {
  mapRef: React.RefObject<L.Map | null>;
  isLocating: boolean;
  isSearching: boolean;
  searchQuery: string;
  suggestions: any[];
  isLargeSize?: boolean;
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
  isLargeSize = false,
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
    <div id="card-top" className="w-full max-w-5xl rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div
        className={`${
          isLargeSize ? "grid grid-cols-1 lg:grid-cols-5 gap-6 " : ""
        } p-2`}
      >
        {/* Search Section */}
        <div  className="lg:col-span-2 space-y-5">
          {/* Enhanced Search Input */}
          <div   className="relative group ">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#DB8935] transition-colors duration-200" />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              data-testid="search-input-location"
              value={searchQuery}
              onChange={(e) => HandleSearch(e.target.value)}
              onFocus={handleSearchFocus}
              placeholder="Busca una dirección o lugar..."
              className="
                w-full pl-13 pr-12 py-4 
                border-2 border-gray-200 rounded-xl
                bg-gray-50/50 focus:bg-white
                text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-[#DB8935]/20 focus:border-[#DB8935]
                transition-all duration-300
                text-sm font-medium
                shadow-sm hover:shadow-md
              "
            />

            <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {isSearching && (
                <div className="p-1">
                  <Loader2 className="h-5 w-5 text-[#DB8935] animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Current Location Button */}
          <button
            onClick={UseCurrentLocation}
            type="button"
            className="
              w-full flex items-center justify-center space-x-3 p-2
              bg-gradient-to-r from-blue-50 to-indigo-50
              border border-blue-200 rounded-xl text-xs
              text-blue-700 hover:text-blue-800
              hover:from-blue-100 hover:to-indigo-100
              transition-all duration-200
              group
            "
          >
            {isLocating ? (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            ) : (
              <Navigation className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
            )}
            <span className="font-medium">
              {isLocating
                ? "Obteniendo ubicación..."
                : "Usar mi ubicación actual"}
            </span>
          </button>

          {/* Suggestions */}
          {showSuggestions && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-hidden">
              <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {searchQuery.length < 2 && recentSearches.length > 0 && (
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Búsquedas recientes
                      </span>
                    </div>

                    <div className="space-y-1">
                      {recentSearches.map((item, index) => (
                        <div
                          key={`recent-${index}`}
                          onClick={() =>
                            handleSelectAddress(
                              item.lat,
                              item.lon,
                              item.display_name
                            )
                          }
                          className="p-3 hover:bg-amber-50 cursor-pointer flex items-start space-x-3 rounded-lg transition-colors duration-200 group"
                        >
                          <MapPin className="h-4 w-4 text-amber-600 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                          <span className="text-sm text-gray-900 line-clamp-2">
                            {item.display_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {suggestions.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {suggestions.map((item, index) => (
                      <div
                        key={index}
                        onClick={() =>
                          handleSelectAddress(
                            item.lat,
                            item.lon,
                            item.display_name
                          )
                        }
                        className="p-4 hover:bg-amber-50 cursor-pointer flex items-start space-x-3 transition-colors duration-200 group"
                      >
                        <MapPin className="h-4 w-4 text-amber-600 mt-1 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-sm text-gray-900 line-clamp-2 leading-relaxed">
                          {item.display_name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : searchQuery.length >= 2 && !isSearching ? (
                  <div className="p-6 text-center">
                    <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <div className="text-sm text-gray-500 mb-1">
                      No se encontraron resultados
                    </div>
                    <div className="text-xs text-gray-400">
                      para "{searchQuery}"
                    </div>
                  </div>
                ) : null}

                {searchQuery.length < 2 && (
                  <Button
                    type="button"
                    onClick={UseCurrentLocation}
                    className="w-full p-4 hover:bg-blue-50 cursor-pointer flex items-center justify-start border-none bg-transparent text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    <Navigation className="h-4 w-4 mr-3" />
                    <span className="text-sm font-medium">
                      Usar mi ubicación actual
                    </span>
                  </Button>
                )}
              </div>
            </div>
          )}
          {/* Map Instructions */}
          <div className="hidden md:block bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <Info className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">
                Instrucciones del mapa
              </span>
            </div>

            <div className="space-y-2.5 text-sm text-amber-700">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-[#DB8935] rounded-full shadow-sm"></div>
                <span>Marcador naranja: ubicación seleccionada</span>
              </div>

              {currentPosition &&
                selectedPosition &&
                (currentPosition[0] !== selectedPosition[0] ||
                  currentPosition[1] !== selectedPosition[1]) && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                    <span>Marcador azul: tu ubicación actual</span>
                  </div>
                )}

              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 border-2 border-amber-600 rounded-full mt-1 flex-shrink-0"></div>
                <span>Arrastra el marcador para ajustar la posición.</span>
              </div>
            </div>
          </div>

          {/* Selected Address Display */}
          {searchQuery && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-amber-800 mb-1">
                    Dirección seleccionada
                  </div>
                  <div className="text-sm text-gray-900 font-medium leading-relaxed">
                    {searchQuery}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map Section */}
        <div className="lg:col-span-3 space-y-4 ">
          {/* Map Container */}
          <div className="relative">
            <div className="h-[400px] lg:h-[450px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-gray-100">
              <MapContainer
                center={
                  selectedPosition || currentPosition || [4.6097, -74.0817]
                }
                zoom={selectedPosition || currentPosition ? 17 : 12}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
                ref={mapRef}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://locationiq.com/">LocationIQ</a>'
                  url={`https://tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${
                    import.meta.env.VITE_LOCATIONIQ_API_KEY
                  }`}
                />

                <div className="z-[400]">
                  <ZoomControl position="bottomright" />
                </div>

                {selectedPosition && (
                  <Marker
                    position={selectedPosition}
                    icon={customIcon}
                    draggable={true}
                    eventHandlers={{
                      dragend: async (e) => {
                        const marker = e.target;
                        const position = marker.getLatLng();
                        const newPos: [number, number] = [
                          position.lat,
                          position.lng,
                        ];
                        setSelectedPosition(newPos);
                        try {
                          const response = await fetch(
                            `https://us1.locationiq.com/v1/reverse?key=${
                              import.meta.env.VITE_LOCATIONIQ_API_KEY
                            }&lat=${position.lat}&lon=${
                              position.lng
                            }&format=json`
                          );
                          const data = await response.json();
                          const formattedAddress = formatAddress(data);
                          setSearchQuery(formattedAddress);
                          onLocationSelect(
                            position.lat,
                            position.lng,
                            formattedAddress
                          );
                        } catch (error) {
                          console.error(
                            "Error fetching address after drag:",
                            error
                          );
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
          </div>
        </div>
      </div>
    </div>
  );
};
