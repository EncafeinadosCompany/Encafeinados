import { Attribute } from "@/api/types/attributes/attributes.type"
import { Button } from "@/common/ui/button"
import { Checkbox } from "@/common/ui/checkbox"
import { Label } from "@/common/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/common/ui/popover"
import { AlertCircle, Check, ChevronDown } from "lucide-react"



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
                    className="w-full md:w-[300px] justify-between rounded-full border-gray-400 bg-gray-50/50"
                >
                    {selectedOptions.length > 0
                        ? `${selectedOptions.length} elemento(s) seleccionado(s)`
                        : "Seleccionar atributos para añadir"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-2 bg-white shadow-lg border border-amber-100" align="start">
                <div className="p-2">
                    {availableOptions.length > 0 ? (
                        availableOptions.map((option) => (
                            <div
                                key={option.id}
                                className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded cursor-pointer"
                                onClick={() => handleMultiSelectChange({ id: option.id, name: option.name })}
                            >
                                <Checkbox
                                    id={`option-${option.id}`}
                                    checked={selectedOptions.some(item => item.id === option.id)}
                                    onCheckedChange={() => handleMultiSelectChange({ id: option.id, name: option.name })}
                                />
                                <Label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
                                    {option.name}
                                </Label>
                                {selectedOptions.some(item => item.id === option.id) && <Check className="h-4 w-4 text-green-700" />}
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center flex flex-col items-center gap-2 text-slate-500 ">
                            <AlertCircle className="h-5 w-5" />
                            <p>Todos los elementos ya están en el canvas</p>
                        </div>
                    )}
                </div>
                {availableOptions.length > 0 && (
                    <div className="border-t border-gray-300 p-2 flex justify-end">
                        <Button
                            size="sm"
                            className="mx-auto text-white rounded-md bg-amber-600 hover:bg-amber-700"
                            onClick={handleAddSelectedOptions}
                            disabled={selectedOptions.length === 0}>
                            Añadir al canvas
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}