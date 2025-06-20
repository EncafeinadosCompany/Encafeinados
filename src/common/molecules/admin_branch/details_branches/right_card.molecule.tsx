import { BrancheIDresponse } from "@/api/types/branches/branches.types"
import { QRCode } from "@/common/atoms/QRCode"
import { Card } from "@/common/ui/card"
import { Label } from "@/common/ui/label"
import { Switch } from "@/common/ui/switch"
import { Button } from "@/common/ui/button"
import { Clock, Settings } from'@/common/ui/icons'


interface RightCardProps {
    branches: BrancheIDresponse
    branchStatus: boolean
    handleStatusClick: (status: boolean) => void
    EXPOSED_URL: string
    onManageSchedule?: () => void
}

export const RightCardBranch = ({branches, branchStatus, handleStatusClick, EXPOSED_URL, onManageSchedule}:RightCardProps) => {
  return (
    <Card className="p-3 sm:p-5 md:p-6 bg-white h-full shadow-lg rounded-xl border-none overflow-hidden">
      <div className="flex flex-col h-full">       
        <div className="mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Gestión de QR</h3>
          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg flex justify-center">
            <div className="w-full max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[60%] xl:max-w-[350px] aspect-square">
              <QRCode 
                width={300} 
                url={`${EXPOSED_URL}/coffeelover/register-branch-visit?branch_id=${branches?.branch.id}`} 
              />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 sm:pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            
            <div className="flex flex-col h-full">
              <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-3">Gestión de Horarios</h3>
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg flex-1 flex flex-col">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[#DB8935] flex-shrink-0" />
                  <div className="min-w-0"> {/* Evita desborde del texto */}
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Horarios de Atención</p>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">Configurar horarios de apertura y cierre</p>
                  </div>
                </div>
                <div className="mt-auto pt-3">
                  <Button
                    onClick={onManageSchedule}
                    className="w-full bg-[#DB8935] hover:bg-[#C87000] text-white text-xs sm:text-sm h-9"
                  >
                    <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">Gestionar Horarios</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col h-full">
              <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-3">Estado de Sucursal</h3>
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg flex-1 flex flex-col">
                <div className="min-w-0">
                  <Label htmlFor="branch-status" className="text-xs sm:text-sm md:text-base font-medium block">
                    Sucursal actualmente {branchStatus ? "abierta" : "cerrada"}
                  </Label>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                    {branchStatus
                      ? "La sucursal está operando con normalidad"
                      : "La sucursal no está disponible para clientes"}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-auto pt-3">
                  <Switch
                    id="branch-status"
                    checked={branchStatus}
                    onCheckedChange={handleStatusClick}
                  />
                  <span className="text-xs sm:text-sm font-medium">
                    {branchStatus ? "Abierta" : "Cerrada"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}