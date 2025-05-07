import { useState, useEffect } from "react"
import { NavItemType } from "@/api/types/nav/nav.types"
import { NavGeneral } from "@/common/molecules/nav/nav_general.molecule"
import { useCoffeeCoinsQuery } from "@/api/queries/coffeecoins/coffeecoins.query"
import { getAuthStorage } from "@/common/utils/auth_storage.utils"


export type NavItem = {
  navItems: NavItemType[]
}

export default function NavbarGeneral({ navItems }: NavItem) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const {data: coffeecoins, isLoading} = useCoffeeCoinsQuery();

  const {user} =  getAuthStorage();


  console.log("coffeecoins", coffeecoins);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsExpanded(false)
      } else {
        setIsExpanded(true)
      }
    }

    checkIfMobile()

    window.addEventListener("resize", checkIfMobile)

    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

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