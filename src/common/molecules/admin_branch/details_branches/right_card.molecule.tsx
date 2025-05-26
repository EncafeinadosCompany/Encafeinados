import { BrancheIDresponse } from "@/api/types/branches/branches.types"
import { QRCode } from "@/common/atoms/QRCode"
import { Card } from "@/common/ui/card"
import { Label } from "@/common/ui/label"
import { Switch } from "@/common/ui/switch"


interface RightCardProps {
    branches: BrancheIDresponse
    branchStatus: boolean
    handleStatusClick: (status: boolean) => void
    EXPOSED_URL: string
}
export const RightCardBranch = ({branches, branchStatus, handleStatusClick, EXPOSED_URL}:RightCardProps) =>{
return (
    <Card className="p-6 bg-white h-full shadow-lg rounded-xl border-none">
    <div className="flex flex-col h-full">
        {/* Screen Size Section */}
        {/* <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Horarios</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg flex space-x-4 text-gray-500">
                    <Clock1></Clock1>
                    <p className="font-medium">7:00 AM</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg flex space-x-4 text-gray-500">
                    <Clock2></Clock2>
                    <p className="font-medium">7:00 PM</p>
                </div>
            </div>
        </div> */}

        {/* Memory Section */}
        <div className="mb-8 h-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-8">Gestión de QR</h3>
            <div className="p-4 bg-gray-50 rounded-lg h-[50vh] flex flex-col justify-center">
                <QRCode width={400} url={`${EXPOSED_URL}/coffeelover/register-branch-visit?branch_id=${branches?.branch.id}`} />
            </div>
        </div>

        {/* Branch Status Section */}
        <div className="mt-auto pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Estado de Sucursal</h3>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                    <Label htmlFor="branch-status" className="text-base font-medium">
                        Sucursal actualmente {branchStatus ? "abierta" : "cerrada"}
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                        {branchStatus
                            ? "La sucursal está operando con normalidad"
                            : "La sucursal no está disponible para clientes"}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Switch
                        id="branch-status"
                        checked={branchStatus}
                        onCheckedChange={handleStatusClick}
                    />
                    <span className="text-sm font-medium">
                        {branchStatus ? "Abierta" : "Cerrada"}
                    </span>
                </div>
            </div>
        </div>
    </div>
</Card>
)
}