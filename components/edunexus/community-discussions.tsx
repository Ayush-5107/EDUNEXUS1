"use client"

import {
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  Sparkles,
  Link2,
  BookOpen,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Discussion {
  id: number
  title: string
  replies: number
  tags: string[]
  linkedResources: number
  aiSummary: string
  hasVerifiedAnswer: boolean
  upvotes: number
}

const discussions: Discussion[] = [
  {
    id: 1,
    title:
      "Clarification on Fourier Coefficient Derivation - Applied Mathematics III",
    replies: 24,
    tags: ["Fourier Series", "Applied Math III", "Derivation"],
    linkedResources: 5,
    aiSummary:
      "Discussion covers the derivation of Fourier coefficients using orthogonality of trigonometric functions. Key focus on the integration limits and the distinction between full-range and half-range expansions.",
    hasVerifiedAnswer: true,
    upvotes: 47,
  },
  {
    id: 2,
    title: "Best approach for solving Laplace Transform of piecewise functions",
    replies: 18,
    tags: ["Laplace Transform", "Piecewise Functions", "Unit Step"],
    linkedResources: 3,
    aiSummary:
      "Thread discusses using the unit step function to express piecewise functions before applying the second shifting theorem. Multiple worked examples provided.",
    hasVerifiedAnswer: true,
    upvotes: 35,
  },
  {
    id: 3,
    title: "Applications of eigenvalues in machine learning optimization",
    replies: 31,
    tags: ["Linear Algebra", "Machine Learning", "Optimization"],
    linkedResources: 8,
    aiSummary:
      "Cross-disciplinary discussion on how eigenvalues of the Hessian matrix determine convergence in gradient descent. Links to PCA and spectral clustering.",
    hasVerifiedAnswer: false,
    upvotes: 62,
  },
]

function DiscussionCard({ d }: { d: Discussion }) {
  return (
    <div className="glass group rounded-xl p-5 transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between gap-4">
        <h4 className="text-sm font-semibold text-foreground leading-snug">
          {d.title}
        </h4>
        {d.hasVerifiedAnswer && (
          <Badge
            variant="outline"
            className="shrink-0 gap-1 border-green-500/30 bg-green-500/10 text-green-400 text-[11px]"
          >
            <CheckCircle2 className="h-3 w-3" />
            Verified
          </Badge>
        )}
      </div>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {d.tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="border-border bg-secondary/40 text-[11px] text-muted-foreground"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* AI Summary */}
      <div className="mt-3 flex items-start gap-2 rounded-lg border border-primary/10 bg-primary/5 p-3">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          {d.aiSummary}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          {d.replies} replies
        </span>
        <span className="flex items-center gap-1">
          <ThumbsUp className="h-3 w-3" />
          {d.upvotes} upvotes
        </span>
        <span className="flex items-center gap-1">
          <Link2 className="h-3 w-3" />
          {d.linkedResources} resources
        </span>
      </div>
    </div>
  )
}

export function CommunityDiscussions() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
          <BookOpen className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Academic Knowledge Discussions
          </h2>
          <p className="text-xs text-muted-foreground">
            Threaded Q&A tied to specific concepts and search queries
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {discussions.map((d) => (
          <DiscussionCard key={d.id} d={d} />
        ))}
      </div>
    </section>
  )
}
