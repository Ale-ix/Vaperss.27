import Navigation from "@/components/navigation"
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Lock, ShieldCheck, AlertTriangle, CreditCard, Wallet } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function CheckoutPage() {
  // Datos de ejemplo para el resumen del pedido
  const orderSummary = {
    subtotal: 229.97,
    shipping: 9.99,
    total: 239.96,
    items: 3,
  }

  return (
    <div className="min-h-screen bg-black grid-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-6 grid md:grid-cols-[240px_1fr] gap-6">
        <Sidebar />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Checkout</h1>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Lock className="h-4 w-4 text-neon-green" />
              <span>Conexión Segura</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Payment Methods */}
              <Card className="bg-graphite border-gray-800 p-5">
                <h2 className="text-lg font-semibold mb-4">Método de Pago</h2>

                <RadioGroup defaultValue="card" className="space-y-3">
                  <div className="flex items-center space-x-3 border border-gray-700 p-3 rounded-md hover:border-purple-600 cursor-pointer">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Tarjeta de Crédito/Débito</p>
                        <p className="text-xs text-gray-400">Visa, Mastercard, American Express</p>
                      </div>
                    </Label>
                    <span className="text-xs text-neon-green border border-neon-green rounded px-2 py-0.5">
                      Recomendado
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 border border-gray-700 p-3 rounded-md hover:border-purple-600 cursor-pointer">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-xs text-gray-400">Pago rápido y seguro</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border border-gray-700 p-3 rounded-md hover:border-purple-600 cursor-pointer">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Saldo de Cuenta</p>
                        <p className="text-xs text-gray-400">Saldo actual: $1,250.00</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </Card>

              {/* Shipping Information */}
              <Card className="bg-graphite border-gray-800 p-5">
                <h2 className="text-lg font-semibold mb-4">Información de Envío</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        placeholder="Nombre"
                        className="bg-black border-gray-800 focus:border-purple-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        placeholder="Apellido"
                        className="bg-black border-gray-800 focus:border-purple-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@ejemplo.com"
                      className="bg-black border-gray-800 focus:border-purple-600"
                    />
                    <p className="text-xs text-gray-500">Solo para notificaciones de envío</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      placeholder="Dirección de envío"
                      className="bg-black border-gray-800 focus:border-purple-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        placeholder="Ciudad"
                        className="bg-black border-gray-800 focus:border-purple-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Código Postal</Label>
                      <Input
                        id="postalCode"
                        placeholder="Código Postal"
                        className="bg-black border-gray-800 focus:border-purple-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <select
                      id="country"
                      className="w-full bg-black border border-gray-800 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600 text-sm"
                    >
                      <option value="">Seleccionar país</option>
                      <option value="ES">España</option>
                      <option value="MX">México</option>
                      <option value="AR">Argentina</option>
                      <option value="CO">Colombia</option>
                      <option value="CL">Chile</option>
                      <option value="PE">Perú</option>
                    </select>
                  </div>

                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox id="shipping-privacy" />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="shipping-privacy"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Usar dirección de envío anónima
                      </label>
                      <p className="text-xs text-gray-500">
                        Utilizaremos un servicio de reenvío para proteger tu privacidad
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Security Notice */}
              <div className="bg-graphite border border-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-5 w-5 text-neon-green" />
                  <h3 className="font-medium">Transacción Segura</h3>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  Todas las transacciones están encriptadas de extremo a extremo. No almacenamos información personal.
                </p>
                <div className="flex items-center gap-1 text-xs text-yellow-500">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Para máxima seguridad, usa PayPal o tarjetas virtuales</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="bg-graphite border-gray-800 p-5 sticky top-20">
                <h2 className="text-lg font-semibold mb-4">Resumen del Pedido</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal ({orderSummary.items} productos)</span>
                    <span>${orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Envío</span>
                    <span>${orderSummary.shipping.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2 bg-gray-800" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-purple-700 hover:bg-purple-600">Completar Compra</Button>

                <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-400">
                  <Lock className="h-3 w-3" />
                  <span>Pago seguro y encriptado</span>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  <p>
                    Al completar tu compra, aceptas nuestros{" "}
                    <a href="#" className="text-purple-400 hover:underline">
                      Términos de Servicio
                    </a>{" "}
                    y{" "}
                    <a href="#" className="text-purple-400 hover:underline">
                      Política de Privacidad
                    </a>
                    .
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
