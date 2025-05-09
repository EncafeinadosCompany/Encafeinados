import { useCoffeeCoinsQuery } from "@/api/queries/coffeecoins/coffeecoins.query";
import { CoffeloverItems } from "@/common/utils/lists/nav/coffeelover_items.utils";
import NavbarGeneral from "@/common/widgets/nav/nav.widget";
import { useEffect, useState } from "react";


const HomeCoffeelover = () => {
    const { data, isLoading } = useCoffeeCoinsQuery();
    const [coffeecoins, setCoffeecoins] = useState<number | null>(null)

    useEffect(() => {
        if (data) {
            setCoffeecoins(data.coffee_coins)
        }else{
            setCoffeecoins(0)
        }
    }, [data])
    return (
        <div className="bg-gray-200/40">
            <NavbarGeneral
                navItems={CoffeloverItems}
                coffeecoins={coffeecoins}
                isloading={isLoading}
                >
            </NavbarGeneral>
        </div>
    )
}

export default HomeCoffeelover;