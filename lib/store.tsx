"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

export interface Product {
  id: string
  title: string
  description: string
  price: number
  rating: number
  reviews: number
  category: "digital" | "physical" | "service"
  image?: string
  inStock: boolean
  reviewsList: Review[]
}

export interface Review {
  id: string
  userId: string
  userName: string
  productId: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  subject: string
  content: string
  date: string
  read: boolean
  replied: boolean
}

export interface CartItem extends Product {
  quantity: number
}

export interface User {
  id: string
  email: string
  password: string
  name: string
  isAdmin: boolean
  createdAt: string
  lastLogin?: string
  isActive: boolean
}

interface StoreState {
  products: Product[]
  cart: CartItem[]
  users: User[]
  currentUser: User | null
  messages: Message[]
  unreadMessages: number
}

type StoreAction =
  | { type: "ADD_TO_CART"; product: Product }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "ADD_PRODUCT"; product: Product }
  | { type: "UPDATE_PRODUCT"; product: Product }
  | { type: "DELETE_PRODUCT"; productId: string }
  | { type: "REGISTER_USER"; user: Omit<User, "id" | "createdAt" | "lastLogin"> }
  | { type: "LOGIN"; email: string; password: string }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; user: User }
  | { type: "DELETE_USER"; userId: string }
  | { type: "TOGGLE_USER_STATUS"; userId: string }
  | { type: "ADD_REVIEW"; review: Omit<Review, "id" | "date" | "userName"> }
  | { type: "DELETE_REVIEW"; reviewId: string; productId: string }
  | { type: "SEND_MESSAGE"; message: Omit<Message, "id" | "date" | "read" | "replied" | "senderName" | "receiverName"> }
  | { type: "READ_MESSAGE"; messageId: string }
  | { type: "DELETE_MESSAGE"; messageId: string }
  | { type: "REPLY_MESSAGE"; messageId: string }
  | { type: "LOAD_DATA"; data: StoreState }

// Función para generar reseñas de ejemplo
const generateReviews = (productId: string): Review[] => {
  const reviewsCount = Math.floor(Math.random() * 5) + 1 // 1-5 reseñas por producto
  const reviews: Review[] = []

  const comments = [
    "Excelente producto, funciona perfectamente.",
    "Muy buena calidad, lo recomiendo.",
    "Cumple con lo prometido, estoy satisfecho.",
    "Buen producto, pero el precio es un poco alto.",
    "La entrega fue rápida y el producto es como se describe.",
    "Funciona bien, pero esperaba un poco más.",
    "Increíble calidad, superó mis expectativas.",
    "Seguro y confiable, volvería a comprar.",
    "El soporte técnico es excelente.",
    "Fácil de usar y muy efectivo.",
  ]

  const names = [
    "CryptoGhost",
    "SecureNode",
    "DarkByte",
    "PhantomUser",
    "AnonymousWolf",
    "CipherMaster",
    "ShadowHunter",
    "PrivacyGuard",
    "SecretAgent",
    "NightRaven",
  ]

  for (let i = 0; i < reviewsCount; i++) {
    const rating = Math.floor(Math.random() * 3) + 3 // Ratings entre 3-5
    reviews.push({
      id: `review-${productId}-${i}`,
      userId: `user-${i}`,
      userName: names[Math.floor(Math.random() * names.length)],
      productId,
      rating,
      comment: comments[Math.floor(Math.random() * comments.length)],
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(), // Últimos 30 días
      verified: Math.random() > 0.3, // 70% de probabilidad de ser verificado
    })
  }

  return reviews
}

// Función para calcular la valoración media de un producto
const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((total, review) => total + review.rating, 0)
  return Number.parseFloat((sum / reviews.length).toFixed(1))
}

