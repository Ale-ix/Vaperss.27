"use client"

import { validatePassword } from "@/lib/store"
import { Check, X } from "lucide-react"

interface PasswordStrengthProps {
  password: string
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null

  const validation = validatePassword(password)

  const strengthLabels = {
    weak: "Débil",
    medium: "Media",
    strong: "Fuerte",
    "very-strong": "Muy Fuerte",
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Fortaleza de la contraseña</span>
        <span className={`text-xs font-medium ${validation.color.replace("bg-", "text-")}`}>
          {strengthLabels[validation.strength]}
        </span>
      </div>

      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${validation.color}`}
          style={{ width: `${validation.percentage}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className={`flex items-center gap-1 ${validation.checks.length ? "text-green-400" : "text-gray-500"}`}>
          {validation.checks.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          <span>8+ caracteres</span>
        </div>
        <div className={`flex items-center gap-1 ${validation.checks.uppercase ? "text-green-400" : "text-gray-500"}`}>
          {validation.checks.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          <span>Mayúscula</span>
        </div>
        <div className={`flex items-center gap-1 ${validation.checks.lowercase ? "text-green-400" : "text-gray-500"}`}>
          {validation.checks.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          <span>Minúscula</span>
        </div>
        <div className={`flex items-center gap-1 ${validation.checks.number ? "text-green-400" : "text-gray-500"}`}>
          {validation.checks.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          <span>Número</span>
        </div>
        <div className={`flex items-center gap-1 ${validation.checks.special ? "text-green-400" : "text-gray-500"}`}>
          {validation.checks.special ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          <span>Carácter especial</span>
        </div>
      </div>
    </div>
  )
}
