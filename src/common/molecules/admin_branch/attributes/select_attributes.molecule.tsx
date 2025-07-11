import { Attribute } from "@/api/types/attributes/attributes.type"
import { Button } from "@/common/ui/button"
import { Label } from "@/common/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/common/ui/popover"
import { AlertCircle, Check, ChevronDown } from'@/common/ui/icons'



interface AttributeProps {
    isMultiSelectOpen: boolean
    setIsMultiSelectOpen: (value: boolean) => void
    selectedOptions: Attribute[]
    setSelectedOptions: (attribute:Attribute[]) => void
    availableOptions: Attribute[]
    handleMultiSelectChange: (option:Attribute) => void
    handleAddSelectedOptions: () => void
}


export const SelectAttributes = ({ isMultiSelectOpen, setIsMultiSelectOpen, selectedOptions, handleMultiSelectChange, availableOptions, handleAddSelectedOptions }: AttributeProps) => {
    return (
        <Popover open={isMultiSelectOpen} onOpenChange={setIsMultiSelectOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isMultiSelectOpen}
                    className="w-full md:w-[600px] justify-between rounded-xl border-[#E5E7EB] bg-white hover:bg-[#FDF8F3] transition-colors duration-200 shadow-sm"
                >
                    <div className="flex items-center gap-2">
                        <div className="bg-[#6F4E37]/10 p-1.5 rounded-md">
                            <Check className="h-4 w-4 text-[#6F4E37]" />
                        </div>
                        <span className="text-[#2C1810]">
                            {selectedOptions.length > 0
                                ? `${selectedOptions.length} atributo${selectedOptions.length > 1 ? 's' : ''} seleccionado${selectedOptions.length > 1 ? 's' : ''}`
                                : "Seleccionar atributos"}
                        </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-[#6F4E37]" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-3 bg-white shadow-lg border-none rounded-xl" align="start">
                <div className="space-y-1">
                    {availableOptions.length > 0 ? (
                        availableOptions.map((option, index) => (
                            <div
                                key={option.id}
                                className="flex items-center space-x-2 p-2.5 hover:bg-[#FDF8F3] rounded-lg cursor-pointer transition-colors duration-200"
                                onClick={() => handleMultiSelectChange({ id: option.id, name: option.name })}
                            >
                                {/* <Checkbox
                                    id={`option-${option.id}`}
                                    checked={selectedOptions.some(item => item.id === option.id)}
                                    onCheckedChange={() => handleMultiSelectChange({ id: option.id, name: option.name })}
                                    className="border-[#6F4E37]/30 data-[state=checked]:bg-[#6F4E37] data-[state=checked]:border-[#6F4E37]"
                                /> */}
                                <p className="text-gray-400 text-xs ">
                                    {index + 1}.
                                </p>
                                <Label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer text-[#2C1810] font-medium">
                                    {option.name}
                                </Label>
                                {selectedOptions.some(item => item.id === option.id) && (
                                    <Check className="h-4 w-4 text-[#6F4E37]" />
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center flex flex-col items-center gap-3 text-[#6B7280]">
                            <div className="bg-[#FDF8F3] p-3 rounded-full">
                                <AlertCircle className="h-5 w-5 text-[#6F4E37]" />
                            </div>
                            <p className="text-sm">Todos los atributos están en uso</p>
                        </div>
                    )}
                </div>
                {availableOptions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                        <Button
                            size="sm"
                            className="w-full bg-[#6F4E37] hover:bg-[#5C4130] text-white rounded-lg transition-colors duration-200"
                            onClick={handleAddSelectedOptions}
                            disabled={selectedOptions.length === 0}
                        >
                            Añadir atributos
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}