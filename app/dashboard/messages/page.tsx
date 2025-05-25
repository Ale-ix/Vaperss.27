"use client"

import type React from "react"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useStore, type Message } from "@/lib/store"
import { Inbox, SendIcon, Trash2, Search, Mail, MailOpen, Reply, Plus, X, Check } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MessagesPage() {
  const { state, dispatch } = useStore()
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [newMessage, setNewMessage] = useState({
    receiverId: "",
    subject: "",
    content: "",
  })
  const [replyContent, setReplyContent] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!state.currentUser) {
    return (
      <div className="min-h-screen bg-black grid-pattern">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Acceso Denegado</h1>
          <p className="text-gray-400">Debes iniciar sesión para acceder a tus mensajes.</p>
        </div>
      </div>
    )
  }

  // Filtrar mensajes recibidos por el usuario actual
  const inboxMessages = state.messages
    .filter((msg) => msg.receiverId === state.currentUser?.id)
    .filter(
      (msg) =>
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.senderName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Filtrar mensajes enviados por el usuario actual
  const sentMessages = state.messages
    .filter((msg) => msg.senderId === state.currentUser?.id)
    .filter(
      (msg) =>
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.receiverName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message)

    // Marcar como leído si es un mensaje recibido y no está leído
    if (message.receiverId === state.currentUser?.id && !message.read) {
      dispatch({ type: "READ_MESSAGE", messageId: message.id })
    }

    setIsReplying(false)
    setReplyContent("")
  }

  const handleDeleteMessage = (messageId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este mensaje?")) {
      dispatch({ type: "DELETE_MESSAGE", messageId })

      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null)
      }

      toast.success("Mensaje eliminado")
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.receiverId || !newMessage.subject || !newMessage.content) {
      toast.error("Por favor completa todos los campos")
      return
    }

    setIsSubmitting(true)

    // Simular delay
    setTimeout(() => {
      dispatch({
        type: "SEND_MESSAGE",
        message: {
          senderId: state.currentUser!.id,
          receiverId: newMessage.receiverId,
          subject: newMessage.subject,
          content: newMessage.content,
        },
      })

      setNewMessage({
        receiverId: "",
        subject: "",
        content: "",
      })

      setIsComposeOpen(false)
      setIsSubmitting(false)
      toast.success("Mensaje enviado correctamente")
    }, 1000)
  }

  const handleSendReply = () => {
    if (!selectedMessage || !replyContent.trim()) {
      toast.error("Por favor escribe un mensaje de respuesta")
      return
    }

    setIsSubmitting(true)

    // Simular delay
    setTimeout(() => {
      // Enviar respuesta
      dispatch({
        type: "SEND_MESSAGE",
        message: {
          senderId: state.currentUser!.id,
          receiverId: selectedMessage.senderId,
          subject: `RE: ${selectedMessage.subject}`,
          content: replyContent,
        },
      })

      // Marcar el mensaje original como respondido
      dispatch({ type: "REPLY_MESSAGE", messageId: selectedMessage.id })

      setReplyContent("")
      setIsReplying(false)
      setIsSubmitting(false)
      toast.success("Respuesta enviada correctamente")
    }, 1000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()

    // Si es hoy, mostrar solo la hora
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    // Si es este año, mostrar día y mes
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { day: "numeric", month: "short" })
    }

    // Si es otro año, mostrar fecha completa
    return date.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })
  }

  return (
    <div className="min-h-screen bg-black grid-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-6 grid md:grid-cols-[240px_1fr] gap-6">
        <Sidebar />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Mensajes</h1>
            <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-700 hover:bg-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Mensaje
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-graphite border-gray-800 max-w-md">
                <DialogHeader>
                  <DialogTitle>Nuevo Mensaje</DialogTitle>
                  <DialogDescription>Envía un mensaje a otro usuario de la plataforma</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="receiver">Destinatario</Label>
                    <Select
                      value={newMessage.receiverId}
                      onValueChange={(value) => setNewMessage({ ...newMessage, receiverId: value })}
                    >
                      <SelectTrigger className="bg-black border-gray-800">
                        <SelectValue placeholder="Seleccionar destinatario" />
                      </SelectTrigger>
                      <SelectContent>
                        {state.users
                          .filter((user) => user.id !== state.currentUser?.id && user.isActive)
                          .map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name} {user.isAdmin && "(Admin)"}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto</Label>
                    <Input
                      id="subject"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                      className="bg-black border-gray-800"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Mensaje</Label>
                    <Textarea
                      id="content"
                      value={newMessage.content}
                      onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                      className="bg-black border-gray-800 min-h-[150px]"
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1 bg-purple-700 hover:bg-purple-600" disabled={isSubmitting}>
                      {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                      <SendIcon className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsComposeOpen(false)}
                      className="border-gray-800"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid lg:grid-cols-[300px_1fr] gap-4">
            {/* Lista de mensajes */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar mensajes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black border-gray-800"
                />
              </div>

              <Tabs defaultValue="inbox" className="w-full">
                <TabsList className="bg-graphite border border-gray-800 rounded-lg p-1 w-full">
                  <TabsTrigger
                    value="inbox"
                    className="flex-1 data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300"
                  >
                    <Inbox className="h-4 w-4 mr-2" />
                    Recibidos
                  </TabsTrigger>
                  <TabsTrigger
                    value="sent"
                    className="flex-1 data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300"
                  >
                    <SendIcon className="h-4 w-4 mr-2" />
                    Enviados
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="inbox" className="mt-4">
                  <Card className="bg-graphite border-gray-800 p-0 overflow-hidden">
                    <div className="max-h-[500px] overflow-y-auto">
                      {inboxMessages.length > 0 ? (
                        <div className="divide-y divide-gray-800">
                          {inboxMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`p-3 cursor-pointer hover:bg-gray-800/50 transition-colors ${
                                selectedMessage?.id === message.id ? "bg-gray-800/50" : ""
                              } ${!message.read ? "border-l-4 border-l-purple-600" : ""}`}
                              onClick={() => handleSelectMessage(message)}
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 border border-gray-800">
                                  <AvatarFallback className="bg-dark-purple text-xs">
                                    {message.senderName.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p
                                      className={`text-sm font-medium truncate ${!message.read ? "text-white" : "text-gray-300"}`}
                                    >
                                      {message.senderName}
                                    </p>
                                    <span className="text-xs text-gray-500">{formatDate(message.date)}</span>
                                  </div>
                                  <p className={`text-sm truncate ${!message.read ? "font-medium" : "text-gray-400"}`}>
                                    {message.subject}
                                  </p>
                                </div>
                                {!message.read && <Badge className="bg-purple-600 text-white">Nuevo</Badge>}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center text-gray-400">
                          <Mail className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                          <p>No hay mensajes en tu bandeja de entrada</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="sent" className="mt-4">
                  <Card className="bg-graphite border-gray-800 p-0 overflow-hidden">
                    <div className="max-h-[500px] overflow-y-auto">
                      {sentMessages.length > 0 ? (
                        <div className="divide-y divide-gray-800">
                          {sentMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`p-3 cursor-pointer hover:bg-gray-800/50 transition-colors ${
                                selectedMessage?.id === message.id ? "bg-gray-800/50" : ""
                              }`}
                              onClick={() => handleSelectMessage(message)}
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 border border-gray-800">
                                  <AvatarFallback className="bg-dark-purple text-xs">
                                    {message.receiverName.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium truncate text-gray-300">
                                      Para: {message.receiverName}
                                    </p>
                                    <span className="text-xs text-gray-500">{formatDate(message.date)}</span>
                                  </div>
                                  <p className="text-sm truncate text-gray-400">{message.subject}</p>
                                </div>
                                {message.replied && (
                                  <Badge variant="outline" className="border-green-600 text-green-400">
                                    <Check className="h-3 w-3 mr-1" />
                                    Respondido
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center text-gray-400">
                          <SendIcon className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                          <p>No has enviado ningún mensaje</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Detalle del mensaje */}
            <Card className="bg-graphite border-gray-800 p-0 overflow-hidden">
              {selectedMessage ? (
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{selectedMessage.subject}</h2>
                    <div className="flex gap-2">
                      {selectedMessage.receiverId === state.currentUser.id && !selectedMessage.replied && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-800 hover:bg-gray-900"
                          onClick={() => setIsReplying(true)}
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          Responder
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-800 text-red-400 hover:bg-red-950/20"
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-gray-800">
                        <AvatarFallback className="bg-dark-purple text-sm">
                          {(selectedMessage.senderId === state.currentUser.id
                            ? selectedMessage.receiverName
                            : selectedMessage.senderName
                          )
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          {selectedMessage.senderId === state.currentUser.id ? (
                            <>
                              <p className="font-medium">Para: {selectedMessage.receiverName}</p>
                              <Badge variant="outline" className="border-blue-600 text-blue-400">
                                Enviado
                              </Badge>
                            </>
                          ) : (
                            <>
                              <p className="font-medium">De: {selectedMessage.senderName}</p>
                              {selectedMessage.senderId === "system" && (
                                <Badge className="bg-yellow-600 text-white">Sistema</Badge>
                              )}
                              {selectedMessage.senderId === "admin-1" && (
                                <Badge className="bg-purple-600 text-white">Admin</Badge>
                              )}
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{new Date(selectedMessage.date).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1 overflow-y-auto">
                    <div className="whitespace-pre-wrap text-gray-300">{selectedMessage.content}</div>
                  </div>

                  {isReplying && (
                    <div className="p-4 border-t border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Responder</h3>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsReplying(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Responder a ${selectedMessage.senderName}...`}
                        className="bg-black border-gray-800 focus:border-purple-600 min-h-[100px] mb-3"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-800"
                          onClick={() => setIsReplying(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          className="bg-purple-700 hover:bg-purple-600"
                          onClick={handleSendReply}
                          disabled={isSubmitting || !replyContent.trim()}
                        >
                          {isSubmitting ? "Enviando..." : "Enviar Respuesta"}
                          <SendIcon className="ml-2 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-center p-6">
                  <MailOpen className="h-16 w-16 text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No hay mensaje seleccionado</h3>
                  <p className="text-gray-400 mb-6">Selecciona un mensaje de la lista para ver su contenido</p>
                  <Button
                    variant="outline"
                    className="border-gray-800 hover:bg-gray-900"
                    onClick={() => setIsComposeOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Mensaje
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
