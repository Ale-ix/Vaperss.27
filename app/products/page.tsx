"use client"

import Navigation from "@/components/navigation"
import Sidebar from "@/components/sidebar"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { useState } from "react"

export default function ProductsPage() {
  const { state } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")

  // Filtrar productos por búsqueda
  const filteredProducts = state.products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return a.title.localeCompare(b.title)
    }
  })

  return (
    <div className="min-h-screen bg-black grid-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-6 grid md:grid-cols-[240px_1fr] gap-6">
        <Sidebar />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Todos los Productos ({sortedProducts.length})</h1>
            <div className="flex md:hidden items-center">
              <Button variant="outline" size="sm" className="border-gray-800">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600 text-sm"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black border border-gray-800 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600 text-sm"
            >
              <option value="name">Ordenar por Nombre</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Valorados</option>
            </select>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-800 bg-purple-900/30 text-purple-300 border-purple-600"
            >
              Todos
            </Button>
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
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => <ProductCard key={product.id} {...product} />)
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-400">No se encontraron productos que coincidan con tu búsqueda.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
