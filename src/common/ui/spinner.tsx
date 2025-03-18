// src/common/ui/spinner.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "animate-spin",
  {
    variants: {
      size: {
        default: "h-4 w-4",
        sm: "h-2 w-2",
        lg: "h-6 w-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(spinnerVariants({ size, className }))}
        {...props}
      >
        <svg
          className="animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4.75V6.25M18.364 5.636L17.304 7.096M19.25 12H17.75M18.364 18.364L17.304 16.904M12 17.75V19.25M7.096 17.304L5.636 18.364M6.25 12H4.75M7.096 6.696L5.636 5.636"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    )
  }
)

Spinner.displayName = "Spinner"

export { Spinner }