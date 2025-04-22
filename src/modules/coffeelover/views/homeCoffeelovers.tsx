import { CoffeloverItems } from "@/common/utils/lists/nav/coffeeloverItems";
import NavbarGeneral from "@/common/widgets/nav/nav";


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