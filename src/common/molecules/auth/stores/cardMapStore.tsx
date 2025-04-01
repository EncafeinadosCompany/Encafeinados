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
    searchInputRef: React.RefObject<HTMLInputElement| null>;
    recentSearches: { display_name: string; lat: string; lon: string; }[];
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
    setSelectedPosition:(position: [number, number] | null) => void;


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
        <div className="relative p-4 bg-white rounded-lg shadow-md">
            <div className="relative mb-2">
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

            <button
                onClick={UseCurrentLocation}
                className="mb-3 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
                <Navigation className="h-4 w-4 mr-1" />
                <span className="text-sm">{isLocating ? "Obteniendo ubicación..." : "Usar mi ubicación actual"}</span>
                {isLocating && <Loader2 className="h-4 w-4 ml-1 animate-spin" />}
            </button>

            {showSuggestions && (
                <div className="relative bg-white text-yellow-950 w-full left-0 right-0 mx-4 border rounded-lg shadow-lg mt-1 z-10 max-h-80 overflow-auto">
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
                        onClick={UseCurrentLocation}
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
    )
}