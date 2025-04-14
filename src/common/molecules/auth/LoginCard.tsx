import { Button } from "@/common/ui/button"
import { Card, CardContent } from "@/common/ui/card"
import { Link } from "react-router-dom"
import { InputEmail } from "@/common/atoms/Input-email"
import { Label } from "@/common/ui/label"
import { InputPassword } from "@/common/atoms/input-passwork"
import { Controller, UseFormRegister } from "react-hook-form"
import { User } from "@/api"
import { useTranslation } from "react-i18next"
import { ButtonGoogle } from "@/common/atoms/buttonGoogle"
import { useRegisterFocus } from "@/common/hooks/auth/useRegisterFocus"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/common/ui/input-otp"
import { TextError } from "@/common/atoms/textError"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

type LoginCardProps = {
  register: UseFormRegister<User>
  isLoading: boolean
  errors: any
  onSubmit: (e: React.FormEvent) => void
  onGoogleSignIn: () => void
  control: any

}
export const LoginCard = (
  {
    register,
    isLoading,
    errors,
    onSubmit,
    control,
    onGoogleSignIn }
    : LoginCardProps) => {

  const { t } = useTranslation()

  const { registerWithFocus, focusedField } = useRegisterFocus()
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="flex flex-col gap-5">
      <Card className="overflow-hidden rounded-xl border-none sm:border border-amber-200/50 sm:shadow-lg  sm:bg-white/90">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">

                <h1 className="text-2xl font-bold text-amber-800">{t("¡Bienvenido!")}</h1>
                <p className="text-balance text-muted-foreground text-sm text-gray-600 mt-2">Inicia sesión Encafeinados</p>
              </div>
              <ButtonGoogle
                variant="outline"
                onClick={onGoogleSignIn}
                disabled={isLoading}
                className="border-amber-200 hover:bg-amber-50 text-amber-900"
              >
                Continua con Google
              </ButtonGoogle>
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-900"></div>
                </div>
                <div className="relative px-4 text-sm  bg-white text-gray-500">
                  Opciones de registro
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm text-gray-800 font-medium">Correo</Label>
                <InputEmail
                  id="email"
                  autoComplete="email"
                  placeholder="coffelover@gmail.com"
                  className="border bg-white rounded-full border-gray-300 placeholder:text-xs"
                  {...registerWithFocus("email")}
                  {...register("email")}
                />
                {errors.email && <TextError>{errors.email.message}</TextError>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-[#3D3D3D] font-medium">Clave</Label>
                <div className="flex  mx-auto">
                  {/* <a href="#" className="ml-auto text-sm text-amber-800 underline-offset-2 hover:underline">
                    {t("¿Olvidaste tu contraseña?")}
                  </a> */}
                </div>
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <div className="mx-auto">
                      <div className="relative w-fit space-x-12">
                        <InputOTP
                          maxLength={4}
                          value={field.value}
                          onChange={field.onChange}
                          {...registerWithFocus("password")}
                          data-testid="custom-input-password"
                        >
                          <InputOTPGroup
                            className="space-x-1"
                          >
                            <InputOTPSlot index={0} isVisible={isVisible} />
                            <InputOTPSlot index={1} isVisible={isVisible} />
                          </InputOTPGroup>
                          {/* <InputOTPSeparator className="text-gray-400" /> */}
                          <InputOTPGroup  className="space-x-1">
                            <InputOTPSlot index={2} isVisible={isVisible} />
                            <InputOTPSlot index={3} isVisible={isVisible} />
                          </InputOTPGroup>
                        </InputOTP>
                        {/* <button
                          type="button"
                          onClick={() => setIsVisible((prev) => !prev)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          aria-label={isVisible ? "Ocultar código" : "Mostrar código"}
                          title={isVisible ? "Ocultar código" : "Mostrar código"}
                        >
                          {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button> */}
                      </div>
                      <div className="text-center text-sm p-2">
                        {field.value === "" ? (
                          <>Introduzca su clave</>
                        ) : (
                          <>

                          </>
                        )}
                      </div>
                    </div>
                  )}
                >
                </Controller>
                {errors.password && <TextError>{errors.password.message}</TextError>}

              </div>
              <Button type="submit" className="w-full rounded-full bg-[#D4A76A]  hover:bg-[#bb9765]  hover:text-white/80 border-amber-800 text-amber-950 font-medium shadow-md transition-all duration-200 hover:shadow-lg" disabled={isLoading}>
                {isLoading ? "Cargando..." : t("Ingresar")}
              </Button>
              
              <div className="text-center text-sm text-amber-800">
                ¿No tienes una cuenta?{" "}
                <Link to="/register" data-testid="register-link" className="text-amber-600 font-medium underline underline-offset-4 hover:text-amber-700">
                  Registrate
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden  md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-700/80 to-amber-300/50 z-10"></div>

            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-white">
              <video
                src="/video_cafeino.mp4"
                autoPlay
                loop
                muted
                className="absolute inset-0 h-full w-full object-cover opacity-90 dark:brightness-[0.3]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* <div className="text-balance text-center text-xs text-gray-500 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-amber-600">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  )
}