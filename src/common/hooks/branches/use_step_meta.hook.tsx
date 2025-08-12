import { Coffee, MapPin, BadgeCheck } from "@/common/ui/icons";
export function useStepMetaBranch(step: number) {
  const stepConfig = [
    {
      icon: <Coffee className="w-12 h-12 text-amber-600" />,
      title:
        "Haz que tu cafetería crezca y se conecte con más amantes del café",
      description:
        "Haz que tu cafetería crezca y se conecte con más amantes del café",
    },
    {
      icon: <Coffee className="w-12 h-12 text-amber-600" />,
      title: "Cuéntanos qué hace especial a tu café de especialidad",
      description: "Cuéntanos qué hace especial a tu café de especialidad",
    },
    {
      icon: <MapPin className="w-12 h-12 text-orange-600" />,
      title: "Ayuda a los coffeelovers a encontrarte fácilmente",
      description: "Ayuda a los coffeelovers a encontrarte fácilmente",
    },
    {
      icon: <BadgeCheck className="w-12 h-12 text-emerald-600" />,
      title: "Proporciona detalles adicionales sobre la ubicación",
      description: "Proporciona detalles adicionales sobre la ubicación",
    },
    {
      icon: <BadgeCheck className="w-12 h-12 text-emerald-600" />,
      title: "Comparte tus redes sociales para mayor visibilidad",
      description: "Comparte tus redes sociales para mayor visibilidad",
    },
  ];

  return stepConfig[step] || {};
}
