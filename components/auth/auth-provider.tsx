"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { LoginForm } from "./login-form"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "citizen" | "analyst"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo accounts for testing
const DEMO_ACCOUNTS = [
  {
    id: "1",
    email: "admin@smartcity.gov",
    password: "admin123",
    name: "Sarah Johnson",
    role: "admin" as const,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    email: "citizen@example.com",
    password: "citizen123",
    name: "John Doe",
    role: "citizen" as const,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    email: "analyst@smartcity.gov",
    password: "analyst123",
    name: "Dr. Maria Rodriguez",
    role: "analyst" as const,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token
    const storedUser = localStorage.getItem("smart-city-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const account = DEMO_ACCOUNTS.find((acc) => acc.email === email && acc.password === password)

    if (account) {
      const user = {
        id: account.id,
        email: account.email,
        name: account.name,
        role: account.role,
        avatar: account.avatar,
      }
      setUser(user)
      localStorage.setItem("smart-city-user", JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("smart-city-user")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLogin={login} demoAccounts={DEMO_ACCOUNTS} />
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
