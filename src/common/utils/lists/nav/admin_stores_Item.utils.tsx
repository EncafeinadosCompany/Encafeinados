import { NavItemType } from "@/api/types/nav/nav.types";
import { GitBranchPlus, Home, Images, Star, Store } from "lucide-react";
import { getEncryptedItem } from "../../security/storage_encrypted.utils";
import { UserData } from "@/api/types/auth/auth.types";
import { use } from "chai";
import { ROLES } from "../roles.utils";




const user = getEncryptedItem("user") as UserData | null;

export const StoresItems: NavItemType[] = [
  {
    title: "Sucursales",
    href: "/stores",
    icon: <GitBranchPlus className="h-4 w-4" />,
  }
]