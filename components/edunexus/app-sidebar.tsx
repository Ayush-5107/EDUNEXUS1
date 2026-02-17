"use client"

import { useState } from "react"
import {
  Search,
  Network,
  Users,
  BookOpen,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { icon: Search, label: "Smart Search", id: "search" },
  { icon: Network, label: "Knowledge Graph", id: "graph" },
  { icon: Users, label: "Community", id: "community" },
  { icon: BookOpen, label: "Research Repository", id: "research" },
  { icon: GraduationCap, label: "Faculty Studio", id: "faculty" },
] as const

export type ViewId = (typeof sidebarItems)[number]["id"]

export function AppSidebar({
  activeView,
  onNavigate,
}: {
  activeView: ViewId
  onNavigate: (view: ViewId) => void
}) {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <aside
      className={cn(
        "hidden flex-col border-r border-border bg-sidebar transition-all duration-300 lg:flex",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div className="flex flex-1 flex-col gap-1 px-2 py-4">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              activeView === item.id
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </div>

      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-xl py-2 text-sidebar-foreground/40 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
          <span className="sr-only">{collapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
        </button>
      </div>
    </aside>
  )
}
