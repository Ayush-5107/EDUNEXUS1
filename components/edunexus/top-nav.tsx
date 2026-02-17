"use client"

import { useState } from "react"
import {
  Search,
  Bell,
  Upload,
  Users,
  Menu,
  X,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TopNav({
  onSearch,
  searchQuery,
}: {
  onSearch: (query: string) => void
  searchQuery: string
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [navSearch, setNavSearch] = useState("")

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">EduNexus</span>
        </div>

        {/* Center Search */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search knowledge base..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && navSearch.trim()) {
                  onSearch(navSearch.trim())
                  setNavSearch("")
                }
              }}
              className="h-9 w-full rounded-xl border border-border bg-secondary/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Right Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          >
            <Users className="mr-1.5 h-4 w-4" />
            Community
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          >
            <Upload className="mr-1.5 h-4 w-4" />
            Upload
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Avatar className="ml-2 h-8 w-8 cursor-pointer border border-border">
            <AvatarFallback className="bg-primary/20 text-xs text-primary">
              EN
            </AvatarFallback>
          </Avatar>
        </nav>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-muted-foreground md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border px-4 pb-4 pt-3 md:hidden">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search knowledge base..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && navSearch.trim()) {
                  onSearch(navSearch.trim())
                  setNavSearch("")
                  setMobileMenuOpen(false)
                }
              }}
              className="h-9 w-full rounded-xl border border-border bg-secondary/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Button variant="ghost" size="sm" className="justify-start text-muted-foreground">
              <Users className="mr-2 h-4 w-4" /> Community
            </Button>
            <Button variant="ghost" size="sm" className="justify-start text-muted-foreground">
              <Upload className="mr-2 h-4 w-4" /> Upload
            </Button>
            <Button variant="ghost" size="sm" className="justify-start text-muted-foreground">
              <Bell className="mr-2 h-4 w-4" /> Notifications
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
