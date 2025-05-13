import { Card, CardContent } from "@/common/ui/card"
import { AlertCircle, Coffee } from "lucide-react"

export const CardStampsError = () => {
    return (
        <div className="max-w-md mx-auto">
        <Card className="border-none shadow-xl overflow-hidden bg-white">
            <div className="h-32 bg-orange-50 flex justify-center items-center border-b border-orange-100 relative">
                <div className="absolute inset-0 opacity-10 bg-[url('/coffee-beans-pattern.png')] bg-repeat"></div>
                <div className="rounded-full bg-orange-100 p-5">
                    <AlertCircle className="h-8 w-8 text-orange-600" />
                </div>
            </div>
            <CardContent className="p-8 flex flex-col items-center">
                <h3 className="text-xl font-medium text-gray-900 mb-3 text-center">No pudimos svir tu colección</h3>
                <p className="text-gray-600 text-center text-sm max-w-xs">
                    Como cuando un barista no encuentra sus granos favoritos, estamos teniendo dificultades técnicas para servirte la experiencia completa.
                </p>
                <button
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all shadow-sm font-medium text-sm flex items-center gap-2"
                    onClick={() => window.location.reload()}
                >
                    <Coffee className="h-4 w-4" />
                    <span>Reintentar</span>
                </button>
            </CardContent>
        </Card>
    </div>
    )

}