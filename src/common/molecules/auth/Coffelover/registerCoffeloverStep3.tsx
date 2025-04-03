import { pageVariants } from "@/common/atoms/auth/pageVariants";
import { InputPassword } from "@/common/atoms/input-passwork";
import { Label } from "@radix-ui/react-label";
import { UseFormRegister } from "react-hook-form";
import { motion } from "framer-motion";

interface RegisterCoffeloverStep3Props {
  register: UseFormRegister<any>;
  direction: number;
  errors: any;
}

const RegisterCoffeloverStep3 = ({ register, errors, direction }: RegisterCoffeloverStep3Props) => {

  return (
    <motion.div
      key="step3"
      custom={direction}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="absolute w-full"
      style={{ perspective: "1000px" }}
    >
      <div className="space-y-4 m-3">
        <div className="space-y-2">
          <Label htmlFor="password">Crea tu contraseña</Label>
          <InputPassword
            id="password"
            placeholder="Contraseña"
            className={`text-gray-500 bg-white/60 shadow-sm focus:shadow-md border ${errors?.password ? "border-red-500" : "focus:border-amber-500 border-gray-300"
              } rounded-lg`}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirma tu contraseña</Label>
          <InputPassword
            id="confirmPassword"
            placeholder="Confirma tu contraseña"
            className={`text-gray-500 bg-white/60 shadow-sm focus:shadow-md border ${errors.confirmPassword ? "border-red-500" : "focus:border-amber-500 border-gray-300"
              } rounded-lg`}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default RegisterCoffeloverStep3;