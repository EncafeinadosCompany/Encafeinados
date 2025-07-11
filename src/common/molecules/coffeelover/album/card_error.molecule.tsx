import { AlertCircle, Coffee } from'@/common/ui/icons'

export const CardError = () => {
    return (
        <div className="fixed inset-0 w-full h-full bg-amber-50/90 flex items-center justify-center p-4">
            <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-amber-100">
                <div className="h-48 sm:h-56 bg-gradient-to-r from-amber-50 to-cream-100 flex justify-center items-center border-b border-amber-100 relative">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f8d8a8_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-6 left-8 w-24 h-24 rounded-full bg-amber-100/40"></div>
                    <div className="absolute bottom-4 right-10 w-32 h-32 rounded-full bg-amber-100/30"></div>
                    
                    {/* Icon container */}
                    <div className="relative z-10">
                        <div className="rounded-full bg-gradient-to-br from-amber-100 to-amber-200 p-6 shadow-inner border border-amber-200/50">
                            <AlertCircle className="h-14 w-14 text-amber-600" />
                        </div>
                    </div>
                </div>
                
                <div className="p-8 sm:p-10 flex flex-col items-center">
                    <h3 className="text-2xl font-medium text-amber-900 mb-4 text-center">
                        No pudimos cargar los álbumes
                    </h3>
                    <p className="text-amber-700/80 text-center text-base max-w-md">
                        Estamos experimentando dificultades técnicas. Por favor, intenta nuevamente más tarde.
                    </p>
                    <button
                        className="mt-8 px-7 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg 
                        hover:from-amber-600 hover:to-amber-700 transition-all shadow-md font-medium text-sm 
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