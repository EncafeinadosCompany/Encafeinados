import { TextError } from "@/common/atoms/forms/text_error.atom";
import { TermsDialog } from "@/common/molecules/auth/terms_dialog.molecule";
import { Checkbox } from "@/common/ui/checkbox";
import { useState } from "react";
import { Controller } from "react-hook-form";


interface TermConditionsProps {
  register: any;
  errors: any;
  control: any;
}

export default function TermConditions({ errors, control }: TermConditionsProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Controller
        control={control}
        name="conditions"
        rules={{
          validate: (value) => value || "Debes aceptar los términos y condiciones",
        }}
        render={({ field: { value, onChange } }) => (
          <>
            <div className="flex items-start space-x-2 mt-4">
              <Checkbox
                id="terms"
                data-testid="conditions-checkbox"
                checked={!!value}
                onCheckedChange={onChange}
                className="border-[#D4A76A] text-[#6F4E37] mt-0.5 cursor-pointer"
              />
              <span className="text-xs sm:text-sm  text-gray-700 leading-tight">
                He leído y acepto los{" "}
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className=" underline underline-offset-4 hover:text-amber-600"
                >
                  Términos de servicio y {" "} Política de privacidad
                </button>.
              </span>
            </div>
            <TermsDialog
              open={open}
              onOpenChange={setOpen}
              checked={!!value}
              onCheckedChange={onChange}
              onAccept={() => {
                onChange(true); 
                setOpen(false);
              }}
            />

            <div className="mt-3">
            {errors.conditions && (
              <TextError>
                {errors.conditions.message}
              </TextError>
            )}
            </div>
          </>
        )}
      />
    </>)
}