"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Package,
  ShoppingCart,
  MessageSquare,
  User,
  Settings,
  LogOut,
  AlertTriangle,
  CreditCard,
  Wallet,
  Tag,
  Home,
  ShoppingBag,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"

export default function Sidebar() {
  const { state, dispatch } = useStore()

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" })
  }

  return (
    <aside className="hidden md:block">
      <div className="bg-graphite rounded-lg border border-gray-800 overflow-hidden sticky top-20">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-2 w-2 rounded-full bg-neon-green animate-pulse"></div>
            <span className="text-xs text-gray-400">Secure Connection</span>
          </div>

          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800/50"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800/50"
            >
              <Package className="h-4 w-4" />
              <span>Productos</span>
            </Link>
            <Link
              href="/products/digital"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800/50 pl-8"
            >
              <Tag className="h-4 w-4" />
              <span>Digital</span>
            </Link>
            <Link
              href="/products/physical"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800/50 pl-8"
            >
              <Tag className="h-4 w-4" />
              <span>Físico</span>
            </Link>
            <Link
              href="/products/services"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800/50 pl-8"
            >
              <Tag className="h-4 w-4" />
              <span>Servicios</span>
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800/50"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Carrito</span>
              {state.cart.length > 0 && (
                <Badge className="ml-auto bg-neon-pink text-white text-xs">
                  {state.cart.reduce((total, item) => total + item.quantity, 0)}
                </Badge>
              )}
            </Link>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800/50"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Mis Pedidos</span>
            </Link>
            <Link
              href="/dashboard/messages"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800/50"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Mensajes</span>
              <Badge className="ml-auto bg-neon-pink text-white text-xs">3</Badge>
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800/50"
            >
              <User className="h-4 w-4" />
              <span>Perfil</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800/50"
            >
              <Settings className="h-4 w-4" />
              <span>Ajustes</span>
            </Link>
            {state.user?.isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-purple-300 hover:bg-purple-900/20 border border-purple-600/30"
              >
                <Settings className="h-4 w-4" />
                <span>Panel Admin</span>
              </Link>
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">SALDO CARTERA</span>
            <Badge variant="outline" className="text-neon-green border-neon-green text-xs">
              Secure
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold">$1,250.00</span>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-purple-400 hover:text-purple-300">
              Añadir fondos
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <Button variant="outline" size="sm" className="h-8 text-xs border-gray-800 hover:bg-gray-900">
              <CreditCard className="h-3 w-3 mr-1" />
              Card
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs border-gray-800 hover:bg-gray-900">
              <Wallet className="h-3 w-3 mr-1" />
              PayPal
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs border-gray-800 hover:bg-gray-900">
              <Wallet className="h-3 w-3 mr-1" />
              More
            </Button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/20"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-yellow-400 hover:text-yellow-300 hover:bg-yellow-950/20 mt-2"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Modo Pánico
          </Button>
        </div>
      </div>
    </aside>
  )
}
