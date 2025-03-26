import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/ui/select"
import { Select } from "@radix-ui/react-select"
import { documentTypeMocks } from "@/api/mocks/typeDocumentMocks"




interface selectTypeDocumentProps {
    onValueChange?: (value: string) => void | undefined
    value: string | undefined
}


const SelectTypeDocument = ({onValueChange, value, ...props}: selectTypeDocumentProps) => {

    console.log(value)
   return(
    <Select
    onValueChange={onValueChange}
    value={value}
    {...props} >
    <SelectTrigger
        id="type_document"
        className="w-full text-gray-500 bg-white/60 shadow-sm focus:shadow-md border focus:border-amber-500 border-gray-300"
    >
        <SelectValue placeholder="Selecciona tipo" />
    </SelectTrigger>
    <SelectContent>
        {documentTypeMocks.map((documentType) => {
            return (
                <SelectItem key={documentType.clave} value={documentType.clave.toString()}>
                    {documentType.description}
                </SelectItem>
            )
        })}
    </SelectContent>
</Select>
   )
}


export default SelectTypeDocument