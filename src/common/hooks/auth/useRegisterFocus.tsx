import { useState } from "react";
import { UseFormRegister } from "react-hook-form";

export const  useRegisterFocus = () => {
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const registerWithFocus = (name: string, register: UseFormRegister<any>) => {
        const registration = register(name);
        return {
            ...registration,
            onFocus: () => setFocusedField(name),
            onBlur: (e: any) => {
                setFocusedField(null);
                registration.onBlur(e);
            }
        };
    };

    return { registerWithFocus, focusedField };

}