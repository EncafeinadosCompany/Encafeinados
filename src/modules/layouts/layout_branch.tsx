import { UserData } from "@/api/types/auth/auth.types";
import { NavItemType } from "@/api/types/nav/nav.types";
import { AdminBranchesItems } from "@/common/utils/lists/nav/admin_branches.utils";
import { ROLES } from "@/common/utils/lists/roles.utils";
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";
import NavbarGeneral from "@/common/widgets/nav/nav.widget";
import { useEffect, useMemo } from "react";
import { StoresItems } from "@/common/utils/lists/nav/admin_stores_Item.utils";
import SelectBranchesWidget from "@/common/widgets/admin_store/branch/select_branches.widget";
import { BranchProvider } from "@/common/context/branch_context";

export default function LayoutBranch() {
  const user = useMemo(() => getEncryptedItem("user") as UserData | null, []);

  const Router: NavItemType[] = useMemo(
    () => [
      ...(user?.roles.includes(ROLES.STORE) ? StoresItems : []),
      ...AdminBranchesItems,
    ],
    [user, StoresItems, AdminBranchesItems]
  );

  

  return (
    <BranchProvider>
      <div className="min-h-screen relative bg-gray-50  flex flex-col justify-center  overflow-x-hidden">
        <NavbarGeneral navItems={Router}></NavbarGeneral>

        {user?.roles.includes(ROLES.STORE) && (
          <div className="absolute top-2 right-4">
            <SelectBranchesWidget
              isAdminStore={true}
            />
          </div>
        )}
      </div>
    </BranchProvider>
  );
}
