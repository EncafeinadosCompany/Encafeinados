
import L from "leaflet";
  
  export const customIcon= L.icon({
    iconUrl: "/pinBlue.png", // Puedes personalizarlo si descargas otro
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  });
  