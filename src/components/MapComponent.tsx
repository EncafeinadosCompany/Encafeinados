import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix para los iconos de Leaflet en React
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapComponent: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Coordenadas de Medellín, Colombia
  const position: [number, number] = [6.2442, -75.5812];

  return (
    <div className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-80 w-full"}`}>
      <MapContainer
        center={position}
        zoom={13}
        className={`w-full ${isFullScreen ? "h-screen" : "h-80"}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={icon}>
          <Popup>
            Medellín, Colombia <br /> Capital mundial del café premium.
          </Popup>
        </Marker>
      </MapContainer>

      {/* Botón para maximizar/minimizar */}
      <button
        onClick={() => setIsFullScreen(!isFullScreen)}
        className="absolute bottom-4 right-4 z-20 bg-white bg-opacity-90 p-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110"
      >
        {isFullScreen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-orange-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-orange-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default MapComponent;