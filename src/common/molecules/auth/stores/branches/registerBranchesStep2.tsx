import { InputForm } from "@/common/atoms/auth/inputForm"
import SelectTypeDocument from "@/common/atoms/auth/selectTypeDocument"
import MapSearch from "@/common/molecules/mapSearch"
import { Label } from "@radix-ui/react-label"
import { FileText, Hash, Phone, User } from "lucide-react"
import { Controller, UseFormRegister } from "react-hook-form"

interface registerAdminProps {
    onLocationSelect: (lat: number, lng: number, address: string) => void;
}

export const RegisterBranchesStep2 = ({ onLocationSelect}: registerAdminProps) => {
    return (
        <div className="space-y-8 mx-auto max-w-4xl p-6 ">
            <div className="grid grid-cols-1  gap-8">
               <MapSearch
               onLocationSelect={onLocationSelect}
               >
               </MapSearch>
            </div>
        </div>
    )
}