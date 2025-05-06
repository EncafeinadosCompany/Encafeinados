import { Input } from "@/common/ui/input";
import { Label } from "@/common/ui/label";
import { Textarea } from "@/common/ui/textarea";
import { InputForm } from "@/common/atoms/auth/input_form.atom";
import { useRegisterFocus } from "@/common/hooks/auth/useRegisterFocus";

interface RegisterBranchesStep3Props {
  baseAddress?: string;
  register?: any;
  control?: any;
  errors?: any;
}

export const RegisterBranchesStep3 = ({ baseAddress, register, errors }: RegisterBranchesStep3Props) => {

  const { focusedField, registerWithFocus } = useRegisterFocus()

  return (
    <div className="space-y-6 mx-auto max-w-4xl p-6 overflow-hidden">
      <div className="grid grid-cols-1 gap-5 p-2 overflow-auto">
        {/* Base Address (Read-only, obtained from map) */}
        <div className="space-y-2">
          <Label htmlFor="baseAddress"
            className={`flex items-center text-xs transition-colors ${focusedField === "address" ? "text-[#DB8935]" : ""
              }`}>
            Dirección base
          </Label>
          <Textarea
            id="baseAddress"
            {...register("address")}
            {...registerWithFocus("address")}
            defaultValue={baseAddress}
            // readOnly
            rows={2}
            className="rounded-lg text-gray-600 border shadow-sm border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#DB8935]  focus:border-transparent transition-all"
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address.message as string}</p>
          )}
        </div>

        {/* Additional details and number */}
        <div className="space-y-2">
          <Label htmlFor="addressDetails" className={`flex items-center text-xs transition-colors ${focusedField === "addressDetails" ? "text-[#DB8935]" : "text-gray-600"
            }`}>
            Número y detalles adicionales *
          </Label>
          <InputForm
            id="addressDetails"
            {...register("addressDetails")}
            {...registerWithFocus("addressDetails")}
            placeholder="Ej. Calle 123 #45-67"
            className="rounded-full text-gray-600 border border-gray-400  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"
          />
          {errors.addressDetails && (
            <p className="text-sm text-red-500">{errors.addressDetails.message as string}</p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4">

          {/* Nearby reference */}

          <div className="space-y-2">
            <Label htmlFor="nearbyReference" className={`flex items-center text-xs transition-colors ${focusedField === "nearbyReference" ? "text-[#DB8935]" : "text-gray-600"
              }`}>
              Referencia cercana (Opcional)
            </Label>
            <Input
              id="nearbyReference"
              {...register("nearbyReference")}
              {...registerWithFocus("nearbyReference")}
              placeholder="Ej. Frente a la panadería"
              className="rounded-full text-gray-600 border border-gray-400  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="additionalNotes" className={`flex items-center text-xs transition-colors ${focusedField === "additionalNotes" ? "text-[#DB8935]" : "text-gray-600"
            }`}>
            <span className="mr-2">📜</span> Notas adicionales (Opcional)
          </Label>
          <Textarea
            id="additionalNotes"
            {...register("additionalNotes")}
            {...registerWithFocus("additionalNotes")}
            placeholder="Instrucciones especiales para la entrega, puntos de referencia, etc."
            className="rounded-md text-gray-400 border border-gray-400  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"
            rows={2} />
        </div>
      </div>
    </div>
  );
};