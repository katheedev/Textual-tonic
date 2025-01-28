"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

interface User {
  id: string
  username: string
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<Response>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/check-auth", {
        method: "GET",
        credentials: "include", // This is important for including cookies
      })
      if (response.ok) {
        const userData: User = await response.json()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
    }
  }

  useEffect(() => {
    checkAuth()
  }, []) //Fixed: Added empty dependency array [] to useEffect

  const login = async (username: string, password: string): Promise<Response> => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // This is important for including cookies
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        router.push('/dashboard')
      } else {
        throw new Error('Login failed')
      }
      return response
    } catch (error) {
      throw new Error('Login failed')
    }
  }

  const logout = async (): Promise<void> => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // This is important for including cookies
      })

      if (response.ok) {
        setUser(null)

        // Clear all cookies
        Object.keys(Cookies.get()).forEach((cookieName) => {
          Cookies.remove(cookieName, { path: "/" })
        })

        // Clear localStorage
        localStorage.clear()

        // Clear sessionStorage
        sessionStorage.clear()

        router.push("/login")
      } else {
        console.error("Logout failed")
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

