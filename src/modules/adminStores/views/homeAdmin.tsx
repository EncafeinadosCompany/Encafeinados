import { StoresItems } from "@/common/utils/lists/nav/adminStoresItems"
import NavbarGeneral from "@/common/widgets/nav/nav"

const HomeAdminStores = () => {
return(
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-200 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
        <NavbarGeneral navItems={StoresItems}/>
        </div>
      </div>
    </div>
)
}


export default HomeAdminStores