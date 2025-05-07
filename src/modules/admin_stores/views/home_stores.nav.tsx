import { StoresItems } from "@/common/utils/lists/nav/admin_stores_Item.utils"
import NavbarGeneral from "@/common/widgets/nav/nav.widget"

const HomeStores = () => {
  return(
    <div className="min-h-screen bg-gray-50  flex flex-col  overflow-x-hidden">
        <NavbarGeneral navItems={StoresItems}></NavbarGeneral>
    </div>
       
  )
}

export default HomeStores