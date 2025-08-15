import { Label } from "@/common/ui/label";
import { RadioGroup, RadioGroupItem } from "@/common/ui/radio-group";

export const renderRadioGroup = (criteriaId: string, field: any) => (
  <RadioGroup
    onValueChange={field.onChange}
    value={field.value}
    className="flex gap-4"
      aria-label={`Criterio ${criteriaId}: ${field.value}`}
  >
    {["yes", "no", "other"].map((value) => (
      <div className="flex items-center space-x-2 " key={value}>
        <RadioGroupItem
          data-testid={`criteria-${criteriaId}-${value}`}
          aria-label={value}
          value={value}
          id={`${value}-${criteriaId}`}
        />
        <Label htmlFor={`${value}-${criteriaId}`} className="cursor-pointer">
          {value === "yes" ? "Sí" : value === "no" ? "No" : "Otro"}
        </Label>
      </div>
    ))}
  </RadioGroup>
);
