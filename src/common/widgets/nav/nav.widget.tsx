import { useState, useEffect } from "react"
import { NavItemType } from "@/api/types/nav/nav.types"
import { NavGeneral } from "@/common/molecules/nav/nav_general.molecule"

import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils"
import {  UserData } from "@/api/types/auth/auth.types"


export type NavItem = {
  navItems: NavItemType[]
  coffeecoins?: number | null
  isloading?: boolean | null
}

export default function NavbarGeneral({ navItems, coffeecoins, isloading}: NavItem) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const user = getEncryptedItem("user") as UserData| null;

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
        coffeecoins={coffeecoins ? coffeecoins : 0}
        isLoading={isloading? isloading : false}
        role={user?.roles || null}
        name={user?.email || null}
        >
      </NavGeneral>
   
  )
}