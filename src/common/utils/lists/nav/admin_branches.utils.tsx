import { NavItemType } from "@/api/types/nav/nav.types"
import { Home, Star, Store} from "@/common/ui/icons"
import { Images } from "lucide-react"

export const AdminBranchesItems: NavItemType[] = [
  {
    title: "Inicio",
    href: "/sucursal",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Galería",
    href: "/sucursal/images",
    icon: <Images className="h-4 w-4" />,
  },
  {
    title: "Atributos",
    href: "/sucursal/attributes",
    icon: <Star className="h-4 w-4" />,
  },
  {
    title: "Perfil",
    href: "/sucursal/perfil",
    icon: <Store className="h-4 w-4" />,
  }
]