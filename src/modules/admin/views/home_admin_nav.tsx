
import { AdminItems } from "@/common/utils/lists/nav/admin_items.utils"
import NavbarGeneral from "@/common/widgets/nav/nav.widget"

const HomeAdmin = () => {
  return(
    <div className="h-full bg-gray-200/40 flex flex-col overflow-hidden">
          <NavbarGeneral  navItems={AdminItems}/>
    </div>
  )
}

export default HomeAdmin