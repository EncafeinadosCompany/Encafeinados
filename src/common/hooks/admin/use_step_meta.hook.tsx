import { BadgeCheck, Settings, Shield, User } from "lucide-react";

export function useStepMetaAdmin (step: number){
    const stepConfig = [
{
    icon: <User className="w-12 h-12 text-amber-600" />,
    title: "Información personal",
    description: "Ingresa los datos personales del administrador",
  },
  {
    icon: <Shield className="w-12 h-12 text-blue-600" />,
    title: "Credenciales de acceso",
    description: "Establece las credenciales de acceso seguras",
  },
  {
    icon: <Settings className="w-12 h-12 text-purple-600" />,
    title: "Configuración final",
    description: "Configura los permisos y términos finales",
  }
]
   return stepConfig[step] || {
      icon: <BadgeCheck className="w-12 h-12 text-emerald-600" />,
      title: "Registro de Admin",
      description: ""
    }

}

