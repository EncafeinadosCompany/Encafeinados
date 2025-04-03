
import { AdminStoresItems } from "@/common/utils/lists/nav/adminStoresItems"
import NavbarGeneral from "@/common/widgets/nav/nav"

const HomeAdminStores = () => {
  return(
    <div className="min-h-screen bg-gray-200/40 flex flex-col overflow-x-hidden">
          <NavbarGeneral  navItems={AdminStoresItems}/>
    </div>
  )
}

export default HomeAdminStores