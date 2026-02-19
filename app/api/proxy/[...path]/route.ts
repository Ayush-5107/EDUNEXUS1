import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://edunexus-backend-nv75.onrender.com"

async function proxyRequest(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const backendPath = "/" + path.join("/")
  const url = new URL(backendPath, BACKEND_URL)

  // Forward query params
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  // Build headers - only forward content-type
  const headers: Record<string, string> = {}
  const contentType = req.headers.get("content-type")
  if (contentType) {
    headers["Content-Type"] = contentType
  }

  // Build body
  let body: BodyInit | undefined
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (contentType?.includes("multipart/form-data")) {
      body = await req.arrayBuffer()
    } else {
      body = await req.text()
    }
  }

  try {
    console.log("[v0] Proxy ->", req.method, url.toString())

    const backendRes = await fetch(url.toString(), {
      method: req.method,
      headers,
      body,
    })

    console.log("[v0] Proxy <-", backendRes.status, backendRes.statusText)

    const resContentType = backendRes.headers.get("content-type") || ""
    const resBody = resContentType.includes("application/json")
      ? await backendRes.text()
      : await backendRes.arrayBuffer()

    return new NextResponse(resBody, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: {
        "Content-Type": resContentType || "application/json",
      },
    })
  } catch (error) {
    console.error("[v0] Proxy error:", error)
    return NextResponse.json(
      {
        error:
          "Backend unreachable. It may be cold-starting on Render (~30s). Please retry.",
      },
      { status: 502 }
    )
  }
}

export const GET = proxyRequest
export const POST = proxyRequest
export const PUT = proxyRequest
export const DELETE = proxyRequest
export const PATCH = proxyRequest
