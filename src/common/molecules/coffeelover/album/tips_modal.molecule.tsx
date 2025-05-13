import { Coffee, X } from "lucide-react"


interface Tips {
    setShowTips: React.Dispatch<React.SetStateAction<boolean>>;
    showTips: boolean;
}
export const TipsModal = ({setShowTips, showTips}:Tips) => {
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300 ${showTips ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-white rounded-lg shadow-xl max-w-md mx-4 p-6 relative">
            <button
                onClick={() => setShowTips(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                aria-label="Cerrar consejos"
            >
                <X className="h-5 w-5" />
            </button>

            {/* Encabezado */}
            <div className="flex items-center mb-5">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                    <Coffee className="h-6 w-6 text-amber-700" />
                </div>
                <h3 className="text-lg font-bold text-amber-900">
                    Consejos para navegar
                </h3>
            </div>
            <ul className="space-y-3 text-gray-700 mb-6">
                <li className="flex items-start">
                    <span className="flex-shrink-0 mr-2 text-amber-600 mt-0.5">•</span>
                    <span>En móvil, desliza arriba y abajo para ver todos los sellos</span>
                </li>
                <li className="flex items-start">
                    <span className="flex-shrink-0 mr-2 text-amber-600 mt-0.5">•</span>
                    <span>Desliza horizontalmente para cambiar de página</span>
                </li>
                <li className="flex items-start">
                    <span className="flex-shrink-0 mr-2 text-amber-600 mt-0.5">•</span>
                    <span>Toca un sello para ver su detalle</span>
                </li>
                <li className="flex items-start">
                    <span className="flex-shrink-0 mr-2 text-amber-600 mt-0.5">•</span>
                    <span>Usa los botones "Anterior" y "Siguiente" para navegar entre páginas</span>
                </li>
            </ul>
            <div className="flex justify-center">
                <button
                    onClick={() => setShowTips(false)}
                    className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-md hover:from-amber-700 hover:to-amber-600 transition-all shadow-sm font-medium"
                >
                    Entendido
                </button>
            </div>
        </div>
    </div>  
    )

} 