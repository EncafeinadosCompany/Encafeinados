import { Button } from "@/common/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/common/ui/form"
import { Input } from "@/common/ui/input"
import { AttributeFormType } from "@/common/utils/schemas/attributes/create_attributes.schema"
import { AlertCircle, Coffee } from '@/common/ui/icons'
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Attribute, RegisterAttibute } from "@/api/types/attributes/attributes.type"
import { DialogContent, DialogHeader, DialogTitle } from "@/common/ui/dialog"
import { NumericFormat } from "react-number-format"


interface form_atributes_props {
    selectedAttributes: RegisterAttibute[]
    setSelectedAttributes: React.Dispatch<React.SetStateAction<RegisterAttibute[]>>
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    attributes: Attribute[]
    getTypeLabel: (type: number) => string | number
    onSubmit: (data: AttributeFormType) => void
    method: ReturnType<typeof useForm<AttributeFormType>>
}

export const FormAttributes = ({ method, attributes, onSubmit, getTypeLabel, selectedAttributes, setIsDialogOpen, setSelectedAttributes }: form_atributes_props) => {


    return (
        <DialogContent className=" w-full max-w-5xl bg-white/95  border-none shadow-xl rounded-2xl">
            <div className="w-full flex flex-col items-center">
                <div className="flex justify-between items-center mb-6">
                    <DialogHeader>
                        <DialogTitle className="text-[#2C1810] text-xl font-semibold flex items-center gap-3">
                            <div className="bg-[#6F4E37]/10 p-2 rounded-lg">
                                <Coffee className="h-5 w-5 text-[#6F4E37]" />
                            </div>
                            {selectedAttributes.length === 1
                                ? `Configurar ${getTypeLabel(selectedAttributes[0].attributeId)}`
                                : "Configurar atributos"}
                        </DialogTitle>
                    </DialogHeader>

                </div>

                <div className="border-b border-gray-100 pb-4">
                    <p className="text-gray-500 text-sm">
                        Complete la información solicitada para cada atributo seleccionado.
                    </p>
                </div>
            </div>

            <motion.div
                className="py-1 overflow-y-auto max-h-[460px] pr-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Form {...method}>
                    <form onSubmit={method.handleSubmit(onSubmit)} className="space-y-6">
                        <div className={`grid gap-4 ${selectedAttributes.length > 1
                            ? "md:grid-cols-2 grid-cols-1"
                            : "grid-cols-1"
                            }`}>
                            {selectedAttributes.map((attr, index) => (
                                <FormField
                                    key={attr.id}
                                    control={method.control}
                                    name={`values.${index}.value`}
                                    render={({ field, formState }) => {
                                        const currentAttribute = attributes.find(e => e.id === attr.attributeId);


                                        return (
                                            <FormItem className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 relative">
                                                <FormLabel className="text-[#2C1810] font-medium text-base mb-1 block">
                                                    ¿Cuenta con {getTypeLabel(attr.attributeId)}?
                                                </FormLabel>
                                                <p className="text-sm text-gray-500 mb-3">
                                                    {currentAttribute?.description}
                                                </p>
                                                {currentAttribute?.requires_response === false &&
                                                    <span className="text-green-600 absolute top-2 right-5 bg-green-200 w-fit px-3 rounded-full">Si</span>
                                                }
                                                <FormControl>
                                                    {currentAttribute?.requires_response && (
                                                        currentAttribute.name === "Rango de Precio" ? (
                                                            <div className="flex gap-2 items-center">
                                                             <div className="flex flex-col w-full">
                                                                <p>Precio Minimo</p>
                                                                   <NumericFormat
                                                                    prefix="$"
                                                                    thousandSeparator="."
                                                                    decimalSeparator=","
                                                                    allowNegative={false}
                                                                    placeholder="$0"
                                                                    className="pl-3 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-[#DB8935] focus:border-[#DB8935] transition placeholder-slate-400 sm:text-sm"
                                                                    onValueChange={({ value }) => {
                                                                        const min = `$${new Intl.NumberFormat('es-CO').format(Number(value))}`;
                                                                        const max = field.value?.split('-')[1] || '';
                                                                        field.onChange(`${min}-${max}`);
                                                                    }}
                                                                    value={field.value?.split('-')[0]?.replace(/\D/g, '') || ''}
                                                                />
                                                             </div>
                                                                <span className="text-gray-500">-</span>

                                                               <div className="w-full">
                                                                <p>Precio Máximo</p>
                                                                 <NumericFormat
                                                                    prefix="$"
                                                                    thousandSeparator="."
                                                                    decimalSeparator=","
                                                                    allowNegative={false}
                                                                    placeholder="$0"
                                                                    className="pl-3 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-[#DB8935] focus:border-[#DB8935] transition placeholder-slate-400 sm:text-sm"
                                                                    onValueChange={({ value }) => {
                                                                        const min = field.value?.split('-')[0] || '';
                                                                        const max = `$${new Intl.NumberFormat('es-CO').format(Number(value))}`;
                                                                        field.onChange(`${min}-${max}`);
                                                                    }}
                                                                    value={field.value?.split('-')[1]?.replace(/\D/g, '') || ''}
                                                                />
                                                               </div>
                                                            </div>
                                                        ) : (
                                                            <Input
                                                                {...field}
                                                                placeholder={`Ingresa el valor para ${getTypeLabel(attr.attributeId)}`}
                                                                className="border border-gray-200 focus:border-[#6F4E37] focus:ring-[#6F4E37]/10 rounded-lg"
                                                            />
                                                        )
                                                    )}
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
                                        );
                                    }}
                                />
                            ))}
                        </div>

                        <div className="flex justify-center items-center gap-3 pt-4 mt-6 border-t border-gray-100">

                            <Button
                                type="submit"
                                disabled={method.formState.isValidating || !method.formState.isValid}
                                className="bg-[#6F4E37] w-1xl hover:bg-[#5C4130] text-white shadow-sm"
                            >
                                {selectedAttributes.length === 1 ? 'Guardar atributo' : 'Guardar todos'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </motion.div>
        </DialogContent>
    )
}