"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Star,
  Package,
  ShoppingCart,
  Check,
  AlertTriangle,
  CreditCard,
  Wallet,
  Lock,
  Send,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Navigation from "@/components/navigation"
import { useStore } from "@/lib/store"
import { notFound } from "next/navigation"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ProductDetailProps {
  params: {
    id: string
  }
}

export default function ProductDetail({ params }: ProductDetailProps) {
  const { state, dispatch } = useStore()
  const product = state.products.find((p) => p.id === params.id)
  const [userRating, setUserRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!product) {
    notFound()
  }

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", product })
    toast.success(`${product.title} añadido al carrito`)
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()

    if (!state.currentUser) {
      toast.error("Debes iniciar sesión para dejar una reseña")
      return
    }

    if (!reviewComment.trim()) {
      toast.error("Por favor, escribe un comentario")
      return
    }

    setIsSubmitting(true)

    // Simular delay
    setTimeout(() => {
      const newReview = {
        userId: state.currentUser!.id,
        productId: product.id,
        rating: userRating,
        comment: reviewComment,
        verified: true,
      }

      dispatch({ type: "ADD_REVIEW", review: newReview })

      toast.success("¡Reseña enviada con éxito!")
      setReviewComment("")
      setUserRating(5)
      setIsSubmitting(false)
    }, 1000)
  }

  const getBadgeColor = (category: string) => {
    switch (category) {
      case "digital":
        return "bg-neon-blue text-black"
      case "physical":
        return "bg-neon-pink text-black"
      case "service":
        return "bg-neon-green text-black"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "digital":
        return "Digital"
      case "physical":
        return "Físico"
      case "service":
        return "Servicio"
      default:
        return category
    }
  }

  // Ordenar reseñas por fecha (más recientes primero)
  const sortedReviews = [...product.reviewsList].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="min-h-screen bg-black grid-pattern">
      <Navigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a productos
          </Link>
        </div>

        <div className="grid md:grid-cols-[1fr_400px] gap-8">
          {/* Product Images and Details */}
          <div>
            <div className="bg-graphite border border-gray-800 rounded-lg overflow-hidden mb-6">
              <div className="aspect-video bg-gradient-to-br from-purple-900/40 to-blue-900/40 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Package className="h-32 w-32 text-gray-600" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <button className="bg-graphite border border-purple-600 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                <Package className="h-10 w-10 text-gray-600" />
              </button>
              <button className="bg-graphite border border-gray-800 hover:border-purple-600 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                <Package className="h-10 w-10 text-gray-600" />
              </button>
              <button className="bg-graphite border border-gray-800 hover:border-purple-600 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                <Package className="h-10 w-10 text-gray-600" />
              </button>
              <button className="bg-graphite border border-gray-800 hover:border-purple-600 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                <Package className="h-10 w-10 text-gray-600" />
              </button>
            </div>

            <Tabs defaultValue="description" className="mb-6">
              <TabsList className="bg-graphite border border-gray-800 rounded-lg p-1">
                <TabsTrigger
                  value="description"
                  className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300"
                >
                  Descripción
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300"
                >
                  Especificaciones
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300"
                >
                  Reseñas ({product.reviews})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <div className="bg-graphite border border-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">{product.title}</h3>
                  <p className="text-gray-300 mb-4">{product.description}</p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-neon-green mt-0.5" />
                      <div>
                        <h4 className="font-medium">Entrega Segura</h4>
                        <p className="text-sm text-gray-400">Proceso de entrega encriptado y seguro</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-neon-green mt-0.5" />
                      <div>
                        <h4 className="font-medium">Soporte 24/7</h4>
                        <p className="text-sm text-gray-400">Asistencia técnica disponible siempre</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-neon-green mt-0.5" />
                      <div>
                        <h4 className="font-medium">Garantía</h4>
                        <p className="text-sm text-gray-400">30 días de garantía de devolución</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-neon-green mt-0.5" />
                      <div>
                        <h4 className="font-medium">Actualizaciones</h4>
                        <p className="text-sm text-gray-400">Actualizaciones gratuitas incluidas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="mt-4">
                <div className="bg-graphite border border-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Especificaciones Técnicas</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-[120px_1fr] gap-4 pb-3 border-b border-gray-800">
                      <span className="text-gray-400">Categoría</span>
                      <span>{getCategoryLabel(product.category)}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-4 pb-3 border-b border-gray-800">
                      <span className="text-gray-400">Precio</span>
                      <span>${product.price.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-4 pb-3 border-b border-gray-800">
                      <span className="text-gray-400">Valoración</span>
                      <span>{product.rating}/5 estrellas</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-4 pb-3 border-b border-gray-800">
                      <span className="text-gray-400">Reseñas</span>
                      <span>{product.reviews} valoraciones</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-4">
                      <span className="text-gray-400">Disponibilidad</span>
                      <span className={product.inStock ? "text-green-400" : "text-red-400"}>
                        {product.inStock ? "En stock" : "Agotado"}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <div className="bg-graphite border border-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Reseñas de Clientes</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(product.rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{product.rating}</span>
                      <span className="text-sm text-gray-400">({product.reviews} reseñas)</span>
                    </div>
                  </div>

                  {/* Formulario para añadir reseña */}
                  {state.currentUser && (
                    <div className="mb-6 p-4 border border-gray-700 rounded-lg">
                      <h4 className="font-medium mb-3">Deja tu opinión</h4>
                      <form onSubmit={handleSubmitReview}>
                        <div className="mb-4">
                          <Label htmlFor="rating" className="block mb-2 text-sm">
                            Tu valoración
                          </Label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setUserRating(star)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`h-6 w-6 ${
                                    star <= userRating ? "fill-yellow-500 text-yellow-500" : "text-gray-600"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <Label htmlFor="comment" className="block mb-2 text-sm">
                            Tu comentario
                          </Label>
                          <Textarea
                            id="comment"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Comparte tu experiencia con este producto..."
                            className="bg-black border-gray-800 focus:border-purple-600 min-h-[100px]"
                            required
                          />
                        </div>
                        <Button type="submit" className="bg-purple-700 hover:bg-purple-600" disabled={isSubmitting}>
                          {isSubmitting ? "Enviando..." : "Enviar Reseña"}
                          <Send className="ml-2 h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  )}

                  <div className="space-y-6">
                    {sortedReviews.length > 0 ? (
                      sortedReviews.map((review) => (
                        <div key={review.id} className="pb-6 border-b border-gray-800">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 border border-gray-800">
                              <AvatarFallback className="bg-dark-purple text-xs">
                                {review.userName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{review.userName}</p>
                                  <div className="flex items-center gap-2">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-3.5 w-3.5 ${
                                            i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-600"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    {review.verified && (
                                      <span className="text-xs text-gray-400">Compra verificada</span>
                                    )}
                                  </div>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="mt-2 text-gray-300">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-400">
                        <p>No hay reseñas todavía. ¡Sé el primero en opinar!</p>
                      </div>
                    )}

                    {sortedReviews.length > 5 && (
                      <Button variant="outline" className="w-full border-gray-800 hover:bg-gray-900">
                        Cargar Más Reseñas
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Purchase Panel */}
          <div className="space-y-6">
            <div className="bg-graphite border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Badge className={`${getBadgeColor(product.category)} font-medium`}>
                  {getCategoryLabel(product.category)}
                </Badge>
                <div className="flex items-center gap-1">
                  <div
                    className={`h-2 w-2 rounded-full ${product.inStock ? "bg-neon-green animate-pulse" : "bg-red-500"}`}
                  ></div>
                  <span className="text-xs text-gray-400">{product.inStock ? "En Stock" : "Agotado"}</span>
                </div>
              </div>

              <h1 className="text-2xl font-bold mb-2">{product.title}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400">({product.reviews} reseñas)</span>
              </div>

              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                <Badge variant="outline" className="text-neon-green border-neon-green">
                  Precio Especial
                </Badge>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-neon-green" />
                  <span className="text-gray-300">Entrega digital instantánea</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-neon-green" />
                  <span className="text-gray-300">Métodos de pago seguros</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-neon-green" />
                  <span className="text-gray-300">Garantía de 30 días</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-purple-700 hover:bg-purple-600 text-white h-12"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.inStock ? "Añadir al Carrito" : "Producto Agotado"}
                </Button>
                <Link href="/checkout">
                  <Button
                    variant="outline"
                    className="w-full border-gray-800 hover:bg-gray-900 h-12"
                    disabled={!product.inStock}
                  >
                    Comprar Ahora
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-graphite border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Métodos de Pago</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border border-gray-700 rounded-md hover:border-purple-600 cursor-pointer">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">Tarjeta de Crédito</p>
                    <p className="text-xs text-gray-400">Visa, Mastercard, American Express</p>
                  </div>
                  <Badge variant="outline" className="text-neon-green border-neon-green text-xs">
                    Recomendado
                  </Badge>
                </div>

                <div className="flex items-center gap-3 p-3 border border-gray-700 rounded-md hover:border-purple-600 cursor-pointer">
                  <Wallet className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">PayPal</p>
                    <p className="text-xs text-gray-400">Pago rápido y seguro</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border border-gray-700 rounded-md hover:border-purple-600 cursor-pointer">
                  <Wallet className="h-5 w-5 text-purple-500" />
                  <div className="flex-1">
                    <p className="font-medium">Saldo de Cuenta</p>
                    <p className="text-xs text-gray-400">Saldo actual: $1,250.00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-graphite border border-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-neon-green" />
                <h3 className="text-lg font-semibold">Transacción Segura</h3>
              </div>

              <div className="space-y-3 text-sm text-gray-400">
                <p>• Todas las transacciones están encriptadas de extremo a extremo</p>
                <p>• No se almacena información personal</p>
                <p>• Los pagos se procesan a través de canales seguros</p>
                <p>• Los detalles de la tarjeta nunca se almacenan en nuestros servidores</p>
              </div>

              <div className="flex items-center gap-1 mt-4">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-xs text-yellow-500">
                  Para máxima privacidad, use tarjetas virtuales o prepago
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
