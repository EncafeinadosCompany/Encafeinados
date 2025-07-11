import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordResetSchema, PasswordResetData } from "@/common/utils/schemas/auth/password_reset.schema";
import { usePasswordResetMutation } from "@/api/mutations/auth/authMutations";
import { Button } from "@/common/ui/button";
import { Label } from "@/common/ui/label";
import { InputEmail } from "@/common/atoms/forms/Input_email.atom";
import { TextError } from "@/common/atoms/forms/text_error.atom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/common/ui/dialog";

interface PasswordResetModalProps {
  children: React.ReactNode;
}

export const PasswordResetModal = ({ children }: PasswordResetModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const passwordResetMutation = usePasswordResetMutation();

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
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
      reset();
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-amber-800">Recuperar contraseña</DialogTitle>
          <DialogDescription className="text-gray-600">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
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
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#D4A76A] hover:bg-[#bb9765] text-amber-950 font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar enlace"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
