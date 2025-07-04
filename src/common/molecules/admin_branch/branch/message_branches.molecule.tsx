import { Button } from "@/common/ui/button"
import { AlertCircle, Coffee, RefreshCw } from "@/common/ui/icons"
interface ErrorMessage {
    branchError?: any
    imageError?: any
    statusError?: any
}
export const MessageBranches = {    


    ErrorMessageBranch: ({ branchError, imageError, statusError }: ErrorMessage) => {
        return (
            <div className="container h-full mx-auto max-w-7xl px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <div className="text-red-600 mb-4">
                        <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                        <h3 className="text-lg font-semibold">Error al cargar la información</h3>
                    </div>
                    <p className="text-red-500 mb-4">
                        {branchError?.message || imageError?.message || statusError?.message ||
                            'Ocurrió un error al cargar los datos de la sucursal'}
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Intentar nuevamente
                    </Button>
                </div>
            </div>
        )
    },
    
    LoadingMessageBranch: () => {
        return (
            <div className="container h-full mx-auto max-w-7xl px-4 py-8">
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#43765C] mx-auto"></div>
                        <p className="text-gray-500">Cargando información de la sucursal...</p>
                    </div>
                </div>
            </div>
        )
    },
    
    NoDataMessageBranch:  () => {
        return (
            <div className="container h-full mx-auto max-w-7xl px-4 py-8">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                    <Coffee className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-600">No hay información disponible</h3>
                    <p className="text-gray-500 mt-2">No se encontraron datos de la sucursal</p>
                </div>
            </div>
        )
    }
}