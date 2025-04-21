import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <div className="relative w-fit space-x-12">
      <OTPInput    
        data-slot="input-otp"
        containerClassName={cn(
          "flex items-center gap-2 has-disabled:opacity-50 ",
          containerClassName
        )}
        className={cn("disabled:cursor-not-allowed", className)}
        {...props}
      ></OTPInput>
     
    </div>
  )
}


function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  isVisible = false,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
  isVisible?: boolean
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  const displayChar = isVisible ? char : char ? "•" : ""

  return (
    <div
  data-slot="input-otp-slot"
  data-active={isActive}
  className={cn(
    "relative flex h-11 w-11 items-center bg-white/90 justify-center border border-gray-300 text-xl text-gray-600 shadow-xs outline-none transition-all",
    "first:rounded-l-md last:rounded-r-md",
    "data-[active=true]:border-ring data-[active=true]:ring-[1px] data-[active=true]:z-10",
    "data-[active=true]:ring-ring/50 aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20",
    className
  )}
  role="textbox"
  tabIndex={0}
  inputMode="numeric"
  aria-label={`Digit ${index + 1}`}
  {...props}
>
  {displayChar}
  {hasFakeCaret && (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="animate-caret-blink bg-foreground h-4 w-px" />
    </div>
  )}
</div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
