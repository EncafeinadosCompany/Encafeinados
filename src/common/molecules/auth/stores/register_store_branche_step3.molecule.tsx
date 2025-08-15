import { InputForm } from "@/common/atoms/forms/input_form.atom";
import { useRegisterFocus } from "@/common/hooks/auth/use_register_focus.hook"
import { Input } from "@/common/ui/input";
import { Label } from "@/common/ui/label"
import { Textarea } from "@/common/ui/textarea"
import { RegisterStoreBrancheSchemaType } from "@/common/utils/schemas/auth/register_store_branche.schema";
import { UseFormRegister } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/ui/card";
import { MapPin, FileText, Navigation, Plus } from "lucide-react";

interface RegisterBrancheStep3Props {
    baseAddress?: string;
    register: UseFormRegister<RegisterStoreBrancheSchemaType>;
    control?: any;
    errors?: any;
    isHead?:boolean
  }

export default function RegisterStoreBrancheStep3  ({ baseAddress, register, errors, isHead=false }: RegisterBrancheStep3Props)  {

    const {registerWithFocus, focusedField} = useRegisterFocus()

    return(
        <div className="w-full space-y-8">
            <Card className="border-0  rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm">
               {
                isHead && (
                   <CardHeader className="bg-gradient-to-br from-[#DB8935]/5 via-white to-[#8B5A2B]/5 pb-6 pt-8 relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#DB8935]/5 rounded-full -translate-y-4 translate-x-4"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#8B5A2B]/5 rounded-full translate-y-2 -translate-x-2"></div>
                    
                    <div className="relative z-10 px-6 md:px-8">
                        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-3">
                            <div className="p-2.5 bg-[#DB8935]/10 rounded-xl">
                                <MapPin className="h-6 w-6 text-[#8B5A2B]" />
                            </div>
                            Información de Dirección
                        </CardTitle>
                        <p className="text-gray-600 text-base leading-relaxed">
                            Completa los detalles de la dirección de tu sucursal para que los coffeelovers puedan encontrarte fácilmente.
                        </p>
                    </div>
                </CardHeader>

                )
               }
                <CardContent className="space-y-8 px-4 py-8 md:px-6 lg:px-8 bg-white">
                    {/* Dirección base */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-1 w-4 bg-[#DB8935] rounded-full"></div>
                            <Label className="text-lg font-semibold text-gray-800">
                                Dirección Principal
                            </Label>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-50/50 to-blue-50/30 p-6 rounded-2xl border border-blue-100">
                            <Label 
                                htmlFor="baseAddress"
                                className={`flex items-center gap-2 text-sm font-medium mb-3 transition-color text-gray-700`}
                            >
                                <MapPin className="h-4 w-4 text-blue-500" />
                                Dirección seleccionada del mapa
                            </Label>
                            <Textarea
                                id="baseAddress"
                                {...register("address")}
                                defaultValue={baseAddress}
                                readOnly
                                rows={2}
                                className="w-full border-2 border-blue-200 rounded-xl bg-blue-50/30 text-gray-600 font-medium resize-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                            />
                            {errors.address && (
                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600 font-medium">{errors.address.message as string}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Detalles de dirección */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-1 w-4 bg-[#8B5A2B] rounded-full"></div>
                            <Label className="text-lg font-semibold text-gray-800">
                                Detalles Específicos
                            </Label>
                        </div>

                        <div className="grid gap-6">
                            {/* Número y detalles */}
                            <div className="space-y-3">
                                <Label 
                                    htmlFor="addressDetails" 
                                    className={`flex items-center gap-2 text-sm font-medium transition-colors text-gray-700`}
                                >
                                    <Navigation className="h-4 w-4 text-[#8B5A2B]" />
                                    Número y detalles adicionales
                                    <span className="text-red-500 font-bold">*</span>
                                </Label>
                                <InputForm
                                    id="addressDetails"
                                    {...register("addressDetails")}
                                    placeholder="Ej. Calle 123 #45-67, Piso 2, Local 3"
                                    className="h-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#DB8935]/10 focus:border-[#DB8935] transition-all duration-200 bg-gray-50/50 focus:bg-white"
                                />
                                {errors.addressDetails && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-600 font-medium">{errors.addressDetails.message as string}</p>
                                    </div>
                                )}
                            </div>

                            {/* Referencia cercana */}
                            <div className="space-y-3">
                                <Label 
                                    htmlFor="nearbyReference"  
                                    className={`flex items-center gap-2 text-sm font-medium transition-colors text-gray-700`}
                                >
                                    <Plus className="h-4 w-4 text-gray-500" />
                                    Referencia cercana
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Opcional</span>
                                </Label>
                                <Input
                                    id="nearbyReference"
                                    {...register("nearbyReference")}
                                    placeholder="Ej. Frente a la panadería San Juan, al lado del banco"
                                    className="h-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#DB8935]/10 focus:border-[#DB8935] transition-all duration-200 bg-gray-50/50 focus:bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notas adicionales */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-1 w-4 bg-gray-400 rounded-full"></div>
                            <Label className="text-lg font-semibold text-gray-800">
                                Información Adicional
                            </Label>
                        </div>

                        <div className="bg-gradient-to-r from-gray-50/50 to-gray-50/30 p-6 rounded-2xl border border-gray-100">
                            <Label 
                                htmlFor="additionalNotes"
                                className={`flex items-center gap-2 text-sm font-medium mb-3 transition-colors text-gray-700`}
                            >
                                <FileText className="h-4 w-4 text-gray-500" />
                                Notas adicionales
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Opcional</span>
                            </Label>
                            <Textarea
                                id="additionalNotes"
                                {...register("additionalNotes")}
                                placeholder="Instrucciones especiales para entregas, puntos de referencia únicos, horarios de acceso, etc."
                                className="w-full min-h-[100px] border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#DB8935]/10 focus:border-[#DB8935] transition-all duration-200 bg-gray-50/50 focus:bg-white resize-none"
                                rows={3}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )

}