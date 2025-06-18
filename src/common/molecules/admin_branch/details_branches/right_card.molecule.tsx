import { BrancheIDresponse } from "@/api/types/branches/branches.types"
import { QRCode } from "@/common/atoms/QRCode"
import { Card } from "@/common/ui/card"
import { Label } from "@/common/ui/label"
import { Switch } from "@/common/ui/switch"
import { Button } from "@/common/ui/button"
import { Clock, Settings } from "lucide-react"


interface RightCardProps {
    branches: BrancheIDresponse
    branchStatus: boolean
    handleStatusClick: (status: boolean) => void
    EXPOSED_URL: string
    onManageSchedule?: () => void
}
export const RightCardBranch = ({branches, branchStatus, handleStatusClick, EXPOSED_URL, onManageSchedule}:RightCardProps) =>{
return (
    <Card className="p-6 bg-white h-full shadow-lg rounded-xl border-none">
    <div className="flex flex-col h-full">        {/* Schedule Management Section */}
        <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Gestión de Horarios</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-[#DB8935]" />
                        <div>
                            <p className="font-medium text-gray-900">Horarios de Atención</p>
                            <p className="text-sm text-gray-500">Configurar horarios de apertura y cierre</p>
                        </div>
                    </div>
                    <Button
                        onClick={onManageSchedule}
                        className="bg-[#DB8935] hover:bg-[#C87000] text-white"
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        Gestionar
                    </Button>
                </div>
            </div>
        </div>

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