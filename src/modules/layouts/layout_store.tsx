import { StoresItems } from "@/common/utils/lists/nav/admin_stores_Item.utils";
import NavbarGeneral from "@/common/widgets/nav/nav.widget";
import { AdminBranchesItems } from "@/common/utils/lists/nav/admin_branches.utils";
import { useMemo } from "react";

localStorage.setItem("IsActive", "true");

const HomeStores = () => {
  const itemsStore = useMemo(()=> [...StoresItems, ...AdminBranchesItems],[StoresItems, AdminBranchesItems]);
  return (
    <div className="min-h-screen relative bg-gray-50  flex flex-col justify-center  overflow-x-hidden">
      <NavbarGeneral navItems={itemsStore}></NavbarGeneral>
    </div>
  );
};

export default HomeStores;
