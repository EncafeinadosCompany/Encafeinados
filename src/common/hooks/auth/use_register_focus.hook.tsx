import { useState } from "react"

export function useRegisterFocus() {
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const registerWithFocus = (name: string) => ({
    onFocus: () => setFocusedField(name),
    onBlur: () => setFocusedField(null)
  })

  return { focusedField, registerWithFocus }
}
