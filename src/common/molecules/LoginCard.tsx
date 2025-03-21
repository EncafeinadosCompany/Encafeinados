import { CheckCircle, Coffee, Lock, Mail } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import  {Link}  from "react-router-dom"
import { InputEmail } from "../atoms/Input-email"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { InputPassword } from "../atoms/input-passwork"
import { ButtonGoogle } from "../atoms/button-google"


type LoginCardProps = {
    handleSubmit: (e: React.FormEvent) => void
    handleGoogleSignIn: () => void
    isLoading: boolean
    data: { email: string; password: string }
    setdata: React.Dispatch<React.SetStateAction<{
        email: string;
        password: string;
    }>>
}

export const LoginCard = ({data, setdata, isLoading, handleSubmit, handleGoogleSignIn}:LoginCardProps) => {

  
return (
  <div className="flex flex-col gap-6">
  <Card className="overflow-hidden rounded-xl border border-amber-200/50 shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 dark:border-amber-800/50">
    <CardContent className="grid p-0 md:grid-cols-2">
      <form className="p-6 md:p-8" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            
            <h1 className="text-3xl font-bold text-amber-800">¡Bienvenido!</h1>
            <p className="text-balance text-muted-foreground">Inicia sesión Encafeinados</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-amber-900 font-medium">Correo</Label>
            <InputEmail 
              id="email" 
              autoComplete="email" 
              placeholder="m@example.com" 
              required 
              value={data.email}
              onChange={(e) => setdata({...data, email: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password" className="text-amber-900 font-medium">Contraseña</Label>
              <a href="#" className="ml-auto text-sm text-amber-600 underline-offset-2 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <InputPassword 
              id="password" 
              autoComplete="current-password" 
              required 
              value={data.password}
              onChange={(e) => setdata({...data, password: e.target.value})}
            />
          </div>
          <Button type="submit" className="w-full rounded-full bg-amber-600 hover:bg-amber-700 border border-amber-800 text-white font-medium shadow-md transition-all duration-200 hover:shadow-lg" disabled={isLoading}>
            {isLoading ? "Cargando..." : "Login"}
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-amber-200">
            <span className="relative z-10 bg-white px-2 text-amber-700 dark:bg-gray-900">***</span>
          </div>
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
  <div className="text-balance text-center text-xs text-amber-700 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-amber-600">
    By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
  </div>
</div>
)
}