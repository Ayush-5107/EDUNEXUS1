"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"

interface KNode {
  id: string
  label: string
  category: "core" | "definition" | "application" | "related" | "cross"
  x: number
  y: number
  radius: number
}

interface KEdge {
  from: string
  to: string
}

const CATEGORY_COLORS: Record<KNode["category"], string> = {
  core: "oklch(0.65 0.18 250)",
  definition: "oklch(0.60 0.15 200)",
  application: "oklch(0.55 0.20 270)",
  related: "oklch(0.50 0.15 240)",
  cross: "oklch(0.70 0.12 220)",
}

const CATEGORY_LABELS: Record<KNode["category"], string> = {
  core: "Core Concept",
  definition: "Definition",
  application: "Application",
  related: "Related",
  cross: "Cross-discipline",
}

const INITIAL_NODES: KNode[] = [
  { id: "lt", label: "Laplace\nTransform", category: "core", x: 400, y: 280, radius: 52 },
  { id: "def", label: "Definition &\nFormula", category: "definition", x: 180, y: 160, radius: 38 },
  { id: "props", label: "Properties", category: "definition", x: 610, y: 130, radius: 36 },
  { id: "inv", label: "Inverse\nLaplace", category: "related", x: 190, y: 400, radius: 38 },
  { id: "circuit", label: "Circuit\nAnalysis", category: "application", x: 640, y: 350, radius: 38 },
  { id: "ode", label: "Solving\nODEs", category: "application", x: 320, y: 480, radius: 36 },
  { id: "fourier", label: "Fourier\nTransform", category: "cross", x: 100, y: 290, radius: 36 },
  { id: "ztrans", label: "Z-Transform", category: "cross", x: 680, y: 230, radius: 34 },
  { id: "control", label: "Control\nSystems", category: "application", x: 530, y: 470, radius: 36 },
  { id: "transfer", label: "Transfer\nFunctions", category: "related", x: 700, y: 440, radius: 36 },
]

const EDGES: KEdge[] = [
  { from: "lt", to: "def" },
  { from: "lt", to: "props" },
  { from: "lt", to: "inv" },
  { from: "lt", to: "circuit" },
  { from: "lt", to: "ode" },
  { from: "lt", to: "fourier" },
  { from: "lt", to: "ztrans" },
  { from: "lt", to: "control" },
  { from: "circuit", to: "transfer" },
  { from: "control", to: "transfer" },
  { from: "fourier", to: "def" },
  { from: "inv", to: "ode" },
]

function MindMapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<KNode[]>(INITIAL_NODES)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [dragNode, setDragNode] = useState<string | null>(null)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, w, h)
    timeRef.current += 0.01

    // Draw edges
    EDGES.forEach((edge) => {
      const from = nodes.find((n) => n.id === edge.from)
      const to = nodes.find((n) => n.id === edge.to)
      if (!from || !to) return

      const isHighlighted =
        hoveredNode === edge.from || hoveredNode === edge.to

      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.strokeStyle = isHighlighted
        ? "oklch(0.65 0.18 250 / 0.6)"
        : "oklch(0.35 0.04 250 / 0.35)"
      ctx.lineWidth = isHighlighted ? 2 : 1
      ctx.stroke()
    })

    // Draw nodes
    nodes.forEach((node) => {
      const isHovered = hoveredNode === node.id
      const float = Math.sin(timeRef.current + node.x * 0.01) * 3

      const x = node.x
      const y = node.y + float
      const r = node.radius + (isHovered ? 4 : 0)

      // Glow
      if (isHovered || node.category === "core") {
        const grad = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 2)
        const color = CATEGORY_COLORS[node.category]
        grad.addColorStop(0, color.replace(")", " / 0.15)").replace("oklch(", "oklch("))
        grad.addColorStop(1, "transparent")
        ctx.beginPath()
        ctx.arc(x, y, r * 2, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      // Node circle
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = isHovered
        ? "oklch(0.22 0.04 250 / 0.95)"
        : "oklch(0.18 0.03 250 / 0.9)"
      ctx.fill()
      ctx.strokeStyle = CATEGORY_COLORS[node.category]
      ctx.lineWidth = isHovered ? 2.5 : 1.5
      ctx.stroke()

      // Label
      ctx.fillStyle = isHovered ? "oklch(0.95 0.01 250)" : "oklch(0.80 0.02 250)"
      ctx.font = `${node.category === "core" ? "600 13px" : "500 11px"} Inter, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const lines = node.label.split("\n")
      lines.forEach((line, i) => {
        const offset = (i - (lines.length - 1) / 2) * 14
        ctx.fillText(line, x, y + offset)
      })
    })

    animRef.current = requestAnimationFrame(draw)
  }, [nodes, hoveredNode])

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [draw])

  const getNodeAt = (mx: number, my: number) => {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i]
      const dx = mx - n.x
      const float = Math.sin(timeRef.current + n.x * 0.01) * 3
      const dy = my - (n.y + float)
      if (dx * dx + dy * dy < n.radius * n.radius) return n.id
    }
    return null
  }

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { mx: e.clientX - rect.left, my: e.clientY - rect.top }
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="h-[420px] w-full cursor-grab rounded-xl active:cursor-grabbing"
        style={{ touchAction: "none" }}
        onMouseMove={(e) => {
          const { mx, my } = getCanvasCoords(e)
          if (dragNode) {
            setNodes((prev) =>
              prev.map((n) => (n.id === dragNode ? { ...n, x: mx, y: my } : n))
            )
          } else {
            setHoveredNode(getNodeAt(mx, my))
          }
        }}
        onMouseDown={(e) => {
          const { mx, my } = getCanvasCoords(e)
          const id = getNodeAt(mx, my)
          if (id) setDragNode(id)
        }}
        onMouseUp={() => setDragNode(null)}
        onMouseLeave={() => {
          setHoveredNode(null)
          setDragNode(null)
        }}
      />
      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[key as KNode["category"]] }}
            />
            <span className="text-[11px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function KnowledgeGraph({ query }: { query: string }) {
  const [view, setView] = useState<"summary" | "mindmap">("mindmap")

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Knowledge Graph
        </h2>
        <div className="flex items-center gap-1 rounded-xl border border-border bg-secondary/30 p-1">
          <button
            onClick={() => setView("summary")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              view === "summary"
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Summary View
          </button>
          <button
            onClick={() => setView("mindmap")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              view === "mindmap"
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mind Map View
          </button>
        </div>
      </div>

      {view === "mindmap" ? (
        <div className="glass rounded-2xl p-4">
          <MindMapCanvas />
        </div>
      ) : (
        <div className="glass rounded-2xl p-6">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Concept Summary: {query || "Laplace Transform"}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Definitions",
                items: [
                  "Integral transform converting time-domain to frequency-domain",
                  "Defined as L{'{f(t)}'} = F(s) = integral from 0 to infinity",
                ],
              },
              {
                title: "Applications",
                items: [
                  "Circuit analysis (RLC networks)",
                  "Solving ordinary differential equations",
                  "Control system design & transfer functions",
                ],
              },
              {
                title: "Related Concepts",
                items: [
                  "Inverse Laplace Transform",
                  "Partial fraction decomposition",
                  "Convolution theorem",
                ],
              },
              {
                title: "Cross-Disciplinary Links",
                items: [
                  "Fourier Transform (continuous spectra)",
                  "Z-Transform (discrete signals)",
                  "Signal Processing & Communications",
                ],
              },
            ].map((section) => (
              <div
                key={section.title}
                className="rounded-xl border border-border bg-secondary/20 p-4"
              >
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h4>
                <ul className="space-y-1.5">
                  {section.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-secondary-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
