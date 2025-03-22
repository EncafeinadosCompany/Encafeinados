import { Outlet } from "react-router-dom";

const CoffeeloversLayout = () => {
    return (
        <div className="p-4">
        <h1 className="text-2xl font-bold">Zona CoffeeLovers ☕</h1>
        <Outlet /> 
      </div>
    )
}

export default CoffeeloversLayout;