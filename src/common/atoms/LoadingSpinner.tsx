import React from "react";
import { Spinner } from '@/common/ui/spinner'
interface LoadingSpinnerProps {
  message?: string
  className?: string
}

 const LoadingSpinner = ({ message, className }: LoadingSpinnerProps) => {
  function cn(base: string, className?: string): string {

    return [base, className].filter(Boolean).join(" ");
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)} role="status">
      <Spinner className="h-8 w-8" />
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  )
}

export default LoadingSpinner;