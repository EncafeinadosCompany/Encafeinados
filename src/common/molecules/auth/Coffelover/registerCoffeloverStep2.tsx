import { Input } from "@/common/ui/input"
import { Label } from "@/common/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/ui/select"
import { HelpCircle, X } from "lucide-react"
import { Controller, UseFormRegister } from "react-hook-form"



interface RegisterCoffeloverStep2Props {
    toggleInfo: () => void
    showInfo: boolean
    errors: any
    control: any
    register: UseFormRegister<any>
}

const RegisterCoffeloverStep2 = ({ toggleInfo, showInfo, register, errors, control }: RegisterCoffeloverStep2Props) => {

    return (
        <div className="space-y-6 m-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative">
                    <button
                        type="button"
                        onClick={toggleInfo}
                        className="inline-flex items-center text-gray-500 hover:text-amber-600"
                        aria-label="Información sobre el tipo de documento"
                        aria-expanded={showInfo}
                    >
                        <HelpCircle className="h-4 w-4 mr-1" />
                        <span className="text-xs">¿Por qué lo solicitamos?</span>
                    </button>

                    {showInfo && (
                        <div className="absolute z-10 bg-white text-gray-700 p-3 rounded-lg shadow-lg w-64 text-sm mt-1 left-0 sm:left-auto border border-gray-300">
                            <p className="text-sm">
                                Solicitamos esta información para mejorar la gestión de puntos y stickers en tu cuenta. Puedes
                                modificar estos datos una vez inicies sesión.
                            </p>
                            <button
                                onClick={toggleInfo}
                                className="mt-2 text-xs text-amber-600 hover:text-amber-800 flex items-center"
                            >
                                <X className="h-3 w-3 mr-1" />
                                Cerrar
                            </button>
                        </div>
                    )}
                </div>

            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>

                    <Controller
                        control={control}
                        name="personData.type_document_id"
                        render={({ field }) => (
                            <div>
                                <Label htmlFor="documentType" className="text-sm font-medium">
                                    Tipo de Documento
                                </Label>

                                <Select onValueChange={field.onChange} value={field.value} >
                                    <SelectTrigger
                                        id="type_document"
                                        className="w-full text-gray-500 bg-white/60 shadow-sm focus:shadow-md border focus:border-amber-500 border-gray-300"
                                    >
                                        <SelectValue placeholder="Selecciona tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Selecciona tipo</SelectItem>
                                        <SelectItem value="1">Cédula de Ciudadanía (CC)</SelectItem>
                                        <SelectItem value="2">NIT</SelectItem>
                                        <SelectItem value="3">Tarjeta de Identidad (TI)</SelectItem>
                                    </SelectContent>
                                </Select>

                            </div>
                        )} />
                    {errors?.personData?.type_document_id && <p className="text-red-500">{errors.personData.type_document_id.message}</p>}
                </div>

                <div>

                    <Label htmlFor="document_number" className="text-sm items-end font-medium">
                        Número de Documento
                    </Label>
                    <Input
                        id="number_document"
                        type="number"
                        {...register("personData.number_document")}
                        placeholder="Ingres tu número de documento"
                        className=" appearance-none text-gray-500 bg-white/60 shadow-sm focus:shadow-md border focus:border-amber-500 border-gray-300"
                    />
                    {errors?.personData?.number_document && <p className="text-red-500">{errors.personData.number_document.message}</p>}
                </div>
                <div>
                    <Label htmlFor="phone_number" className="text-sm font-medium">
                        Teléfono / Celular
                    </Label>

                    <Input
                        id="phone_number"
                        type="tel"
                        {...register("personData.phone_number")}
                        placeholder="Número de teléfono"
                        className="text-gray-500 bg-white/60 shadow-sm focus:shadow-md border focus:border-amber-500 border-gray-300"
                    />
                    {errors?.personData?.phone_number && <p className="text-red-500">{errors.personData.phone_number.message}</p>}
                </div>
            </div>

        </div>

    )
}

export default RegisterCoffeloverStep2