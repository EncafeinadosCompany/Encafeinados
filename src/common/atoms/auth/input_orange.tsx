import React from "react";
import { Input } from "@/common/ui/input";
import { Label } from "@/common/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Propiedades principales
  label: string;
  name: string;
  
  // Opciones de registro para React Hook Form
  register?: any;
  errors?: any;
  
  // Personalización visual
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  focusColor?: string;
  
  // Estados adicionales
  isFocused?: boolean;
  helperText?: string;
}

export const FormInput = ({
  // Valores por defecto
  label,
  name,
  register,
  errors,
  icon,
  iconPosition = "left",
  focusColor = "amber",
  isFocused,
  helperText,
  className,
  type = "text", // Tipo por defecto ahora es text
  ...props
}: FormInputProps) => {
  // Generar clases dinámicas
  const colorClasses = {
    amber: "focus:ring-amber-500 focus:border-amber-500",
    orange: "focus:ring-[#DB8935] focus:border-[#DB8935]",
    blue: "focus:ring-blue-500 focus:border-blue-500",
    green: "focus:ring-green-500 focus:border-green-500",
    red: "focus:ring-red-500 focus:border-red-500",
  };

  // Aplicar registro si se proporciona
  const registration = register ? register(name) : {};
  
  // Determinar si hay un error para este campo
  const errorMessage = errors?.[name]?.message;

  return (
    <div className="space-y-1">
      {/* Label con color condicional según focus */}
      <Label
        htmlFor={name}
        className={cn(
          "text-sm font-medium transition-colors",
          isFocused ? `text-${focusColor}-600` : "text-gray-700",
          errorMessage ? "text-red-600" : ""
        )}
      >
        {label}
      </Label>

      <div className="relative">
        {/* Icono a la izquierda */}
        {icon && iconPosition === "left" && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </span>
        )}

        <Input
          id={name}
          type={type}
          {...registration}
          {...props}
          className={cn(
            "bg-white border-gray-300 transition-all focus:ring-2 focus:ring-opacity-50",
            icon && iconPosition === "left" ? "pl-10" : "",
            icon && iconPosition === "right" ? "pr-10" : "",
            colorClasses[focusColor as keyof typeof colorClasses],
            errorMessage ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "",
            className
          )}
        />

        {/* Icono a la derecha */}
        {icon && iconPosition === "right" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </span>
        )}
      </div>

      {/* Mensaje de error o texto de ayuda */}
      {(errorMessage || helperText) && (
        <p className={cn(
          "text-xs m-1",
          errorMessage ? "text-red-600" : "text-gray-500"
        )}>
          {errorMessage || helperText}
        </p>
      )}
    </div>
  );
};