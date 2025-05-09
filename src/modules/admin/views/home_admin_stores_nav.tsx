
import { AdminItems } from "@/common/utils/lists/nav/admin_items.utils"
import NavbarGeneral from "@/common/widgets/nav/nav.widget"

const HomeAdminStores = () => {
  return(
    <div className="bg-gray-200/40 flex flex-col overflow-x-hidden">
          <NavbarGeneral  navItems={AdminItems}/>
    </div>
  )
}

export default HomeAdminStores