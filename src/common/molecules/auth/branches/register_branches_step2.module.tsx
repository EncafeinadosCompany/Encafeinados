import MapSearch from "@/common/widgets/map/map_search.widget"

interface registerAdminProps {
    onLocationSelect: (lat: number, lng: number, address: string) => void;
}

export const RegisterBranchesStep2 = ({ onLocationSelect}: registerAdminProps) => {
    return (
        <div className="space-y-8 mx-auto max-w-4xl p-6  overflow-hidden">
            <div className="grid grid-cols-1 gap-8">
               <div className="h-[400px] overflow-auto">
                  <MapSearch
                    onLocationSelect={onLocationSelect}
                  >
                  </MapSearch>
               </div>
            </div>
        </div>
    )
}