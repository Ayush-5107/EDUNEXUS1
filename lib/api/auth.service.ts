import { apiClient } from "./client"
import type { BackendUser, LoginRequest } from "./types"

/**
 * POST /auth/login
 * Logs in a user by email. Backend returns the User entity directly.
 */
export async function loginUser(email: string, password?: string): Promise<BackendUser> {
  const payload: LoginRequest = { email, password }
  return apiClient<BackendUser>("/auth/login", {
    method: "POST",
    body: payload,
  })
}

/**
 * POST /auth/register
 * Registers a new user. Backend returns the created User entity.
 */
export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: "STUDENT" | "TEACHER" | "ADMIN"
  department: string
  semester?: number | null
}

export async function registerUser(
  data: RegisterRequest
): Promise<BackendUser> {
  return apiClient<BackendUser>("/auth/register", {
    method: "GET",
    body: data,
  })
}
