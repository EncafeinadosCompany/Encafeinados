import { NavItemType } from "@/common/types/navTypes"
import { Home, Store, Building} from "@/common/ui/icons"

export const AdminStoresItems: NavItemType[] = [
  // {
  //   title: "Stores",
  //   href: "/admin",
  //   icon: <Store className="h-4 w-4" />,
  // },
  {
    title: "Branches",
    href: "/admin",
    icon: <Building className="h-4 w-4" />,
  }
]