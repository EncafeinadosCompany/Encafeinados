
import { UserData } from "@/api/types/auth/auth.types";
import { NavItemType } from "@/api/types/nav/nav.types";
import { AdminBranchesItems } from "@/common/utils/lists/nav/admin_branches.utils"
import { ROLES } from "@/common/utils/lists/roles.utils";
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";
import NavbarGeneral from "@/common/widgets/nav/nav.widget"
import { DoorOpen } from "lucide-react";

export default function LayoutBranch() {

  const user = getEncryptedItem("user") as UserData | null;

 const Router:NavItemType[] =  [
   ...(user?.roles.includes(ROLES.STORE)
    ? [
        {
          title: "Volver",
          href: "/stores",
          icon: <DoorOpen className="h-4 w-4" />,
        },
      ]
    : []),
    ...AdminBranchesItems
 ]
  
  return <NavbarGeneral navItems={Router}/>
}
