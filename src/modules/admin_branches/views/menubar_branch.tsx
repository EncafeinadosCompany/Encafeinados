
import { UserData } from "@/api/types/auth/auth.types";
import { AdminBranchesItems } from "@/common/utils/lists/nav/admin_branches.utils"
import { StoresItems } from "@/common/utils/lists/nav/admin_stores_Item.utils";
import { ROLES } from "@/common/utils/lists/roles.utils";
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";
import NavbarGeneral from "@/common/widgets/nav/nav.widget"

export default function MenubarBranch() {

    const user = getEncryptedItem("user") as UserData| null;

    if (user?.roles?.includes(ROLES.STORE)) {
        return <NavbarGeneral navItems={StoresItems} />
    }

  return <NavbarGeneral navItems={AdminBranchesItems}/>
}
