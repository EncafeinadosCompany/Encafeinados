import { BadgeCheck,CoffeeIcon, Store } from "lucide-react";

export function useStepMetaStore (step: number){
    const stepConfig = [
          {
      icon: <Store className="w-12 h-12 text-amber-600" />,
      title: "Información básica",
      description: "Es importante para nosotros identificar tu café de especialidad"
    },
    {
      icon: <CoffeeIcon className="w-12 h-12 text-blue-600" />,
      title: "Ya casi terminamos",
      description: "Cuéntanos sobre tu cafetería para darla a conocer al mundo"
    }
    ]

    return stepConfig[step] || {
      icon: <BadgeCheck className="w-12 h-12 text-emerald-600" />,
      title: "Registro de Cafetería",
      description: ""
    }
}