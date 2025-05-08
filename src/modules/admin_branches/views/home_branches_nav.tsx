
import { AdminBranchesItems } from "@/common/utils/lists/nav/admin_branches.utils"
import NavbarGeneral from "@/common/widgets/nav/nav.widget"

export default function HomeBranchesNav () {
  
  return(
    <div className="min-h-screen bg-gray-50 flex flex-col  overflow-x-hidden">
        <NavbarGeneral navItems={AdminBranchesItems}></NavbarGeneral>
    </div>
       
  )
}
