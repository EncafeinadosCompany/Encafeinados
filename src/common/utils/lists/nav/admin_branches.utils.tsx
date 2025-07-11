import { NavItemType } from "@/api/types/nav/nav.types"
import { Home, Star, Store, Images, MessageSquare, LayoutDashboard } from "@/common/ui/icons"
import { Wallet } from "lucide-react"

export const AdminBranchesItems: NavItemType[] = [
    {
    title: "Dashboard",
    href: "/sucursal/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
    {
    title: "Pagos",
    href: "/sucursal/pagos",
    icon: <Wallet className="h-4 w-4" />,
  },
  {
    title: "Inicio",
    href: "/sucursal",
    icon: <Home className="h-4 w-4" />,
  },
    {
    title: "Valoraciones",
    href: "/sucursal/valoraciones",
    icon: <MessageSquare className="h-4 w-4" />,
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