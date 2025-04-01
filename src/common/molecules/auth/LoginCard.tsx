import { Button } from "@/common/ui/button"
import { Card, CardContent } from "@/common/ui/card"
import { Link } from "react-router-dom"
import { InputEmail } from "@/common/atoms/Input-email"
import { Label } from "@/common/ui/label"
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
    <div className="flex flex-col gap-4">
  <Card className="overflow-hidden rounded-xl border-none sm:border border-amber-200/50 sm:shadow-lg backdrop-blur-sm sm:bg-white/90">
    <CardContent className="grid p-4 md:p-8 md:grid-cols-2">
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold text-amber-800">{t("¡Bienvenido!")}</h1>
          <p className="text-sm text-gray-600 mt-1">{t("Inicia sesión en Encafeinados")}</p>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email" className="text-sm font-medium text-gray-800">Correo</Label>
          <InputEmail id="email" autoComplete="email" placeholder="coffelover@gmail.com" required {...register("email")} />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password" className="text-sm font-medium text-gray-800">Contraseña</Label>
            <a href="#" className="ml-auto text-xs md:text-sm text-amber-800 hover:underline">
              {t("¿Olvidaste tu contraseña?")}
            </a>
          </div>
          <InputPassword id="password" autoComplete="current-password" placeholder="* * * *" required {...register("password")} />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full rounded-full bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-md transition">
          {isLoading ? "Cargando..." : t("Ingresar")}
        </Button>
        <div className="text-center text-xs text-amber-800">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-amber-600 font-medium underline hover:text-amber-700">
            Regístrate
          </Link>
        </div>
      </form>
      {/* Ocultar video en móviles */}
      <div className="relative hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-700/80 to-amber-300/50 z-10"></div>
        <video src="/video_cafeino.mp4" autoPlay loop muted className="absolute inset-0 h-full w-full object-cover opacity-90" />
      </div>
    </CardContent>
  </Card>
</div>
  )
}