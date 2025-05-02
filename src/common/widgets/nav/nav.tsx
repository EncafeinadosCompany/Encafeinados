import { useState, useEffect } from "react"
import { NavItemType } from "@/common/types/navTypes"
import { NavGeneral } from "@/common/molecules/nav/navGeneral"
import { useCoffeeCoinsQuery } from "@/api/queries/coffeecoins/coffeecoins"
import { getAuthStorage } from "@/common/utils/authStorage"

export type NavItem = {
  navItems: NavItemType[]
}

export default function NavbarGeneral({ navItems }: NavItem) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const {data: coffeecoins, isLoading} = useCoffeeCoinsQuery();
  const {user} = getAuthStorage();

  // Mejorar la detección de móvil con ResizeObserver para mayor precisión
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      
      if (!isMobileView && !isExpanded) {
        setIsExpanded(false);
      } else if (isMobileView) {
        setIsExpanded(true);
      }
      
      // Ajustar variable CSS para el padding seguro
      document.documentElement.style.setProperty(
        '--mobile-nav-height', 
        isMobileView ? '4rem' : '0px'
      );
    }

    // Ejecutar inmediatamente
    checkIfMobile();

    // Usar ResizeObserver para mayor rendimiento y precisión
    const resizeObserver = new ResizeObserver(() => {
      checkIfMobile();
    });
    
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      // Limpiar la variable CSS
      document.documentElement.style.removeProperty('--mobile-nav-height');
    }
  }, []);

  return (
    <NavGeneral
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      isMobile={isMobile}
      navItems={navItems}
      coffeecoins={coffeecoins?.quantity}
      isLoading={isLoading}
      role={user.role || null}
    >
    </NavGeneral>
  )
}



