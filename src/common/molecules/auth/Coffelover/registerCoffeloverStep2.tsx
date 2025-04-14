import { InputForm } from "@/common/atoms/auth/inputForm"
import SelectTypeDocument from "@/common/atoms/auth/selectTypeDocument"
import { Label } from "@/common/ui/label"
import { HelpCircle, X } from "@/common/ui/icons"
import { Controller, UseFormRegister } from "react-hook-form"
import { pageVariants } from "@/common/atoms/auth/pageVariants"
import { motion } from "framer-motion"
import { useRegisterFocus } from "@/common/hooks/auth/useRegisterFocus"
import { TextError } from "@/common/atoms/textError"

interface RegisterCoffeloverStep2Props {
    toggleInfo: () => void
    showInfo: boolean
    errors: any
    control: any
    direction: number
    register: UseFormRegister<any>
}

const RegisterCoffeloverStep2 = ({ toggleInfo, showInfo, register, errors, control, direction }: RegisterCoffeloverStep2Props) => {

    const { focusedField, registerWithFocus } = useRegisterFocus();

    return (
        <motion.div
            key="step2"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="p-1 w-full"
            style={{ perspective: "1000px" }}
        >
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
                    <Controller
                        control={control}
                        name="type_document"
                        render={({ field }) => (
                            <div className="space-y-2">
                                <Label htmlFor="documentType" className="text-xs text-gray-600">
                                    Tipo de Documento
                                </Label>
                                <SelectTypeDocument
                                    className="rounded-full"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                />
                            </div>
                        )} />
                    {errors?.type_document && <TextError>{errors.type_document.message}</TextError>}
                    <div className="space-y-2">

                    <Label htmlFor="number_document" className={`flex items-center text-xs transition-colors ${focusedField === "number_document" ? "text-[#DB8935] " : "text-gray-600" }`}>Número de documendo</Label>
                        <InputForm
                            id="number_document"
                            type="number"
                            {...register("number_document")}
                            {...registerWithFocus("number_document")}
                            placeholder="Ingresa tu número de documento"
                        />
                        {errors?.number_document && <TextError>{errors.number_document.message}</TextError>}
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="phone_number" className={`flex items-center text-xs transition-colors ${focusedField === "phone_number" ? "text-[#DB8935] " : "text-gray-600" }`}>Número de teléfono</Label>
                        <InputForm
                            id="phone_number"
                            type="tel"
                            {...register("phone_number")}
                            {...registerWithFocus("phone_number")}
                            placeholder="Número de teléfono"
                        />
                        {errors?.phone_number && <TextError>{errors.phone_number.message}</TextError>}
                    </div>
                </div>

            </div>
        </motion.div>

    )
}

export default RegisterCoffeloverStep2