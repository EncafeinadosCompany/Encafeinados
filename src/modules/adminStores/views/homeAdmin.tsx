import { StoresItems } from "@/common/utils/lists/nav/adminStoresItems"
import NavbarGeneral from "@/common/widgets/nav/nav"

const HomeAdminStores = () => {
  return(
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-200 flex flex-col">      
          <NavbarGeneral navItems={StoresItems}/>
        <div className="flex-1 w-full max-w-[1400px] mx-auto">
          <main className="h-full">
          </main>
        </div>
      </div>
    
  )
}

export default HomeAdminStores