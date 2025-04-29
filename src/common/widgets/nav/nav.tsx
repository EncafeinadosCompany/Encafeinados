import { useState, useEffect } from "react"
import { NavItemType } from "@/common/types/navTypes"
import { NavGeneral } from "@/common/molecules/nav/navGeneral"
import { useCoffeeCoinsQuery } from "@/api/queries/coffeecoins/coffeecoins"


export type NavItem = {
  navItems: NavItemType[]
}


export default function NavbarGeneral({ navItems }: NavItem) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const {data: coffeecoins, isLoading} = useCoffeeCoinsQuery();

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
    <div className="flex min-h-screen w-full">
      <NavGeneral
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isMobile={isMobile}
        navItems={navItems}
        coffeecoins={coffeecoins?.quantity}
        isLoading={isLoading}
        >
      </NavGeneral>
    </div>
  )
}



