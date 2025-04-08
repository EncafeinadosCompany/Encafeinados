import { useState } from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";

export function useRegisterFocus<T extends FieldValues = any>() {
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const registerWithFocus = (name: keyof T, register: UseFormRegister<T>) => {
        const registration = register(name as any); // Cast por seguridad
        return {
            ...registration,
            onFocus: () => setFocusedField(name as string),
            onBlur: (e: any) => {
                setFocusedField(null);
                registration.onBlur(e);
            }
        };
    };

    return { registerWithFocus, focusedField };
}
