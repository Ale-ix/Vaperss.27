"use client"

import Navigation from "@/components/navigation"
import Sidebar from "@/components/sidebar"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { useState } from "react"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { state } = useStore()
  const { category } = params
  const [searchTerm, setSearchTerm] = useState("")

  // Validar categoría
  const validCategories = ["digital", "physical", "service", "services"]
  if (!validCategories.includes(category)) {
    notFound()
  }

  // Normalizar "services" a "service" para la búsqueda
  const searchCategory = category === "services" ? "service" : category

  // Filtrar productos por categoría y búsqueda
  const filteredProducts = state.products.filter((product) => {
    const matchesCategory = product.category === searchCategory
    const matchesSearch =
      searchTerm === "" ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Obtener título de la categoría
  const getCategoryTitle = () => {
    switch (category) {
      case "digital":
        return "Productos Digitales"
      case "physical":
        return "Productos Físicos"
      case "service":
      case "services":
        return "Servicios"
      default:
        return "Productos"
    }
  }

  return (
    <div className="min-h-screen bg-black grid-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-6 grid md:grid-cols-[240px_1fr] gap-6">
        <Sidebar />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {getCategoryTitle()} ({filteredProducts.length})
            </h1>
            <div className="flex md:hidden items-center">
              <Button variant="outline" size="sm" className="border-gray-800">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={`Buscar en ${getCategoryTitle().toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600 text-sm"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Link href="/products">
              <Button variant="outline" size="sm" className="border-gray-800 hover:bg-gray-900">
                Todos
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-800 bg-purple-900/30 text-purple-300 border-purple-600"
            >
              {getCategoryTitle()}
            </Button>
            <Button variant="outline" size="sm" className="border-gray-800 hover:bg-gray-900">
              Mejor Valorados
            </Button>
            <Button variant="outline" size="sm" className="border-gray-800 hover:bg-gray-900">
              Precio: Bajo a Alto
            </Button>
            <Button variant="outline" size="sm" className="border-gray-800 hover:bg-gray-900">
              Precio: Alto a Bajo
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => <ProductCard key={product.id} {...product} />)
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-400">
                  {searchTerm
                    ? `No se encontraron productos que coincidan con "${searchTerm}" en esta categoría.`
                    : "No se encontraron productos en esta categoría."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
