import { Button } from "@/common/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/common/ui/card"
import { CheckCircle, Mail, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"


export default function CardSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-orange-100 to-orange-300 sm:to-orange-300/80 p-4">
    <Card className="w-full max-w-md border-none shadow-2xl bg-white/60 rounded-xl">
      <CardHeader className="text-center pt-8">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 shadow-md">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-green-700">¡Proceso completado con éxito!</CardTitle>
      </CardHeader>
      <CardContent className="text-center px-6">
        <p className="mb-5 text-gray-600 font-medium text-lg">Hemos recibido tu información correctamente.</p>
        <div className="mb-6 rounded-lg bg-[#f8f4e9]/70 p-5 text-sm shadow-sm">
          <div className="flex items-center">
            <Mail className="mr-2 h-5 w-5 text-green-800" />
            <span className="font-semibold text-green-800">Importante:</span>
          </div>
          <p className="mt-2 text-gray-700 px-3 leading-relaxed">
            Por favor, esté pendiente de su correo electrónico para recibir información adicional y los siguientes
            pasos a seguir.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-8">
        <Link to="/">
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Button>
        </Link>
      </CardFooter>
    </Card>
  </div>
  )
}
