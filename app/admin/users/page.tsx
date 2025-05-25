"use client"

import type React from "react"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore, type User } from "@/lib/store"
import { Plus, Edit, Trash2, UserIcon, Shield, ShieldOff, Search, Calendar, Mail } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function UsersAdminPage() {
  const { state, dispatch } = useStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    isAdmin: false,
  })

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      name: "",
      isAdmin: false,
    })
    setEditingUser(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.name || (!editingUser && !formData.password)) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    if (editingUser) {
      const updatedUser: User = {
        ...editingUser,
        email: formData.email,
        name: formData.name,
        isAdmin: formData.isAdmin,
        ...(formData.password && { password: formData.password }),
      }
      dispatch({ type: "UPDATE_USER", user: updatedUser })
      toast.success("Usuario actualizado correctamente")
    } else {
      // Verificar si el email ya existe
      const existingUser = state.users.find((user) => user.email === formData.email)
      if (existingUser) {
        toast.error("Ya existe un usuario con este email")
        return
      }

      dispatch({
        type: "REGISTER_USER",
        user: {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          isAdmin: formData.isAdmin,
          isActive: true,
        },
      })
      toast.success("Usuario creado correctamente")
    }

    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: "",
      name: user.name,
      isAdmin: user.isAdmin,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (userId: string) => {
    const user = state.users.find((u) => u.id === userId)
    if (user?.isAdmin && state.users.filter((u) => u.isAdmin).length === 1) {
      toast.error("No puedes eliminar el último administrador")
      return
    }

    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      dispatch({ type: "DELETE_USER", userId })
      toast.success("Usuario eliminado correctamente")
    }
  }

  const handleToggleStatus = (userId: string) => {
    const user = state.users.find((u) => u.id === userId)
    if (user?.isAdmin && user.isActive && state.users.filter((u) => u.isAdmin && u.isActive).length === 1) {
      toast.error("No puedes desactivar el último administrador activo")
      return
    }

    dispatch({ type: "TOGGLE_USER_STATUS", userId })
    const updatedUser = state.users.find((u) => u.id === userId)
    toast.success(`Usuario ${updatedUser?.isActive ? "activado" : "desactivado"} correctamente`)
  }

  const filteredUsers = state.users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
          <div>
            <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
            <div className="flex items-center gap-4 mt-2">
              <Link href="/admin" className="text-sm text-gray-400 hover:text-purple-400">
                ← Volver al Panel Admin
              </Link>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-700 hover:bg-purple-600" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-graphite border-gray-800 max-w-md">
              <DialogHeader>
                <DialogTitle>{editingUser ? "Editar Usuario" : "Añadir Nuevo Usuario"}</DialogTitle>
                <DialogDescription>
                  {editingUser ? "Modifica los datos del usuario" : "Completa la información del nuevo usuario"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-black border-gray-800"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-black border-gray-800"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Contraseña {editingUser ? "(dejar vacío para mantener actual)" : "*"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-black border-gray-800"
                    required={!editingUser}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="isAdmin"
                    type="checkbox"
                    checked={formData.isAdmin}
                    onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-700 bg-black text-purple-600 focus:ring-purple-600"
                  />
                  <Label htmlFor="isAdmin">Administrador</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-purple-700 hover:bg-purple-600">
                    {editingUser ? "Actualizar" : "Crear"} Usuario
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

        <div className="grid gap-4">
          <Card className="bg-graphite border-gray-800">
            <CardHeader>
              <CardTitle>Estadísticas de Usuarios</CardTitle>
              <CardDescription>Resumen de cuentas de usuario</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{state.users.length}</div>
                  <div className="text-sm text-gray-400">Total Usuarios</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{state.users.filter((u) => u.isActive).length}</div>
                  <div className="text-sm text-gray-400">Usuarios Activos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{state.users.filter((u) => u.isAdmin).length}</div>
                  <div className="text-sm text-gray-400">Administradores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {state.users.filter((u) => !u.isActive).length}
                  </div>
                  <div className="text-sm text-gray-400">Usuarios Inactivos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-graphite border-gray-800">
            <CardHeader>
              <CardTitle>Lista de Usuarios</CardTitle>
              <CardDescription>Gestiona todas las cuentas de usuario</CardDescription>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm bg-black border-gray-800"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-4 p-4 border border-gray-700 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-full flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{user.name}</h3>
                        {user.isAdmin && (
                          <Badge className="bg-purple-600 text-white text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            user.isActive ? "border-green-600 text-green-400" : "border-red-600 text-red-400"
                          }`}
                        >
                          {user.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Creado: {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                        {user.lastLogin && (
                          <div className="flex items-center gap-1">
                            <span>Último acceso: {new Date(user.lastLogin).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                        className={`border-gray-800 hover:bg-gray-900 ${
                          user.isActive ? "text-yellow-400" : "text-green-400"
                        }`}
                      >
                        {user.isActive ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        className="border-gray-800 hover:bg-gray-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="border-red-800 text-red-400 hover:bg-red-950/20"
                        disabled={user.id === state.currentUser?.id}
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
