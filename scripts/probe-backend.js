// Probe the backend to discover available endpoints
const BASE = "https://edunexus-backend-nv75.onrender.com"

const endpoints = [
  // Auth endpoints
  { method: "POST", path: "/auth/register" },
  { method: "POST", path: "/auth/signup" },
  { method: "POST", path: "/api/auth/register" },
  { method: "POST", path: "/api/auth/signup" },
  { method: "POST", path: "/users/register" },
  { method: "POST", path: "/users/signup" },
  { method: "POST", path: "/api/users/register" },
  { method: "POST", path: "/register" },
  { method: "POST", path: "/signup" },
  // Login variations
  { method: "POST", path: "/auth/login" },
  { method: "POST", path: "/api/auth/login" },
  { method: "POST", path: "/login" },
  // General discovery
  { method: "GET", path: "/" },
  { method: "GET", path: "/api" },
  { method: "GET", path: "/health" },
  { method: "GET", path: "/api/health" },
  { method: "GET", path: "/actuator" },
  { method: "GET", path: "/swagger-ui.html" },
  { method: "GET", path: "/swagger-ui/index.html" },
  { method: "GET", path: "/v3/api-docs" },
  { method: "GET", path: "/v2/api-docs" },
  // Academic endpoints 
  { method: "GET", path: "/academic/subjects" },
  { method: "GET", path: "/api/academic/subjects" },
]

const testBody = JSON.stringify({
  name: "Test User",
  email: "test@test.com",
  password: "test123",
  role: "STUDENT",
  department: "CS"
})

async function run() {
  for (const ep of endpoints) {
    try {
      const opts = {
        method: ep.method,
        headers: { "Content-Type": "application/json" },
      }
      if (ep.method === "POST") {
        opts.body = testBody
      }
      const res = await fetch(`${BASE}${ep.path}`, opts)
      const contentType = res.headers.get("content-type") || ""
      let body = ""
      if (contentType.includes("json")) {
        body = JSON.stringify(await res.json())
      } else {
        const text = await res.text()
        body = text.substring(0, 200)
      }
      console.log(`${ep.method} ${ep.path} => ${res.status} ${res.statusText} | ${body}`)
    } catch (err) {
      console.log(`${ep.method} ${ep.path} => ERROR: ${err.message}`)
    }
  }
}

run()
