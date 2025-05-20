import { NavItemType } from "@/api/types/nav/nav.types"
import { Home, Store} from "@/common/ui/icons"

export const AdminBranchesItems: NavItemType[] = [
  {
    title: "Inicio",
    href: "/sucursal",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Pefil",
    href: "/sucursal/perfil/attributes",
    icon: <Store className="h-4 w-4" />,
  },
  
]