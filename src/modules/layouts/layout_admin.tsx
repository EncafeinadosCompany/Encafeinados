
import { AdminItems } from "@/common/utils/lists/nav/admin_items.utils"
import NavbarGeneral from "@/common/widgets/nav/nav.widget"

export default function MenubarAdmin ()  {

  return(
    <div className="h-full bg-gray-200/40 flex flex-col overflow-hidden">
          <NavbarGeneral navItems={AdminItems} />
    </div>
  )
}
