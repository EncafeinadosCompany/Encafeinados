import { CoffeloverItems } from "@/common/utils/lists/nav/coffeelover_items.utils";
import NavbarGeneral from "@/common/widgets/nav/nav.widget";


const HomeCoffeelover = () => {
    return (
        <div className="bg-gray-200/40">
            <NavbarGeneral
                navItems={CoffeloverItems}>
            </NavbarGeneral>
        </div>
    )
}

export default HomeCoffeelover;