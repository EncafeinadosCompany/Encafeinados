import { AlertCircle, Coffee } from "lucide-react"

export const CardError = () => {

    return (
        <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-amber-100">
            <div className="h-40 bg-amber-50 flex justify-center items-center border-b border-amber-100 relative">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f8d8a8_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="relative">
                    <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-amber-100 opacity-60"></div>
                    <div className="absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-amber-100 opacity-40"></div>
                    <div className="rounded-full bg-gradient-to-br from-amber-100 to-amber-200 p-5 relative z-10">
                        <AlertCircle className="h-10 w-10 text-amber-600" />
                    </div>
                </div>
            </div>
            <div className="p-8 flex flex-col items-center">
                <h3 className="text-xl font-medium text-amber-900 mb-3 text-center">No pudimos cargar los álbumes</h3>
                <p className="text-amber-700/80 text-center text-sm max-w-xs">
                    Estamos experimentando dificultades técnicas. Por favor, intenta nuevamente más tarde.
                </p>
                <button
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg 
                    hover:from-amber-600 hover:to-amber-700 transition-all shadow-sm font-medium text-sm 
                    flex items-center gap-2"
                    onClick={() => window.location.reload()}
                >
                    <Coffee className="h-4 w-4" />
                    <span>Reintentar</span>
                </button>
            </div>
        </div>
    </div>
    )


}