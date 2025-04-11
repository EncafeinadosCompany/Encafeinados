import { StoresItems } from "@/common/utils/lists/nav/storesItem"
import NavbarGeneral from "@/common/widgets/nav/nav"

const HomeStores = () => {
  return(
    <div className="min-h-screen bg-gray-50  flex flex-col  overflow-x-hidden">
        <NavbarGeneral navItems={StoresItems}></NavbarGeneral>
    </div>
       
  )
}

export default HomeStores