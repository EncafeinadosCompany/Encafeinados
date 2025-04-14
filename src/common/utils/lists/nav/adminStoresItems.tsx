import { NavItemType } from "@/common/types/navTypes"
import { Home} from "@/common/ui/icons"

export const AdminStoresItems: NavItemType[] = [
    {
      title: "Stores",
      href: "/admin",
      icon: <Home className="h-4 w-4" />,
    },
    {
      title: "Branches",
      href: "/admin/branches",
      icon: <Home className="h-4 w-4" />,
    }
]