import MapView from "@/common/widgets/map/map_view.widget";
import { ArrowLeft } from'@/common/ui/icons'
import { Link } from "react-router-dom";

export function MapViewCard  ()  {
return (
    <div className="w-full h-full relative">
        <Link
          to="/"
          className=" absolute bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg flex items-center gap-2 hover:bg-white transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-[#6F4E37] group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="pr-2 text-[#6F4E37] font-medium hidden md:inline">Volver</span>
        </Link>
        <div className="absolute w-full">
        <MapView>

</MapView>
        </div>
        
    </div>
)
};