const initialProducts: Product[] = [
  {
    id: "vpn-service",
    title: "Premium VPN Service",
    description: "Secure, anonymous VPN with no logs policy. Includes 10 server locations.",
    price: 99.99,
    rating: 0,
    reviews: 0,
    category: "digital",
    inStock: true,
    reviewsList: [],
  },
  {
    id: "cloud-storage",
    title: "Secure Cloud Storage",
    description: "End-to-end encrypted cloud storage with zero knowledge architecture.",
    price: 149.99,
    rating: 0,
    reviews: 0,
    category: "service",
    inStock: true,
    reviewsList: [],
  },
  {
    id: "security-key",
    title: "Hardware Security Key",
    description: "Physical security key for two-factor authentication. Tamper-resistant design.",
    price: 79.99,
    rating: 0,
    reviews: 0,
    category: "physical",
    inStock: true,
    reviewsList: [],
  },
  {
    id: "encrypted-messenger",
    title: "Encrypted Messenger",
    description: "End-to-end encrypted messaging app with self-destructing messages.",
    price: 49.99,
    rating: 0,
    reviews: 0,
    category: "digital",
    inStock: true,
    reviewsList: [],
  },
  {
    id: "privacy-router",
    title: "Privacy Router",
    description: "Hardware router with built-in VPN and Tor capabilities for complete network privacy.",
    price: 199.99,
    rating: 0,
    reviews: 0,
    category: "physical",
    inStock: true,
    reviewsList: [],
  },
  {
    id: "secure-email",
    title: "Secure Email Service",
    description: "Encrypted email service with zero access to your data. Includes custom domain option.",
    price: 59.99,
    rating: 0,
    reviews: 0,
    category: "service",
    inStock: true,
    reviewsList: [],
  },
  {
    id: "password-manager",
    title: "Password Manager Pro",
    description: "Advanced password manager with biometric authentication and secure sharing.",
    price: 39.99,
    rating: 0,
    reviews: 0,
    category: "digital",
    inStock: true,
    reviewsList: [],
  },
  {
    id: "encrypted-phone",
    title: "Encrypted Smartphone",
    description: "Military-grade encrypted smartphone with secure OS and hardware protection.",
    price: 899.99,
    rating: 0,
    reviews: 0,
    category: "physical",
    inStock: true,
    reviewsList: [],
  },
  {
    id: "secure-hosting",
    title: "Anonymous Web Hosting",
    description: "Offshore web hosting with complete anonymity and DDoS protection.",
    price: 29.99,
    rating: 0,
    reviews: 0,
    category: "service",
    inStock: true,
    reviewsList: [],
  },
  {
    id: "crypto-wallet",
    title: "Hardware Crypto Wallet",
    description: "Cold storage cryptocurrency wallet with multi-currency support.",
    price: 129.99,
    rating: 0,
    reviews: 0,
    category: "physical",
    inStock: true,
    reviewsList: [],
  },
  {
    id: "secure-browser",
    title: "Privacy Browser License",
    description: "Ultra-secure browser with built-in VPN, ad blocker, and tracker protection.",
    price: 19.99,
    rating: 0,
    reviews: 0,
    category: "digital",
    inStock: true,
    reviewsList: [],
  },
  {
    id: "penetration-testing",
    title: "Penetration Testing Service",
    description: "Professional security audit and penetration testing for your infrastructure.",
    price: 499.99,
    rating: 0,
    reviews: 0,
    category: "service",
    inStock: true,
    reviewsList: [],
  },
].map((product) => {
  // Generar reseñas para cada producto
  const reviewsList = generateReviews(product.id)
  return {
    ...product,
    reviewsList,
    rating: calculateAverageRating(reviewsList),
    reviews: reviewsList.length,
  }
})

// Mensajes de ejemplo
const initialMessages: Message[] = [
  {
    id: "msg-1",
    senderId: "admin-1",
    senderName: "Administrator",
    receiverId: "user-1",
    receiverName: "Usuario Regular",
    subject: "Bienvenido a SecureMarket",
    content:
      "Hola, bienvenido a nuestra plataforma. Estamos encantados de tenerte como usuario. Si tienes alguna pregunta, no dudes en contactarnos.",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    replied: false,
  },
  {
    id: "msg-2",
    senderId: "admin-1",
    senderName: "Administrator",
    receiverId: "user-1",
    receiverName: "Usuario Regular",
    subject: "Oferta especial para ti",
    content:
      "Hemos notado que estás interesado en nuestros productos de seguridad. Te ofrecemos un 10% de descuento en tu próxima compra con el código SECURE10.",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    replied: false,
  },
  {
    id: "msg-3",
    senderId: "system",
    senderName: "Sistema",
    receiverId: "user-1",
    receiverName: "Usuario Regular",
    subject: "Actualización de seguridad",
    content:
      "Hemos actualizado nuestras políticas de seguridad. Por favor, revisa la nueva documentación en tu próximo inicio de sesión.",
    date: new Date().toISOString(),
    read: false,
    replied: false,
  },
]

const initialUsers: User[] = [
  {
    id: "admin-1",
    email: "admin",
    password: "admin",
    name: "Administrator",
    isAdmin: true,
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "user-1",
    email: "user",
    password: "user",
    name: "Usuario Regular",
    isAdmin: false,
    createdAt: new Date().toISOString(),
    isActive: true,
  },
]

const initialState: StoreState = {
  products: initialProducts,
  cart: [],
  users: initialUsers,
  currentUser: null,
  messages: initialMessages,
  unreadMessages: initialMessages.length,
}

