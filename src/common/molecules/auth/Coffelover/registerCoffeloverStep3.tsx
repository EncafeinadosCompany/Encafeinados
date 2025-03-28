import { InputPassword } from "@/common/atoms/input-passwork";
import { Label } from "@radix-ui/react-label";
import {UseFormRegister } from "react-hook-form";

interface RegisterCoffeloverStep3Props {
  register: UseFormRegister<any>;
  errors: any;
}

const RegisterCoffeloverStep3 = ({ register, errors }: RegisterCoffeloverStep3Props) => {

  return (
    <div className="space-y-4 m-3">
      <div className="space-y-2">
        <Label htmlFor="password">Crea tu contraseña</Label>
        <InputPassword
          id="password"
          placeholder="Contraseña"
          className={`text-gray-500 bg-white/60 shadow-sm focus:shadow-md border ${errors.userData?.password ? "border-red-500" : "focus:border-amber-500 border-gray-300"
            } rounded-lg`}
          {...register("userData.password")}
        />
        {errors.userData?.password && (
          <p className="text-red-500 text-sm mt-1">{errors.userData.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirma tu contraseña</Label>
        <InputPassword
          id="confirmPassword"
          placeholder="Confirma tu contraseña"
          className={`text-gray-500 bg-white/60 shadow-sm focus:shadow-md border ${errors.userData?.confirmPassword ? "border-red-500" : "focus:border-amber-500 border-gray-300"
            } rounded-lg`}
          {...register("userData.confirmPassword")}
        />
        {errors.userData?.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.userData.confirmPassword.message}</p>
        )}
      </div>
    </div>
  )
}

export default RegisterCoffeloverStep3;