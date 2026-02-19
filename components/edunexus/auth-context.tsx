"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import { loginUser } from "@/lib/api/auth.service"
import {
  mapBackendUserToFrontend,
  type FrontendUser,
  type FrontendUserRole,
} from "@/lib/api/types"
import { ApiError } from "@/lib/api/client"

export type UserRole = FrontendUserRole

export interface User {
  name: string
  email: string
  role: UserRole
  department: string
  avatar: string
  id: string
  semester?: number | null
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>
  signup: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    department: string
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Fallback mock users for when the backend is unreachable
const MOCK_USERS: Record<string, User & { password: string }> = {
  "student@email.com": {
    id: "s1",
    name: "John Doe",
    email: "student@email.com",
    role: "student",
    department: "CS",
    avatar: "JD",
    password: "password",
    semester: 3,
  },
  "teacher@email.com": {
    id: "f1",
    name: "Prof Smith",
    email: "teacher@email.com",
    role: "faculty",
    department: "CS",
    avatar: "PS",
    password: "password",
  },
  "admin@email.com": {
    id: "a1",
    name: "Admin User",
    email: "admin@email.com",
    role: "admin",
    department: "AdminDept",
    avatar: "AU",
    password: "password",
  },
  // Legacy demo accounts (for backward compat)
  "student@edu.in": {
    id: "s2",
    name: "Aarav Sharma",
    email: "student@edu.in",
    role: "student",
    department: "Computer Science",
    avatar: "AS",
    password: "student123",
    semester: 3,
  },
  "faculty@edu.in": {
    id: "f2",
    name: "Dr. Priya Nair",
    email: "faculty@edu.in",
    role: "faculty",
    department: "Electrical Engineering",
    avatar: "PN",
    password: "faculty123",
  },
  "admin@edu.in": {
    id: "a2",
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

  const login = useCallback(async (email: string, _password: string) => {
    // Retry helper for cold-starting Render instances
    const tryLogin = async (retries: number): Promise<FrontendUser> => {
      try {
        const backendUser = await loginUser(email)
        return mapBackendUserToFrontend(backendUser)
      } catch (err) {
        // 502/503 = proxy reached backend but it's still waking up
        const isServerWaking =
          err instanceof ApiError && (err.status === 502 || err.status === 503)
        if (isServerWaking && retries > 0) {
          await new Promise((r) => setTimeout(r, 3000))
          return tryLogin(retries - 1)
        }
        throw err
      }
    }

    try {
      // Try the real backend first (with up to 3 retries for cold-start)
      const frontendUser = await tryLogin(3)
      setUser(frontendUser)
      return { success: true }
    } catch (err) {
      // For any error (4xx from backend like 404 user-not-found, network errors,
      // or 5xx), try to fall back to mock auth for demo accounts
      console.warn(
        "[EduNexus] Backend login failed, falling back to mock auth:",
        err instanceof ApiError ? `${err.status} ${err.message}` : String(err)
      )
      const found = MOCK_USERS[email.toLowerCase()]
      if (!found) {
        // No mock account either -- report the original backend error if available
        return {
          success: false,
          error:
            err instanceof ApiError
              ? err.message || "Login failed. Check your credentials."
              : "Backend is offline and no account found for this email.",
        }
      }
      if (found.password !== _password) {
        return { success: false, error: "Incorrect password" }
      }
      const { password: _, ...userWithoutPassword } = found
      setUser(userWithoutPassword)
      return { success: true }
    }
  }, [])

  const signup = useCallback(
    async (
      name: string,
      email: string,
      _password: string,
      role: UserRole,
      department: string
    ) => {
      // The current backend does not have a signup endpoint.
      // For now, create the user locally. When the backend adds POST /auth/register,
      // this can be wired up just like login.
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
      const newUser: User = {
        id: `u_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role,
        department,
        avatar: initials,
      }
      setUser(newUser)
      return { success: true }
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, signup, logout }}
    >
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
