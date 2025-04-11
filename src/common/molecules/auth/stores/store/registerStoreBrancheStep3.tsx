import { InputForm } from "@/common/atoms/auth/inputForm";
import { useRegisterFocus } from "@/common/hooks/auth/useRegisterFocus"
import { Input } from "@/common/ui/input";
import { Label } from "@/common/ui/label"
import { Textarea } from "@/common/ui/textarea"
import { RegisterStoreBrancheSchemaType } from "@/common/utils/schemas/auth/registerStoreBrancheSchema";
import { UseFormRegister } from "react-hook-form";


interface RegisterBrancheStep3Props {
    baseAddress?: string;
    register: UseFormRegister<RegisterStoreBrancheSchemaType>;
    control?: any;
    errors?: any;
  }

export default function RegisterStoreBrancheStep3  ({ baseAddress, register, errors }: RegisterBrancheStep3Props)  {

    const {registerWithFocus, focusedField} = useRegisterFocus()

    return(
        <div className="space-y-6 mx-auto max-w-4xl p-1 overflow-hidden">
        <div className="grid grid-cols-1 gap-5 p-2 overflow-auto">
          <div className="space-y-2">
            <Label htmlFor="baseAddress"
             className={`flex items-center text-xs transition-colors ${
                focusedField === "address" ? "text-[#DB8935]" : ""
              }`}>
               Dirección base
            </Label>
            <Textarea
              id="baseAddress"
              {...registerWithFocus("address", register)}
              defaultValue={baseAddress}
              readOnly
              rows={2}
              className="rounded-lg text-gray-400 border shadow-sm border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#DB8935]  focus:border-transparent transition-all"
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message as string}</p>
            )}
          </div>
    
          <div className="space-y-2">
            <Label htmlFor="addressDetails" className={`flex items-center text-xs transition-colors ${
                focusedField === "addressDetails" ? "text-[#DB8935]" : "text-gray-600"
              }`}>
              Número y detalles adicionales *
            </Label>
            <InputForm
              id="addressDetails"
              {...registerWithFocus("addressDetails", register)}
              placeholder="Ej. Calle 123 #45-67"
              className="rounded-full text-gray-400 border border-gray-400  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"
            />
            {errors.addressDetails && (
              <p className="text-sm text-red-500">{errors.addressDetails.message as string}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4">
    
            <div className="space-y-2">
              <Label htmlFor="nearbyReference"  className={`flex items-center text-xs transition-colors ${
                focusedField === "nearbyReference" ? "text-[#DB8935]" : "text-gray-600"
              }`}>
                 Referencia cercana (Opcional)
              </Label>
              <Input
                id="nearbyReference"
                {...registerWithFocus("nearbyReference", register)}
                placeholder="Ej. Frente a la panadería"
                className="rounded-full text-gray-400 border border-gray-400  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"
              />
            </div>
          </div>
    
          {/* Additional notes (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="additionalNotes"className={`flex items-center text-xs transition-colors ${
                focusedField === "additionalNotes" ? "text-[#DB8935]" : "text-gray-600"
              }`}>
              <span className="mr-2">📜</span> Notas adicionales (Opcional)
            </Label>
            <Textarea
              id="additionalNotes"
              {...registerWithFocus("additionalNotes", register)}
              placeholder="Instrucciones especiales para la entrega, puntos de referencia, etc."
              className="rounded-md text-gray-400 border border-gray-400  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"
              rows={2}/>
          </div>
        </div>
      </div>
    )

}