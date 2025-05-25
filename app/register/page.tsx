"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Eye, EyeOff, AlertTriangle, ArrowLeft, RefreshCw, Check } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { useStore, validatePassword } from "@/lib/store"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import PasswordStrength from "@/components/password-strength"

export default function Register() {
  const [formData, setFormData] = useState({
    alias: "",
    email: "",
    password: "",
    confirmPassword: "",
    enable2FA: false,
    acceptTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { state, dispatch } = useStore()
  const router = useRouter()

  const generateAlias = () => {
    const adjectives = ["Shadow", "Crypto", "Secure", "Dark", "Ghost", "Phantom", "Silent", "Hidden"]
    const nouns = ["User", "Node", "Agent", "Cipher", "Key", "Guard", "Wolf", "Raven"]
    const number = Math.floor(Math.random() * 999) + 1
    const alias = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${
      nouns[Math.floor(Math.random() * nouns.length)]
    }_${number}`
    setFormData({ ...formData, alias })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validaciones
      if (!formData.email || !formData.password) {
        toast.error("Email y contraseña son requeridos")
        return
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Las contraseñas no coinciden")
        return
      }

      const passwordValidation = validatePassword(formData.password)
      if (passwordValidation.score < 3) {
        toast.error("La contraseña debe ser al menos de fortaleza media")
        return
      }

      if (!formData.acceptTerms) {
        toast.error("Debes aceptar los términos y condiciones")
        return
      }

      // Verificar si el email ya existe
      const existingUser = state.users.find((user) => user.email === formData.email)
      if (existingUser) {
        toast.error("Ya existe una cuenta con este email")
        return
      }

      // Simular delay de registro
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Crear nuevo usuario
      const newUser = {
        email: formData.email,
        password: formData.password,
        name: formData.alias || formData.email.split("@")[0],
        isAdmin: false,
        isActive: true,
      }

      dispatch({ type: "REGISTER_USER", user: newUser })

      toast.success("¡Cuenta creada exitosamente!")
      toast.info("Ahora puedes iniciar sesión con tus credenciales")

      // Redirigir al login después de un breve delay
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      toast.error("Error al crear la cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen grid-pattern">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              SecureMarket
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-neon-green" />
              <p className="text-gray-400 text-sm">Create New Identity</p>
              <Lock className="h-5 w-5 text-neon-green" />
            </div>
          </div>

          <div className="bg-graphite rounded-lg border border-gray-800 p-6 shadow-lg card-hover">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">New Identity</h2>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-neon-green animate-pulse"></div>
                <span className="text-xs text-gray-400">Secure Registration</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="alias" className="text-sm text-gray-300">
                    Alias
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Optional</span>
                    <button type="button" onClick={generateAlias} className="text-purple-500 hover:text-purple-400">
                      <RefreshCw className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  id="alias"
                  value={formData.alias}
                  onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600 text-sm"
                  placeholder="ShadowUser_42"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">Leave blank for auto-generated alias</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="email" className="text-sm text-gray-300">
                    Email *
                  </label>
                  <span className="text-xs text-gray-500">Required</span>
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600 text-sm"
                  placeholder="user@example.com"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">For account access and recovery</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-gray-300">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600 text-sm pr-10"
                    placeholder="••••••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500 hover:text-gray-300" />
                    )}
                  </button>
                </div>
                <PasswordStrength password={formData.password} />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm text-gray-300">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600 text-sm pr-10"
                    placeholder="••••••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500 hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="flex items-center gap-1 text-xs">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <Check className="h-3 w-3 text-green-400" />
                        <span className="text-green-400">Las contraseñas coinciden</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3 w-3 text-red-400" />
                        <span className="text-red-400">Las contraseñas no coinciden</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="enable-2fa"
                    checked={formData.enable2FA}
                    onCheckedChange={(checked) => setFormData({ ...formData, enable2FA: checked as boolean })}
                  />
                  <label
                    htmlFor="enable-2fa"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
                  >
                    Enable Two-Factor Authentication (2FA)
                    <p className="text-xs text-gray-500 mt-1">Adds an extra layer of security to your account</p>
                  </label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-purple-500 hover:text-purple-400">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-purple-500 hover:text-purple-400">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-purple-700 hover:bg-purple-600 text-white glow-effect"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Identity..." : "Create Secure Identity"}
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-center">
                <Link
                  href="/"
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-600">
            <div className="flex items-center justify-center gap-1 mb-2">
              <AlertTriangle className="h-3 w-3 text-neon-pink" />
              <p className="text-gray-400">Security Notice</p>
            </div>
            <p className="text-gray-500">
              For maximum security, consider accessing via TOR and using a temporary email.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
