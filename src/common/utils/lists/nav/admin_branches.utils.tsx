import { NavItemType } from "@/api/types/nav/nav.types";
import {
  Home,
  Star,
  Store,
  Images,
  MessageSquare,
  LayoutDashboard,
} from "@/common/ui/icons";
import { Wallet } from "lucide-react";

export const AdminBranchesItems: NavItemType[] = [

  {
    title: "Dashboard",
    href: "/branch",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Pagos",
    href: "/branch/payments",
    icon: <Wallet className="h-4 w-4" />,
  },
  {
    title: "Sucursal",
    href: "/branch/details",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Valoraciones",
    href: "/branch/raitings",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    title: "Galería",
    href: "/branch/images",
    icon: <Images className="h-4 w-4" />,
  },
  {
    title: "Atributos",
    href: "/branch/attributes",
    icon: <Star className="h-4 w-4" />,
  },
  {
    title: "Editar sucursal",
    href: "/branch/profile",
    icon: <Store className="h-4 w-4" />,
  },
];
