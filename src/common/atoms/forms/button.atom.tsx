import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "@/common/ui/icons";
import { props } from "cypress/types/bluebird";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export const ButtonGeneric = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        variant = 'primary',
        size = 'md',
        loading,
        icon,
        fullWidth,
        children,
        className,
        disabled,
        ...props

    }, ref) => {
        const baseStyles = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-xl focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary: "bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500",
            secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
            outline: "border border-amber-600 text-amber-600 hover:bg-amber-50 focus:ring-amber-500",
            ghost: "text-amber-600 hover:bg-amber-50 focus:ring-amber-500"
        };

        const sizes = {
            sm: "px-3 py-2 text-sm",
            md: "px-4 py-3 text-base",
            lg: "px-6 py-4 text-lg"
        };
        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    fullWidth && "w-full",
                    className
                )}
                {...props}
            >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {icon && !loading && icon}
                {children}
            </button>
        );

    }
)


ButtonGeneric.displayName = "Button";