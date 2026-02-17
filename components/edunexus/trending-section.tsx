"use client"

import { TrendingUp, ArrowUpRight } from "lucide-react"

interface TrendingItem {
  query: string
  searches: number
  change: number
  department: string
}

const trending: TrendingItem[] = [
  {
    query: "Laplace Transform Applications",
    searches: 842,
    change: 24,
    department: "Applied Mathematics",
  },
  {
    query: "Machine Learning Optimization",
    searches: 756,
    change: 18,
    department: "Computer Science",
  },
  {
    query: "Power Electronics Design",
    searches: 621,
    change: 31,
    department: "Electrical Engineering",
  },
  {
    query: "Quantum Computing Principles",
    searches: 589,
    change: 42,
    department: "Physics",
  },
  {
    query: "Database Normalization Techniques",
    searches: 534,
    change: 12,
    department: "Information Technology",
  },
  {
    query: "Thermodynamic Cycles Analysis",
    searches: 498,
    change: 9,
    department: "Mechanical Engineering",
  },
]

export function TrendingSection({
  onSearch,
}: {
  onSearch: (query: string) => void
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15">
          <TrendingUp className="h-4.5 w-4.5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Trending Across Campus
          </h2>
          <p className="text-xs text-muted-foreground">
            Most searched academic topics this week
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {trending.map((item, i) => (
          <button
            key={i}
            onClick={() => onSearch(item.query)}
            className="glass group flex items-start gap-4 rounded-xl p-4 text-left transition-colors hover:border-primary/30"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/60 text-xs font-bold text-muted-foreground">
              {i + 1}
            </span>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {item.query}
              </h4>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {item.department}
              </p>
              <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span>{item.searches.toLocaleString()} searches</span>
                <span className="flex items-center gap-0.5 text-green-400">
                  <ArrowUpRight className="h-3 w-3" />
                  {item.change}%
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
