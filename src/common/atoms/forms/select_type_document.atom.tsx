import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/ui/select"
import { documentTypeList } from "@/common/utils/lists/type_document.utils"
import { Select } from "@radix-ui/react-select"

interface selectTypeDocumentProps {
    onValueChange?: (value: string) => void | undefined
    value: string | undefined
    className?: string | undefined
}
const SelectTypeDocument = ({ onValueChange, value, className }: selectTypeDocumentProps) => {
    return (
        <Select
            onValueChange={onValueChange}
            value={value}>
            <SelectTrigger
                data-testid="type-document-select"
                id="type_document"
                className={`w-full p-5 text-gray-500 bg-white/60 shadow-sm focus:shadow-md border focus:border-amber-500 border-gray-300 ${className}`}
            >
                <SelectValue placeholder="Selecciona tipo" />
            </SelectTrigger>
            <SelectContent>
                {documentTypeList.map((documentType) => {
                    return (
                        <SelectItem data-testid={`type-document-option-${documentType.clave}`} role="option" key={documentType.clave} value={documentType.clave.toString()}>
                            {documentType.description}
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}

export default SelectTypeDocument