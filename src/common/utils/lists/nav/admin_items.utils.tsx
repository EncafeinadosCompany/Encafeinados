import { NavItemType } from "@/api/types/nav/nav.types"
import {  Building, Album} from "@/common/ui/icons"
import { CalendarFold, User } from "lucide-react"

export const AdminItems: NavItemType[] = [
  {
    title: "Sucursales",
    href: "/admin",
    icon: <Building className="h-4 w-4" />,
  },
  {
    title: "Albums",
    href: "/admin/albums",
    icon: <Album className="h-4 w-4" />,
  },
  {
    title: "Eventos",
    href: "/admin/event",
    icon: <CalendarFold className="h-4 w-4" />,
  },
  {
    title: "Usuarios",
    href: "/admin/users",
    icon: <User className="h-4 w-4" />,
  }

]