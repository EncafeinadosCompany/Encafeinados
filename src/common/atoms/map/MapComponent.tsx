// src/common/atoms/MapComponent.tsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los íconos de Leaflet en React/Vite
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Solución al problema común de íconos en Leaflet con React
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  position: LatLngExpression;
  popupText?: string;
  className?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({ 
  position, 
  popupText = "Encafeinados Headquarters",
  className = ""
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup className="text-sm font-medium">
            {popupText}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};