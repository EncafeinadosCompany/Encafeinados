import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { passwordResetSchema, PasswordResetData } from "@/common/utils/schemas/auth/password_reset.schema";
import { usePasswordResetMutation } from "@/api/mutations/auth/authMutations";
import { Button } from "@/common/ui/button";
import { Label } from "@/common/ui/label";
import { InputEmail } from "@/common/atoms/auth/Input_email.atom";
import { TextError } from "@/common/atoms/textError";
import { Card, CardContent } from "@/common/ui/card";
import { ArrowLeft } from "@/common/ui/icons";
import toast from "react-hot-toast";

export default function PasswordResetPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  
  const passwordResetMutation = usePasswordResetMutation();

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    getValues
  } = useForm<PasswordResetData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: PasswordResetData) => {
    try {
      setIsLoading(true);
      await passwordResetMutation.mutateAsync(data);
      setIsSuccess(true);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <Card className="overflow-hidden rounded-xl border border-amber-200/50 shadow-lg bg-white/90 grid md:grid-cols-2">
            <div className="relative hidden md:block">
              <video
                autoPlay
                loop
                muted
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/video_cafeino.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-br "></div>
              <div className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
              </div>
            </div>
            
            <CardContent className="p-6 md:p-8">
         

              <div className="text-center space-y-4 mt-8">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-amber-800 mb-2">
                    ¡Correo enviado!
                  </h1>
                  <p className="text-sm text-muted-foreground mb-2">
                    Hemos enviado un enlace de recuperación a <strong>{getValues('email')}</strong>
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Si no ves el correo, revisa tu carpeta de spam o correos no deseados.
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
               
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSuccess(false);
                      reset();
                    }}
                    className="w-full border-amber-200 text-amber-800 hover:bg-amber-50 rounded-full"
                  >
                    Enviar nuevamente
                  </Button>
                </div>
                
                <div className="text-center text-sm text-amber-800 mt-4">
                  ¿Recordaste tu contraseña?{" "}
                  <Link 
                    to="/login" 
                    className="text-amber-600 font-medium underline underline-offset-4 hover:text-amber-700"
                  >
                    Iniciar sesión
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="overflow-hidden rounded-xl border border-amber-200/50 shadow-lg bg-white/90 grid md:grid-cols-2">
          <div className="relative hidden md:block">
            <video
              autoPlay
              loop
              muted
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/video_cafeino.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0"></div>
           
          </div>
          
          <CardContent className="p-6 md:p-8">
         

            <div className="flex flex-col space-y-2 text-center mb-6 mt-8">
              <h1 className="text-2xl font-semibold tracking-tight text-amber-800">
                Recuperar contraseña
              </h1>
              <p className="text-sm text-muted-foreground">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-sm text-gray-800 font-medium">
                  Correo electrónico
                </Label>
                <InputEmail
                  id="reset-email"
                  autoComplete="email"
                  placeholder="coffelover@gmail.com"
                  className="border bg-white rounded-full border-gray-300 placeholder:text-xs"
                  {...register("email")}
                />
                {errors.email && <TextError>{errors.email.message}</TextError>}
              </div>
              
              <Button
                type="submit"
                className="w-full bg-[#D4A76A] hover:bg-[#bb9765] text-amber-950 font-medium rounded-full"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
              </Button>
            </form>
            
            <div className="text-center text-sm text-amber-800 mt-6">
              ¿Recordaste tu contraseña?{" "}
              <Link 
                to="/login" 
                className="text-amber-600 font-medium underline underline-offset-4 hover:text-amber-700"
              >
                Iniciar sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
