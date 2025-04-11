import { Label } from "@radix-ui/react-select"

interface LabelFormProps {
    focusedField: string | null
    input: string
    colorText: string
    children: React.ReactNode | React.ReactNode[] | null

}

export const LabelForm = ({focusedField, input, colorText, children}:LabelFormProps)=>{
    return(
        <Label className={`flex items-center text-xs transition-colors ${focusedField} === ${input} ? "text-[${colorText}]" : "text-gray-600"}`}>
            {children}
        </Label>

    )
}