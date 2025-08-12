import { BadgeCheck, Coffee, Shield, User } from "lucide-react";

export function useStepMetaCoffeelover (step: number){
    const stepConfig = [
          {
      icon: <User className="w-12 h-12 text-amber-600" />,
      title: "Información personal",
      description: "Comparte tus datos básicos para empezar esta aventura"
    },
    {
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      title: "Credenciales de acceso",
      description: "Crea tus credenciales de acceso seguras"
    },
    {
      icon: <Coffee className="w-12 h-12 text-purple-600" />,
      title: "Configuración final",
      description: "Finaliza tu configuración de perfil"
    },
    {
      icon: <BadgeCheck className="w-12 h-12 text-emerald-600" />,
      title: "Términos y condiciones",
      description: "Acepta los términos para completar tu registro"
    }
    ]

    return stepConfig[step] || {
      icon: <BadgeCheck className="w-12 h-12 text-emerald-600" />,
      title: "Registro de CoffeeLover",
      description: ""
    }
}