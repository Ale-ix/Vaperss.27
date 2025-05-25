"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Package, ShoppingCart, CreditCard } from "lucide-react"
import Link from "next/link"
import { useStore, type Product } from "@/lib/store"
import { toast } from "sonner"

interface ProductCardProps extends Product {}

export default function ProductCard(product: ProductCardProps) {
  const { dispatch } = useStore()

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

  const getGradient = (category: string) => {
    switch (category) {
      case "digital":
        return "from-purple-900/40 to-blue-900/40"
      case "physical":
        return "from-pink-900/40 to-purple-900/40"
      case "service":
        return "from-green-900/40 to-blue-900/40"
      default:
        return "from-gray-900/40 to-gray-800/40"
    }
  }

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", product })
    toast.success(`${product.title} añadido al carrito`)
  }

  return (
    <Card className="bg-graphite border-gray-800 overflow-hidden card-hover">
      <div className="relative">
        <div
          className={`aspect-[4/3] bg-gradient-to-br ${getGradient(product.category)} flex items-center justify-center`}
        >
          {product.image ? (
            <img src={product.image || "/placeholder.svg"} alt={product.title} className="object-cover w-full h-full" />
          ) : (
            <Package className="h-16 w-16 text-gray-600" />
          )}
        </div>
        <Badge className={`absolute top-2 right-2 ${getBadgeColor(product.category)} font-medium`}>
          {getCategoryLabel(product.category)}
        </Badge>
        {!product.inStock && <Badge className="absolute top-2 left-2 bg-red-600 text-white font-medium">Agotado</Badge>}
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg">{product.title}</CardTitle>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <CreditCard className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-400">Tarjeta aceptada</span>
          </div>
          <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button className="w-full bg-purple-700 hover:bg-purple-600 text-white" asChild>
          <Link href={`/product/${product.id}`}>Ver Detalles</Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-gray-800 hover:bg-gray-900"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
