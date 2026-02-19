/**
 * API client - All requests go through /api/proxy/... (Next.js API route)
 * which forwards server-side to the backend. This avoids CORS entirely.
 */

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, headers: customHeaders, ...rest } = options

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData

  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...customHeaders,
  }

  const config: RequestInit = {
    ...rest,
    headers,
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  }

  // All requests go through the Next.js proxy route to avoid CORS
  const url = `/api/proxy${endpoint}`
  console.log("[v0] apiClient fetching:", url, "method:", config.method || "GET")

  const response = await fetch(url, config)
  console.log("[v0] apiClient response status:", response.status)

  if (!response.ok) {
    let errorMessage: string
    const ct = response.headers.get("content-type")
    if (ct?.includes("application/json")) {
      const errorBody = await response.json()
      errorMessage = errorBody.message || errorBody.error || JSON.stringify(errorBody)
    } else {
      errorMessage = await response.text()
    }
    throw new ApiError(errorMessage || response.statusText, response.status)
  }

  const ct = response.headers.get("content-type")
  if (ct?.includes("application/json")) {
    return response.json() as Promise<T>
  }

  return response.text() as unknown as T
}

/** Returns the backend base URL (only used server-side by the proxy route) */
export function getBackendUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://edunexus-backend-nv75.onrender.com"
  )
}
