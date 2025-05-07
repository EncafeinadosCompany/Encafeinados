import { NavItemType } from "@/api/types/nav/nav.types"
import {  Building, Album} from "@/common/ui/icons"

export const AdminItems: NavItemType[] = [
  {
    title: "Branches",
    href: "/admin",
    icon: <Building className="h-4 w-4" />,
  },
  {
    title: "Albums",
    href: "/admin/albums",
    icon: <Album className="h-4 w-4" />,
  }
]