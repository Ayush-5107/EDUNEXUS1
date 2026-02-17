"use client"

import { useState } from "react"
import { TopNav } from "@/components/edunexus/top-nav"
import { AppSidebar, type ViewId } from "@/components/edunexus/app-sidebar"
import { HeroSearch } from "@/components/edunexus/hero-search"
import { SearchResults } from "@/components/edunexus/search-results"
import { KnowledgeGraph } from "@/components/edunexus/knowledge-graph"
import { CommunityDiscussions } from "@/components/edunexus/community-discussions"
import { TrendingSection } from "@/components/edunexus/trending-section"
import { FacultyMode } from "@/components/edunexus/faculty-mode"

type UserMode = "student" | "faculty"

export default function EduNexusPage() {
  const [activeView, setActiveView] = useState<ViewId>("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [userMode, setUserMode] = useState<UserMode>("student")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setHasSearched(true)
    setActiveView("search")
  }

  const handleNavigate = (view: ViewId) => {
    setActiveView(view)
    if (view === "faculty") {
      setUserMode("faculty")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background bg-grid">
      <TopNav onSearch={handleSearch} searchQuery={searchQuery} />

      <div className="flex flex-1">
        <AppSidebar activeView={activeView} onNavigate={handleNavigate} />

        <main className="flex-1 overflow-y-auto">
          {/* Mode toggle */}
          <div className="flex items-center justify-center gap-1 pt-4">
            <div className="flex items-center gap-1 rounded-xl border border-border bg-secondary/30 p-1">
              <button
                onClick={() => {
                  setUserMode("student")
                  if (activeView === "faculty") setActiveView("search")
                }}
                className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-colors ${
                  userMode === "student"
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Student View
              </button>
              <button
                onClick={() => {
                  setUserMode("faculty")
                  setActiveView("faculty")
                }}
                className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-colors ${
                  userMode === "faculty"
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Faculty View
              </button>
            </div>
          </div>

          {/* Views */}
          {activeView === "search" && (
            <>
              {!hasSearched && <HeroSearch onSearch={handleSearch} />}
              {hasSearched && <SearchResults query={searchQuery} />}
              {hasSearched && <KnowledgeGraph query={searchQuery} />}
              {!hasSearched && <TrendingSection onSearch={handleSearch} />}
              <CommunityDiscussions />
            </>
          )}

          {activeView === "graph" && (
            <div className="pt-8">
              <KnowledgeGraph query={searchQuery || "Laplace Transform"} />
            </div>
          )}

          {activeView === "community" && (
            <div className="pt-8">
              <CommunityDiscussions />
            </div>
          )}

          {activeView === "research" && (
            <div className="pt-8">
              <SearchResults query={searchQuery || "Research Repository"} />
            </div>
          )}

          {activeView === "faculty" && (
            <div className="pt-8">
              <FacultyMode />
            </div>
          )}

          {/* Footer */}
          <footer className="border-t border-border px-4 py-6 text-center">
            <p className="text-xs text-muted-foreground">
              EduNexus &mdash; A Unified AI Knowledge Infrastructure for Smart
              Campuses
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}
