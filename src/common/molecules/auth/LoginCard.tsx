import { CheckCircle, Coffee, Lock, Mail } from "lucide-react"
import { Button } from "@/common/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/common/ui/card"
import { Link } from "react-router-dom"
import { InputEmail } from "@/common/atoms/Input-email"
import { Label } from "@/common/ui/label"
import { Separator } from "@/common/ui/separator"
import { InputPassword } from "@/common/atoms/input-passwork"
import { UseFormRegister } from "react-hook-form"
import { User } from "@/api"
import { useTranslation } from "react-i18next"


type LoginCardProps = {
  register: UseFormRegister<User>
  isLoading: boolean
  errors: any
  onSubmit: (e: React.FormEvent) => void
  onGoogleSignIn: () => void

}

export const LoginCard = (
  {
    register,
    isLoading,
    errors,
    onSubmit,
    onGoogleSignIn }
    : LoginCardProps) => {


  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-5">
      <Card className="overflow-hidden rounded-xl border-none sm:border border-amber-200/50 sm:shadow-lg backdrop-blur-sm sm:bg-white/90">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">

                <h1 className="text-2xl font-bold text-amber-800">{t("¡Bienvenido!")}</h1>
                <p className="text-balance text-muted-foreground text-sm text-gray-600 mt-2">Inicia sesión Encafeinados</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm text-gray-800 font-medium">Correo</Label>
                <InputEmail
                  id="email"
                  autoComplete="email"
                  placeholder="coffelover@gmail.com"
                  required
                  {...register("email")}
                />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-[#3D3D3D] font-medium">Contraseña</Label>
                  <a href="#" className="ml-auto text-sm text-amber-800 underline-offset-2 hover:underline">
                    {t("¿Olvidaste tu contraseña?")}
                  </a>
                </div>
                <InputPassword
                  id="password"
                  autoComplete="current-password"
                  placeholder="* * * *"
                  required
                  {...register("password")}
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full rounded-full bg-amber-600 hover:bg-amber-700 border border-amber-800 text-white font-medium shadow-md transition-all duration-200 hover:shadow-lg" disabled={isLoading}>
                {isLoading ? "Cargando..." : t("Ingresar")}
              </Button>
              {/* <ButtonGoogle 
            variant="outline" 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="border-amber-200 hover:bg-amber-50 text-amber-900"
          >
            Continua con Google
          </ButtonGoogle> */}
              <div className="text-center text-sm text-amber-800">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/register" className="text-amber-600 font-medium underline underline-offset-4 hover:text-amber-700">
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
      <div className="text-balance text-center text-xs text-gray-500 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-amber-600">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}