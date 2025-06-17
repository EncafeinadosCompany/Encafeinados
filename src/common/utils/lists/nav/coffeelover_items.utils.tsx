
import { NavItemType } from "@/api/types/nav/nav.types"
import { Home} from "@/common/ui/icons"
import { Book, Map, User } from "lucide-react"

export const CoffeloverItems: NavItemType[] = [
    {
      title: "Inicio",
      href: "/coffeelover",
      icon: <Home className="h-4 w-4" />
    },
    {
      title: "Álbum",
      href: "/coffeelover/album",
      icon: <Book className="h-4 w-4" />
    },
    {
      title: "Mapa",
      href: "/coffeelover/map-coffelover",
      icon: <Map className="h-4 w-4" />
    },
    {
      title: "Perfil",
      href: "/coffeelover/Profile",
      icon: <User className="h-4 w-4" />
    },
  ]