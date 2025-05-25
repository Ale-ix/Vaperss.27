"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useStore()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular delay de autenticación
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      dispatch({ type: "LOGIN", email, password })

      // Verificar si el login fue exitoso
      const savedData = localStorage.getItem("securemarket-data")
      if (savedData) {
        const data = JSON.parse(savedData)
        const user = data.users?.find((u: any) => u.email === email && u.password === password && u.isActive)

        if (user) {
          toast.success(`¡Bienvenido, ${user.name}!`)
          if (user.isAdmin) {
            router.push("/admin")
          } else {
            router.push("/dashboard")
          }
        } else {
          toast.error("Credenciales incorrectas o cuenta desactivada")
        }
      } else {
        toast.error("Error al acceder al sistema")
      }
    } catch (error) {
      toast.error("Error al iniciar sesión")
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
              <p className="text-gray-400 text-sm">Secure • Anonymous • Private</p>
              <Lock className="h-5 w-5 text-neon-green" />
            </div>
          </div>

          <div className="bg-graphite rounded-lg border border-gray-800 p-6 shadow-lg card-hover">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Access Portal</h2>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-neon-green animate-pulse"></div>
                <span className="text-xs text-gray-400">Secure Connection</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="identifier" className="text-sm text-gray-300">
                    Email
                  </label>
                  <span className="text-xs text-gray-500">Required</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="identifier"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600 text-sm"
                    placeholder="user@example.com"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <div className="h-1.5 w-1.5 rounded-full bg-neon-blue"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-700 bg-black text-purple-600 focus:ring-purple-600"
                  />
                  <label htmlFor="remember" className="ml-2 text-xs text-gray-400">
                    Remember device
                  </label>
                </div>
                <Link href="/forgot-password" className="text-xs text-purple-500 hover:text-purple-400">
                  Forgot password?
                </Link>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-purple-700 hover:bg-purple-600 text-white glow-effect"
                  disabled={isLoading}
                >
                  {isLoading ? "Accessing..." : "Access Secure Portal"}
                </Button>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                <Link href="/register" className="hover:text-purple-400 transition-colors">
                  Create new identity
                </Link>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-neon-pink" />
                  <Link href="/security-guide" className="hover:text-purple-400 transition-colors">
                    Security guide
                  </Link>
                </div>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-1 flex-1 bg-gray-800"></div>
                <span className="text-xs text-gray-500">ALTERNATIVE ACCESS</span>
                <div className="h-1 flex-1 bg-gray-800"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="border-gray-800 hover:bg-gray-900 hover:text-neon-blue text-sm">
                  TOR Access
                </Button>
                <Button variant="outline" className="border-gray-800 hover:bg-gray-900 hover:text-neon-green text-sm">
                  Anonymous Mode
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-600">
            <p>All connections encrypted. No logs. No tracking.</p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <Link href="/terms" className="hover:text-gray-400 transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-gray-400 transition-colors">
                Privacy
              </Link>
              <Link href="/security" className="hover:text-gray-400 transition-colors">
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
