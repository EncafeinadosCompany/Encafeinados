import { InputForm } from "@/common/atoms/forms/input_form.atom"
import { TextError } from "@/common/atoms/forms/text_error.atom"
import { useRegisterFocus } from "@/common/hooks/auth/use_register_focus.hook"
import { Label } from "@/common/ui/label"
import { RegisterStoreBrancheSchemaType } from "@/common/utils/schemas/auth/register_store_branche.schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/common/ui/card"
import { Phone, Store, Coffee } from'@/common/ui/icons'
import { UseFormRegister } from "react-hook-form"

interface RegisterStoreBranchesProps {
    register: UseFormRegister<RegisterStoreBrancheSchemaType>
    error: any
    isImage?: boolean
    isHead?:boolean
}


export default function RegisterStoreBrancheStep1({ register, error, isHead=false, isImage = true}: RegisterStoreBranchesProps) {

    return (
        <div className="w-full space-y-6">
            <Card className="border-0  rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm">
               {isHead && (
                 <CardHeader className="bg-gradient-to-br from-[#DB8935]/5 via-white to-[#8B5A2B]/5 pb-6 pt-8 relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#DB8935]/5 rounded-full -translate-y-4 translate-x-4"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#8B5A2B]/5 rounded-full translate-y-2 -translate-x-2"></div>
                    
                    <div className="relative z-10 px-6 md:px-8">
                        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-3">
                            <div className="p-2.5 bg-[#DB8935]/10 rounded-xl">
                                <Store className="h-6 w-6 text-[#8B5A2B]" />
                            </div>
                            Información de la cafetería
                        </CardTitle>
                        <p className="text-gray-600 text-base leading-relaxed">
                            Registra la información básica de tu nueva cafetería para comenzar a conectar con los coffeelovers.
                        </p>
                    </div>
                </CardHeader>
               )}

                <CardContent className="px-4 py-8 md:px-6 lg:px-8 bg-white">
                    <div className={`grid gap-8 ${isImage ? "lg:grid-cols-2" : "lg:grid-cols-1"} items-start`}>
                        {/* Imagen decorativa */}
                        {isImage && (
                            <div className="relative flex items-center justify-center order-2 lg:order-1">
                                <div className="relative w-full max-w-sm mx-auto">
                                    {/* Contenedor de imagen mejorado */}
                                    <div className="relative bg-gradient-to-br from-[#DB8935]/5 to-[#8B5A2B]/5 p-8 rounded-2xl border-2 border-[#DB8935]/10">
                                        <div className="absolute top-4 right-4 w-6 h-6 bg-[#DB8935]/20 rounded-full"></div>
                                        <div className="absolute bottom-4 left-4 w-4 h-4 bg-[#8B5A2B]/20 rounded-full"></div>
                                        
                                        <img
                                            src="/cafeino.png"
                                            alt="Cafeino - Tu nueva sucursal"
                                            className="w-full h-auto object-contain rounded-lg filter drop-shadow-lg"
                                        />
                                        
                                        {/* Badge decorativo */}
                                        <div className="absolute -bottom-3 -right-3 bg-[#DB8935] text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                            <Coffee className="h-3 w-3 inline mr-1" />
                                            Nueva Cafetería
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Formulario */}
                        <div className="space-y-8 order-1 lg:order-2">
                            {/* Sección de información básica */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="h-1 w-4 bg-[#DB8935] rounded-full"></div>
                                    <Label className="text-lg font-semibold text-gray-800">
                                        Información Básica
                                    </Label>
                                </div>

                                {/* Nombre de la sucursal */}
                                <div className="space-y-3">
                                    <Label 
                                        htmlFor="branchName"
                                        className={`flex items-center gap-2 text-sm font-medium transition-colors text-gray-700
                                        `}
                                    >
                                        <Store className="h-4 w-4 text-[#8B5A2B]" />
                                        Nombre de la cafetería
                                        <span className="text-red-500 font-bold">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Store className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400 z-10" size={18} />
                                        <InputForm
                                            id="branchName"
                                            {...register('name')}
                                            className="h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#DB8935]/10 focus:border-[#DB8935] transition-all duration-200 bg-gray-50/50 focus:bg-white"
                                            placeholder="Ej. Sucursal Centro, Café Zona Rosa..."
                                        />
                                    </div>
                                    {error?.name && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <TextError>{error.name.message}</TextError>
                                        </div>
                                    )}
                                </div>

                                {/* Número de teléfono */}
                                <div className="space-y-3">
                                    <Label 
                                        htmlFor="phoneNumber"
                                        className={`flex items-center gap-2 text-sm font-medium transition-colors text-gray-700`}
                                    >
                                        <Phone className="h-4 w-4 text-[#8B5A2B]" />
                                        Número de teléfono
                                        <span className="text-red-500 font-bold">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400 z-10" size={18} />
                                        <InputForm
                                            id="phoneNumber"
                                            {...register('phone_number')}
                                            placeholder="Ej. +57 300 123 4567"
                                            className="h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#DB8935]/10 focus:border-[#DB8935] transition-all duration-200 bg-gray-50/50 focus:bg-white"
                                        />
                                    </div>
                                    {error?.phone_number && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <TextError>{error.phone_number.message}</TextError>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mensaje informativo */}
                            <div className="bg-gradient-to-r from-blue-50/50 to-blue-50/30 p-4 rounded-xl border border-blue-100">
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 bg-blue-100 rounded-lg">
                                        <Coffee className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-blue-900 mb-1">¡Estás muy cerca!</h4>
                                        <p className="text-sm text-blue-700 leading-relaxed">
                                            Esta información aparecerá en el perfil de tu cafetería y ayudará a los coffeelovers a contactarte directamente.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}