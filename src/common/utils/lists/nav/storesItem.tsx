import { NavItemType } from "@/common/types/navTypes";
import { GitBranchPlus} from "lucide-react";

export const StoresItems: NavItemType[] = [
    {
      title: "Sucursales",
      href: "/stores",
      icon: <GitBranchPlus className="h-4 w-4" />,

    }
]