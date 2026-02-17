"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type UserRole = "student" | "faculty" | "admin"

export interface User {
  name: string
  email: string
  role: UserRole
  department: string
  avatar: string
  id: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string, role: UserRole, department: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const MOCK_USERS: Record<string, User & { password: string }> = {
  "student@edu.in": {
    id: "s1",
    name: "Aarav Sharma",
    email: "student@edu.in",
    role: "student",
    department: "Computer Science",
    avatar: "AS",
    password: "student123",
  },
  "faculty@edu.in": {
    id: "f1",
    name: "Dr. Priya Nair",
    email: "faculty@edu.in",
    role: "faculty",
    department: "Electrical Engineering",
    avatar: "PN",
    password: "faculty123",
  },
  "admin@edu.in": {
    id: "a1",
    name: "Rajesh Kumar",
    email: "admin@edu.in",
    role: "admin",
    department: "Administration",
    avatar: "RK",
    password: "admin123",
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [extraUsers, setExtraUsers] = useState<Record<string, User & { password: string }>>({})

  const allUsers = { ...MOCK_USERS, ...extraUsers }

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const found = { ...MOCK_USERS, ...extraUsers }[email.toLowerCase()]
    if (!found) {
      return { success: false, error: "No account found with this email" }
    }
    if (found.password !== password) {
      return { success: false, error: "Incorrect password" }
    }

    const { password: _, ...userWithoutPassword } = found
    setUser(userWithoutPassword)
    return { success: true }
  }, [extraUsers])

  const signup = useCallback(async (name: string, email: string, password: string, role: UserRole, department: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const key = email.toLowerCase()
    if (MOCK_USERS[key] || extraUsers[key]) {
      return { success: false, error: "An account with this email already exists" }
    }
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" }
    }

    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    const newUser: User & { password: string } = {
      id: `u_${Date.now()}`,
      name,
      email: key,
      role,
      department,
      avatar: initials,
      password,
    }

    setExtraUsers(prev => ({ ...prev, [key]: newUser }))
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    return { success: true }
  }, [extraUsers])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
