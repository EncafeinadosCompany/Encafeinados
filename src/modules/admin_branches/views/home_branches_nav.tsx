
import { AdminBranchesItems } from "@/common/utils/lists/nav/admin_branches.utils"
import NavbarGeneral from "@/common/widgets/nav/nav.widget"

export default function HomeBranchesNav () {
  
  return(
    <div className="relative h-[95vh] md:h-full bg-gray-100 flex flex-col overflow-hidden">
        <NavbarGeneral navItems={AdminBranchesItems}/>
    </div>
       
  )
}
