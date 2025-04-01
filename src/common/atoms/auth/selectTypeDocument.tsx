import React from "react";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/ui/select"
import { documentTypeList } from "@/common/utils/lists/typeDocument"
import { Select } from "@radix-ui/react-select"

interface selectTypeDocumentProps {
    onValueChange?: (value: string) => void | undefined
    value: string | undefined
}
const SelectTypeDocument = ({ onValueChange, value, ...props }: selectTypeDocumentProps) => {
    return (
        <Select
            onValueChange={onValueChange}
            value={value}
            {...props} >
            <SelectTrigger
                data-testid="type-document-select"
                id="type_document"
                className="w-full text-gray-500 bg-white/60 shadow-sm focus:shadow-md border focus:border-amber-500 border-gray-300"
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