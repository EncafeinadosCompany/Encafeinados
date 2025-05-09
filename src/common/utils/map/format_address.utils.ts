// Format address to be more readable and Google-like
export const formatAddress = (addressData: any): string => {
    if (!addressData) return "";
    
    try {
      const address = addressData.address || {};
      const parts = new Set<string>(); // 🔹 Usamos un Set para evitar repeticiones
  
      // 📍 Dirección exacta en formato colombiano
      if (address.road) {
        let streetAddress = address.road;
        
        // Formato colombiano: Calle/Carrera/Avenida + número
        if (address.house_number) {
          // Si es una dirección con nomenclatura colombiana
          if (/^(calle|carrera|avenida|diagonal|transversal|circular|autopista)/i.test(streetAddress)) {
            streetAddress += ` ${address.house_number}`;
            
            // Agregar complemento si existe (ej: Apto, Torre, etc.)
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
  
      // 🏛 Ciudad o municipio
      if (address.city || address.town || address.village || address.municipality) {
        parts.add(address.city || address.town || address.village || address.municipality);
      }
  
      // 🌎 Departamento (equivalente a estado/provincia en Colombia)
      if (address.state || address.region) {
        parts.add(address.state || address.region);
      }
      
      // Agregar "Colombia" si no está ya incluido y estamos en Colombia
      if (address.country === "Colombia" && !parts.has("Colombia")) {
        parts.add("Colombia");
      }
  
      // ❌ Eliminar duplicados en caso de que se repitan valores
      const formattedAddress = Array.from(parts).join(", ");
  
      // 🔹 Si la dirección es muy corta o no tiene sentido, usamos `display_name`
      if (formattedAddress.length < 10 || parts.size < 2) {
        // Intentar limpiar el display_name para hacerlo más legible
        const cleanDisplayName = addressData.display_name
          ?.replace(/,\s*Colombia$/, ", Colombia")
          ?.replace(/,\s*,/g, ",");
        return cleanDisplayName || "Dirección no disponible";
      }
      
      return formattedAddress;
    } catch (error) {
      console.error("Error formateando dirección:", error);
      // Intentar limpiar el display_name como último recurso
      const cleanDisplayName = addressData.display_name
        ?.replace(/,\s*Colombia$/, ", Colombia")
        ?.replace(/,\s*,/g, ",");
      return cleanDisplayName || "Dirección no disponible";
    }
  };