import { pageVariants } from "@/common/atoms/forms/page_variants.atom";

import { Label } from "@radix-ui/react-label";
import { UseFormRegister } from "react-hook-form";
import { motion } from "framer-motion";
import { TextError } from "@/common/atoms/forms/text_error.atom";
import { useRegisterFocus } from "@/common/hooks/auth/use_register_focus.hook";
import { InputPassword } from "@/common/atoms/forms/input_passwork";

interface RegisterCoffeloverStep3Props {
  register: UseFormRegister<any>;
  direction: number;
  errors: any;
}

const RegisterCoffeloverStep3 = ({ register, errors, direction }: RegisterCoffeloverStep3Props) => {
  const { focusedField, registerWithFocus } = useRegisterFocus();

  return (
    <motion.div
      key="step3"
      custom={direction}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="pb-6 w-full"
      style={{ perspective: "1000px" }}
    >
      <div className="space-y-4 m-3 space-x-2  grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
        <Label htmlFor="password" className={`flex items-center text-xs transition-colors ${focusedField === "password" ? "text-[#DB8935] " : "text-gray-600" }`}>Crea tu PIN</Label>
          <InputPassword
            id="password"
            placeholder="Contraseña"
            className={`text-gray-500 border ${errors?.password ? "border-red-500" : "focus:border-amber-500 border-gray-300"
              } rounded-full`}
              {...register("password")}
            {...registerWithFocus("password")}
          />
          {errors.password && (
            <TextError>{errors.password.message}</TextError>
          )}
        </div>

        <div className="space-y-2">
        <Label htmlFor="confirmPassword" className={`flex items-center text-xs transition-colors ${focusedField === "confirmPassword" ? "text-[#DB8935] " : "text-gray-600" }`}>Confirma tu PIN</Label>
          <InputPassword
            id="confirmPassword"
            placeholder="Confirma tu PIN"
            className={`text-gray-500 border ${errors.confirmPassword ? "border-red-500" : "focus:border-amber-500 border-gray-300 "
              }rounded-full`}
              {...register("confirmPassword")}
            {...registerWithFocus("confirmPassword")}
          />
          {errors.confirmPassword && (
            <TextError>{errors.confirmPassword.message}</TextError>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default RegisterCoffeloverStep3;