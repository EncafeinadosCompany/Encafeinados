import { NavItemType } from "@/api/types/nav/nav.types";
import { GitBranchPlus}  from "@/common/ui/icons"


export const StoresItems: NavItemType[] = [
  {
    title: "Sucursales",
    href: "/stores",
    icon: <GitBranchPlus className="h-4 w-4" />,
  }
]