// Función para validar la fortaleza de la contraseña
export function validatePassword(password: string) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const score = Object.values(checks).filter(Boolean).length
  let strength: "weak" | "medium" | "strong" | "very-strong"
  let color: string

  if (score <= 2) {
    strength = "weak"
    color = "bg-red-500"
  } else if (score === 3) {
    strength = "medium"
    color = "bg-yellow-500"
  } else if (score === 4) {
    strength = "strong"
    color = "bg-blue-500"
  } else {
    strength = "very-strong"
    color = "bg-green-500"
  }

  return { checks, score, strength, color, percentage: (score / 5) * 100 }
}

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.cart.find((item) => item.id === action.product.id)
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.product.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.product, quantity: 1 }],
      }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.productId),
      }

    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.id !== action.productId),
        }
      }
      return {
        ...state,
        cart: state.cart.map((item) => (item.id === action.productId ? { ...item, quantity: action.quantity } : item)),
      }

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      }

    case "ADD_PRODUCT":
      return {
        ...state,
        products: [...state.products, action.product],
      }

    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) => (product.id === action.product.id ? action.product : product)),
      }

    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.productId),
      }

    case "REGISTER_USER":
      const newUser: User = {
        ...action.user,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      return {
        ...state,
        users: [...state.users, newUser],
      }

    case "LOGIN":
      const user = state.users.find((u) => u.email === action.email && u.password === action.password && u.isActive)
      if (user) {
        const updatedUser = { ...user, lastLogin: new Date().toISOString() }
        return {
          ...state,
          currentUser: updatedUser,
          users: state.users.map((u) => (u.id === user.id ? updatedUser : u)),
        }
      }
      return state

    case "LOGOUT":
      return {
        ...state,
        currentUser: null,
        cart: [],
      }

    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) => (user.id === action.user.id ? action.user : user)),
        currentUser: state.currentUser?.id === action.user.id ? action.user : state.currentUser,
      }

    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.userId),
        currentUser: state.currentUser?.id === action.userId ? null : state.currentUser,
      }

    case "TOGGLE_USER_STATUS":
      return {
        ...state,
        users: state.users.map((user) => (user.id === action.userId ? { ...user, isActive: !user.isActive } : user)),
      }

    case "ADD_REVIEW": {
      if (!state.currentUser) return state

      const newReview: Review = {
        ...action.review,
        id: `review-${Date.now()}`,
        date: new Date().toISOString(),
        userName: state.currentUser.name,
      }

      const updatedProducts = state.products.map((product) => {
        if (product.id === action.review.productId) {
          const updatedReviews = [...product.reviewsList, newReview]
          return {
            ...product,
            reviewsList: updatedReviews,
            rating: calculateAverageRating(updatedReviews),
            reviews: updatedReviews.length,
          }
        }
        return product
      })

      return {
        ...state,
        products: updatedProducts,
      }
    }

    case "DELETE_REVIEW": {
      const updatedProducts = state.products.map((product) => {
        if (product.id === action.productId) {
          const updatedReviews = product.reviewsList.filter((review) => review.id !== action.reviewId)
          return {
            ...product,
            reviewsList: updatedReviews,
            rating: calculateAverageRating(updatedReviews),
            reviews: updatedReviews.length,
          }
        }
        return product
      })

      return {
        ...state,
        products: updatedProducts,
      }
    }

    case "SEND_MESSAGE": {
      if (!state.currentUser) return state

      const receiver = state.users.find((user) => user.id === action.message.receiverId)
      if (!receiver) return state

      const newMessage: Message = {
        ...action.message,
        id: `msg-${Date.now()}`,
        date: new Date().toISOString(),
        read: false,
        replied: false,
        senderName: state.currentUser.name,
        receiverName: receiver.name,
      }

      return {
        ...state,
        messages: [...state.messages, newMessage],
        unreadMessages:
          state.currentUser.id === action.message.receiverId ? state.unreadMessages + 1 : state.unreadMessages,
      }
    }

    case "READ_MESSAGE": {
      const updatedMessages = state.messages.map((message) =>
        message.id === action.messageId ? { ...message, read: true } : message,
      )

      // Recalcular mensajes no leídos
      const unreadCount = state.currentUser
        ? updatedMessages.filter((m) => m.receiverId === state.currentUser?.id && !m.read).length
        : 0

      return {
        ...state,
        messages: updatedMessages,
        unreadMessages: unreadCount,
      }
    }

    case "DELETE_MESSAGE": {
      const updatedMessages = state.messages.filter((message) => message.id !== action.messageId)

      // Recalcular mensajes no leídos
      const unreadCount = state.currentUser
        ? updatedMessages.filter((m) => m.receiverId === state.currentUser?.id && !m.read).length
        : 0

      return {
        ...state,
        messages: updatedMessages,
        unreadMessages: unreadCount,
      }
    }

    case "REPLY_MESSAGE": {
      const updatedMessages = state.messages.map((message) =>
        message.id === action.messageId ? { ...message, replied: true } : message,
      )

      return {
        ...state,
        messages: updatedMessages,
      }
    }

    case "LOAD_DATA":
      return action.data

    default:
      return state
  }
}

const StoreContext = createContext<{
  state: StoreState
  dispatch: React.Dispatch<StoreAction>
} | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState)

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const savedData = localStorage.getItem("securemarket-data")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        dispatch({ type: "LOAD_DATA", data: parsedData })
      } catch (error) {
        console.error("Error loading saved data:", error)
      }
    }
  }, [])

  // Guardar datos en localStorage cuando cambie el estado
  useEffect(() => {
    localStorage.setItem("securemarket-data", JSON.stringify(state))
  }, [state])

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
