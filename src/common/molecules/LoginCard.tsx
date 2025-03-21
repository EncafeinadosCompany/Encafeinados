import { CheckCircle, Lock, Mail } from "lucide-react"
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
  <Card className="overflow-hidden rounded-xl border border-gray-200/50 shadow-md backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 dark:border-gray-800/50">
    <CardContent className="grid p-0 md:grid-cols-2">
      <form className="p-6 md:p-8" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-balance text-muted-foreground">Login to your Acme Inc account</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Password</Label>
              <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                Forgot your password?
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
          <ButtonGoogle 
            variant="outline" 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
          
            Continue with Google
          </ButtonGoogle>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </div>
      </form>
      <div className="relative hidden bg-muted md:block">
        <video
          src="/video_cafeino.mp4"
          autoPlay
          loop
          muted
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </CardContent>
  </Card>
  <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
    By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
  </div>
</div>
)
}