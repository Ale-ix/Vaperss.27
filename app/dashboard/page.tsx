"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Navigation from "@/components/navigation"
import Sidebar from "@/components/sidebar"
import ProductCard from "@/components/product-card"
import { useStore } from "@/lib/store"

export default function Dashboard() {
  const { state } = useStore()

  // Mostrar solo los primeros 6 productos en el dashboard
  const featuredProducts = state.products.slice(0, 6)

  return (
    <div className="min-h-screen bg-black grid-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-6 grid md:grid-cols-[240px_1fr] gap-6">
        <Sidebar />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Marketplace</h1>
            <div className="flex md:hidden items-center">
              <Button variant="outline" size="sm" className="border-gray-800">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Link href="/products">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-800 bg-purple-900/30 text-purple-300 border-purple-600"
              >
                Ver Todos
              </Button>
            </Link>
            <Link href="/products/digital">
              <Button variant="outline" size="sm" className="border-gray-800 hover:bg-gray-900">
                Digital
              </Button>
            </Link>
            <Link href="/products/services">
              <Button variant="outline" size="sm" className="border-gray-800 hover:bg-gray-900">
                Servicios
              </Button>
            </Link>
            <Link href="/products/physical">
              <Button variant="outline" size="sm" className="border-gray-800 hover:bg-gray-900">
                Físicos
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="border-gray-800 hover:bg-gray-900">
              Mejor Valorados
            </Button>
          </div>

          {/* Featured Products */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Productos Destacados</h2>
              <Link href="/products">
                <Button variant="outline" size="sm" className="border-gray-800 hover:bg-gray-900">
                  Ver todos
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
