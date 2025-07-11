import { useState, useEffect } from "react";
import { NavItemType } from "@/api/types/nav/nav.types";
import { NavGeneral } from "@/common/molecules/nav/nav_general.molecule";
import { useLocation } from "react-router-dom";
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";
import { UserData } from "@/api/types/auth/auth.types";

export type NavItem = {
  navItems: NavItemType[]
}

export default function NavbarGeneral({ navItems }: NavItem) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const user = getEncryptedItem("user") as UserData| null;
  const location = useLocation();



  // Detectar tamaño de pantalla directamente, sin usar el contexto
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Ejecutar inmediatamente
    checkIfMobile();
    
    // Añadir event listener para actualizar en cambios de tamaño
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Ajustar estado expandido según tamaño de pantalla
  useEffect(() => {
    if (isMobile) {
      setIsExpanded(false);
    } else {
      setIsExpanded(false); // O true, según prefieras para desktop
    }
  }, [isMobile]);
  
  // Scroll al inicio al cambiar de ruta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);



  return (
    <NavGeneral
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      isMobile={isMobile}
      navItems={navItems}
      role={user?.roles || null}
    />
  );
}