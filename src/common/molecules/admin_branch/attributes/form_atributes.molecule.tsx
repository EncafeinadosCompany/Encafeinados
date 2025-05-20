import { Button } from "@/common/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/common/ui/form"
import { Input } from "@/common/ui/input"
import { AttributeFormType, RegisterAttributeSchema } from "@/common/utils/schemas/attributes/create_attributes.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Coffee, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Attribute, RegisterAttibute } from "@/api/types/attributes/attributes.type"
import { DialogContent, DialogHeader, DialogTitle } from "@/common/ui/dialog"



interface form_atributes_props {
    selectedAttributes: RegisterAttibute[]
    setSelectedAttributes: React.Dispatch<React.SetStateAction<RegisterAttibute[]>>
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    attributes: Attribute[]
    getTypeLabel: (type: string) => string
    onSubmit: (data: AttributeFormType) => void
    method: ReturnType<typeof useForm<AttributeFormType>>
}

export const FormAttributes = ({ method, attributes, onSubmit, getTypeLabel, selectedAttributes, setIsDialogOpen, setSelectedAttributes }: form_atributes_props) => {


    return (
        <DialogContent className="bg-white/95 backdrop-blur-sm border-2 border-[#D4A76A]/20 shadow-xl rounded-xl max-w-2xl">
            <DialogHeader>
                <DialogTitle className="text-[#6F4E37] text-xl font-bold flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-[#D4A76A]" />
                    {selectedAttributes.length === 1
                        ? `¿Cuenta con ${getTypeLabel(selectedAttributes[0].type)}?`
                        : "Configurar atributos seleccionados"}
                </DialogTitle>
            </DialogHeader>
            <motion.div
                className="py-2 overflow-y-auto max-h-[410px] p-3"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Form {...method}>
                    <form onSubmit={method.handleSubmit(onSubmit)} className="space-y-4">
                        {selectedAttributes.map((attr, index) => (
                            <FormField
                                key={attr.id}
                                control={method.control}
                                name={`values.${index}.value`}
                                render={({ field, formState }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#6F4E37] font-medium">
                                            {getTypeLabel(attr.type)}
                                        </FormLabel>
                                        <p className="text-sm text-gray-500 mb-2">
                                            {attributes.find(e => e.name === attr.type)?.description}
                                        </p>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder={`Ingresa el valor para ${getTypeLabel(attr.type)}`}
                                                className={`border-2 ${formState.errors.values?.[index]
                                                    ? "border-red-800 focus:border-red-800"
                                                    : "border-[#D4A76A]/30 focus:border-[#D4A76A]"
                                                    }`}
                                            />
                                        </FormControl>
                                        {formState.errors.values?.[index]?.value?.message && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="bg-red-50 text-red-600 px-3 py-2 rounded-md flex items-center gap-2 mt-2 border border-red-200"
                                            >
                                                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                                <span className="text-sm text-red-500">
                                                    {formState.errors.values[index].value?.message}
                                                </span>
                                            </motion.div>
                                        )}

                                    </FormItem>
                                )}
                            />
                        ))}
                        <div className="flex justify-between items-center pt-4 mt-6 border-t border-[#D4A76A]/20">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsDialogOpen(false)
                                    setSelectedAttributes([])
                                }}
                                className="bg-white hover:bg-gray-50 border-2 border-[#D4A76A] text-[#6F4E37] transition-all duration-200"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-[#43765C] to-[#386048] hover:from-[#386048] hover:to-[#2D4F3B] text-white shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                <Coffee className="h-4 w-4 mr-2" />
                                {selectedAttributes.length === 1 ? 'Guardar' : 'Guardar todos'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </motion.div>
        </DialogContent>
    )
}