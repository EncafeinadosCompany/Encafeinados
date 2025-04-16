import { NavItemType } from "@/common/types/navTypes"
import { Home, Search, Bell, Settings, User} from "@/common/ui/icons"

export const CoffeloverItems: NavItemType[] = [
    {
      title: "Inicio",
      href: "/coffeelover",
      icon: <Home className="h-4 w-4" />,
    },
    // {
    //   title: "Buscar",
    //   href: "/coffeelo",
    //   icon: <Search className="h-5 w-5" />,
    // },
    // {
    //   title: "Notificaciones",
    //   href: "/coffeer",
    //   icon: <Bell className="h-5 w-5" />,
    // },
    // {
    //   title: "Configuración",
    //   href: "/settings",
    //   icon: <Settings className="h-5 w-5" />,
    // },
    // {
    //   title: "Perfil",
    //   href: "/profile",
    //   icon: <User className="h-5 w-5" />,
    // },
  ]