import { useState, useEffect } from "react";
import { NavItemType } from "@/common/types/navTypes";
import { NavGeneral } from "@/common/molecules/nav/navGeneral";
import { useCoffeeCoinsQuery } from "@/api/queries/coffeecoins/coffeecoins";
import { getAuthStorage } from "@/common/utils/authStorage";
import { useResponsiveContext } from "@/common/contexts/ResponsiveContext";
import { useLocation } from "react-router-dom";

export type NavItem = {
  navItems: NavItemType[]
}

export default function NavbarGeneral({ navItems }: NavItem) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { isMobile } = useResponsiveContext();
  const { data: coffeecoins, isLoading } = useCoffeeCoinsQuery();
  const { user } = getAuthStorage();
  const location = useLocation();


  console.log("coffeecoins", coffeecoins);

  useEffect(() => {
    if (isMobile) {
      setIsExpanded(false);
    } else {
      setIsExpanded(false);
    }
  }, [isMobile]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <NavGeneral
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      isMobile={isMobile}
      navItems={navItems}
      coffeecoins={coffeecoins?.quantity}
      isLoading={isLoading}
      role={user.role || null}
    />
  );
}



