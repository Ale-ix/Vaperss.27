"use client"

import Navigation from "@/components/navigation"
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Lock } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"

export default function CartPage() {
  const { state, dispatch } = useStore()

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity })
  }

  const removeFromCart = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", productId })
  }

  const subtotal = state.cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 9.99
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-black grid-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-6 grid md:grid-cols-[240px_1fr] gap-6">
        <Sidebar />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Carrito de Compras</h1>
            <span className="text-sm text-gray-400">{state.cart.length} productos</span>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {state.cart.length > 0 ? (
                state.cart.map((item) => (
                  <Card key={item.id} className="bg-graphite border-gray-800 p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-md flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.title}</h3>
                          <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Categoría: {item.category}</p>
                        <p className="text-sm text-gray-500">Precio unitario: ${item.price.toFixed(2)}</p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 border-gray-800"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 border-gray-800"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-graphite border border-gray-800 rounded-lg">
                  <ShoppingBag className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Tu carrito está vacío</h3>
                  <p className="text-gray-400 mb-6">Añade algunos productos para continuar con la compra</p>
                  <Button className="bg-purple-700 hover:bg-purple-600" asChild>
                    <Link href="/products">Explorar Productos</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            {state.cart.length > 0 && (
              <div>
                <Card className="bg-graphite border-gray-800 p-5 sticky top-20">
                  <h2 className="text-lg font-semibold mb-4">Resumen del Pedido</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Envío</span>
                      <span>{shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    {subtotal > 100 && (
                      <div className="text-xs text-green-400">¡Envío gratis por compras superiores a $100!</div>
                    )}
                    <Separator className="my-2 bg-gray-800" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-purple-700 hover:bg-purple-600" asChild>
                    <Link href="/checkout">
                      Proceder al Pago
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-400">
                    <Lock className="h-3 w-3" />
                    <span>Pago seguro y encriptado</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h3 className="text-sm font-medium">Métodos de Pago Aceptados</h3>
                    <div className="flex gap-2">
                      <div className="h-8 w-12 bg-gray-800 rounded flex items-center justify-center text-xs">VISA</div>
                      <div className="h-8 w-12 bg-gray-800 rounded flex items-center justify-center text-xs">MC</div>
                      <div className="h-8 w-12 bg-gray-800 rounded flex items-center justify-center text-xs">AMEX</div>
                      <div className="h-8 w-12 bg-gray-800 rounded flex items-center justify-center text-xs">
                        PAYPAL
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
