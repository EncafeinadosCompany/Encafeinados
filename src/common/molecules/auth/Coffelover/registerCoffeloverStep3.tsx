import { RegisterCoffelover } from "@/api";
import { InputPassword } from "@/common/atoms/input-passwork";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { UseFormRegister } from "react-hook-form";

interface RegisterCoffeloverStep3Props {
    register: UseFormRegister<any>;
    errors: any;
    passwordsMatch: boolean;
    setPasswordsMatch: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterCoffeloverStep3 = ({ register, errors, passwordsMatch , setPasswordsMatch }: RegisterCoffeloverStep3Props) => {
    
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
 

    const validatePasswords = () => {
      if (password === "" || confirmPassword === "") {
          setPasswordsMatch(true); // No mostrar error si aún no se han ingresado valores
          return;
      }
      setPasswordsMatch(password === confirmPassword);
  };
  
  useEffect(() => {
      validatePasswords();
  }, [password, confirmPassword]);

   
    return(

    <div className="space-y-4 m-3">
      <div className="space-y-2">
        <div className="space-y-2">
          <Label htmlFor="password">Crea tu contraseña</Label>
          <InputPassword
            id="password"
            placeholder="Contraseña"
            className="text-gray-500 bg-white/60 shadow-sm focus:shadow-md border focus:border-amber-500 border-gray-300 rounded-lg"
            {...register("userData.password")}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePasswords();
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirma tu contraseña</Label>
          <InputPassword
            id="confirmPassword"
            placeholder="Confirma tu contraseña"
            className={`text-gray-500 bg-white/60 shadow-sm focus:shadow-md border ${!passwordsMatch ? 'border-red-500' : 'focus:border-amber-500 border-gray-300'} rounded-lg`}
            {...register("userData.confirmPassword")}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              validatePasswords();
            }}
          />
          {!passwordsMatch && (
            <p className="text-red-500 text-sm mt-1">Las contraseñas no coinciden</p>
          )}
        </div>
      </div>
      </div>
    )
}

export default RegisterCoffeloverStep3;