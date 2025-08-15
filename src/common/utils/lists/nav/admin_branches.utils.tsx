import { NavItemType } from "@/api/types/nav/nav.types";
import {
  Home,
  Star,
  Store,
  Images,
  MessageSquare,
  LayoutDashboard,
} from "@/common/ui/icons";
import { DoorOpen, Wallet } from "lucide-react";
import { getEncryptedItem } from "../../security/storage_encrypted.utils";
import { UserData } from "@/api/types/auth/auth.types";
import { ROLES } from "../roles.utils";

const user = getEncryptedItem("user") as UserData | null;

console.log(user)
export const AdminBranchesItems: NavItemType[] = [
  ...(user?.roles.includes(ROLES.STORE && ROLES.ADMIN)
    ? [
        {
          title: "Volver",
          href: "/stores",
          icon: <DoorOpen className="h-4 w-4" />,
        },
      ]
    : []),
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
    title: "Perfil",
    href: "/branch/profile",
    icon: <Store className="h-4 w-4" />,
  },
];
