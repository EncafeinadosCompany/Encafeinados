import { StoresItems } from "@/common/utils/lists/nav/adminStoresItems"
import NavbarGeneral from "@/common/widgets/nav/nav"

const HomeAdminStores = () => {
  return(
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-200 flex flex-col">
      <div className="flex-1 flex flex-col p-2 md:p-1 lg:p-1">
    
        <div className="w-full max-w-[1400px] mx-auto mb-4">
          <NavbarGeneral navItems={StoresItems}/>
        </div>
        <div className="flex-1 w-full max-w-[1400px] mx-auto">
          <main className="h-full">
          </main>
        </div>
      </div>
    </div>
  )
}

export default HomeAdminStores