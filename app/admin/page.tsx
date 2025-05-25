"use client"

import type React from "react"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore, type Product } from "@/lib/store"
import { Plus, Edit, Trash2, Package, Users, Settings } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"

export default function AdminPage() {
  const { state, dispatch } = useStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "digital" as "digital" | "physical" | "service",
    image: "",
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "digital",
      image: "",
    })
    setEditingProduct(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.price) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    const productData: Product = {
      id: editingProduct?.id || `product-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      category: formData.category,
      image: formData.image || undefined,
      rating: editingProduct?.rating || 4.0,
      reviews: editingProduct?.reviews || 0,
      inStock: true,
    }

    if (editingProduct) {
      dispatch({ type: "UPDATE_PRODUCT", product: productData })
      toast.success("Producto actualizado correctamente")
    } else {
      dispatch({ type: "ADD_PRODUCT", product: productData })
      toast.success("Producto añadido correctamente")
    }

    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image || "",
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (productId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      dispatch({ type: "DELETE_PRODUCT", productId })
      toast.success("Producto eliminado correctamente")
    }
  }

  if (!state.currentUser?.isAdmin) {
    return (
      <div className="min-h-screen bg-black grid-pattern">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Acceso Denegado</h1>
          <p className="text-gray-400">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black grid-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <div className="flex gap-2">
            <Link href="/admin/users">
              <Button variant="outline" className="border-gray-800 hover:bg-gray-900">
                <Users className="h-4 w-4 mr-2" />
                Gestionar Usuarios
              </Button>
            </Link>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-700 hover:bg-purple-600" onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-graphite border-gray-800 max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? "Editar Producto" : "Añadir Nuevo Producto"}</DialogTitle>
                  <DialogDescription>
                    {editingProduct ? "Modifica los datos del producto" : "Completa la información del nuevo producto"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-black border-gray-800"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-black border-gray-800"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-black border-gray-800"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="bg-black border-gray-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="digital">Digital</SelectItem>
                        <SelectItem value="physical">Físico</SelectItem>
                        <SelectItem value="service">Servicio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">URL de Imagen (opcional)</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="bg-black border-gray-800"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1 bg-purple-700 hover:bg-purple-600">
                      {editingProduct ? "Actualizar" : "Añadir"} Producto
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                      className="border-gray-800"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4">
          <Card className="bg-graphite border-gray-800">
            <CardHeader>
              <CardTitle>Estadísticas del Sistema</CardTitle>
              <CardDescription>Resumen general del marketplace</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{state.products.length}</div>
                  <div className="text-sm text-gray-400">Total Productos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{state.users.length}</div>
                  <div className="text-sm text-gray-400">Total Usuarios</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {state.users.filter((u) => u.isActive).length}
                  </div>
                  <div className="text-sm text-gray-400">Usuarios Activos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {state.users.filter((u) => u.isAdmin).length}
                  </div>
                  <div className="text-sm text-gray-400">Administradores</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-graphite border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Productos por Categoría
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Digital</span>
                    <span className="font-medium text-blue-400">
                      {state.products.filter((p) => p.category === "digital").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Físico</span>
                    <span className="font-medium text-pink-400">
                      {state.products.filter((p) => p.category === "physical").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Servicios</span>
                    <span className="font-medium text-green-400">
                      {state.products.filter((p) => p.category === "service").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-graphite border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gestión de Usuarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/admin/users">
                    <Button variant="outline" className="w-full border-gray-800 hover:bg-gray-900">
                      Ver Todos los Usuarios
                    </Button>
                  </Link>
                  <div className="text-xs text-gray-500">Gestiona cuentas, permisos y estado de usuarios</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-graphite border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuración
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full border-gray-800 hover:bg-gray-900">
                    Configuración General
                  </Button>
                  <div className="text-xs text-gray-500">Ajustes del sistema y configuraciones avanzadas</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-graphite border-gray-800">
            <CardHeader>
              <CardTitle>Gestión de Productos</CardTitle>
              <CardDescription>Lista de todos los productos en el marketplace</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 border border-gray-700 rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-md flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{product.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-1">{product.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm font-bold">${product.price.toFixed(2)}</span>
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded">{product.category}</span>
                        <span className="text-xs text-gray-500">
                          ★ {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="border-gray-800 hover:bg-gray-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        className="border-red-800 text-red-400 hover:bg-red-950/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
