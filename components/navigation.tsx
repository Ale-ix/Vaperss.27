"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Bell, Search, ShoppingCart, Menu, User, LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Navigation() {
  const { state, dispatch } = useStore()

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" })
  }

  return (
    <header className="border-b border-gray-800 bg-graphite/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-neon-green" />
              <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                SecureMarket
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search secure marketplace..."
                className="w-full bg-black border border-gray-800 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            <Link href="/dashboard/messages">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {state.unreadMessages > 0 && (
                  <Badge className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center p-0 bg-neon-pink text-white text-xs">
                    {state.unreadMessages}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {state.cart.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-neon-pink text-white text-xs">
                    {state.cart.reduce((total, item) => total + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </Link>

            {state.currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 border-l border-gray-800 pl-3 ml-1 cursor-pointer">
                    <Avatar className="h-8 w-8 border border-gray-800">
                      <AvatarFallback className="bg-dark-purple text-xs">
                        {state.currentUser.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium">{state.currentUser.name}</p>
                      <p className="text-xs text-gray-500">{state.currentUser.isAdmin ? "Administrador" : "Usuario"}</p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/orders">Mis Pedidos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/messages">Mensajes</Link>
                  </DropdownMenuItem>
                  {state.currentUser.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Panel Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
