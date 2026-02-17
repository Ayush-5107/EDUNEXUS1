"use client"

import { useState } from "react"
import {
  Sparkles,
  BookOpen,
  FileText,
  Video,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  BarChart3,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

/* ---------- Synthesis Card ---------- */
function AISynthesisCard({ query }: { query: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="glass rounded-2xl p-6 glow-sm">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              AI Knowledge Synthesis
            </h2>
            <p className="text-xs text-muted-foreground">
              Generated from 12 Institutional Sources
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="shrink-0 border-primary/30 bg-primary/10 text-primary text-xs"
        >
          RAG-Powered
        </Badge>
      </div>

      {/* Content */}
      <div className="space-y-4 text-sm leading-relaxed text-secondary-foreground">
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Concept Definition
          </h3>
          <p>
            The <strong className="text-foreground">{query || "Laplace Transform"}</strong> is an
            integral transform that converts a function of a real variable (often
            time) into a function of a complex variable (complex frequency). It
            is widely used in engineering and physics for solving differential
            equations, analyzing linear systems, and circuit analysis.
          </p>
        </div>

        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Context within Syllabus
          </h3>
          <p>
            Covered in <strong className="text-foreground">Applied Mathematics III</strong>, Unit 4
            &mdash; Integral Transforms. This topic builds upon concepts from
            Fourier Analysis (Unit 3) and leads into Z-Transforms (Unit 5).
          </p>
        </div>

        {expanded && (
          <>
            <div>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Related Units
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Fourier Series",
                  "Z-Transform",
                  "Transfer Functions",
                  "Circuit Analysis",
                  "Control Systems",
                ].map((u) => (
                  <Badge
                    key={u}
                    variant="outline"
                    className="border-border bg-secondary/40 text-secondary-foreground"
                  >
                    {u}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Academic Relevance
              </h3>
              <p>
                Exam weightage: <strong className="text-foreground">15-20 marks</strong>. Frequently
                appears in semester exams and GATE. High correlation with
                questions on inverse transforms and application-based problems.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Citations
              </h3>
              <div className="flex flex-col gap-1.5">
                {[
                  "Prof. R. Sharma - Lecture 14: Introduction to Laplace Transform",
                  "Engineering Mathematics, Kreyszig - Chapter 6",
                  "Department of Mathematics - Study Material, pg. 142-158",
                ].map((c, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex items-center gap-2 text-primary/80 transition-colors hover:text-primary"
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span className="text-xs">{c}</span>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
      >
        {expanded ? (
          <>
            Show less <ChevronUp className="h-3.5 w-3.5" />
          </>
        ) : (
          <>
            Show more details <ChevronDown className="h-3.5 w-3.5" />
          </>
        )}
      </button>

      <p className="mt-3 text-[11px] italic text-muted-foreground/60">
        Answer grounded in institutional academic content
      </p>
    </div>
  )
}

/* ---------- Video result card ---------- */
function VideoResultCard({
  title,
  professor,
  timestamp,
  match,
}: {
  title: string
  professor: string
  timestamp: string
  match: number
}) {
  return (
    <div className="glass group flex gap-4 rounded-xl p-4 transition-colors hover:border-primary/30">
      {/* Thumbnail placeholder */}
      <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-secondary">
        <div className="flex h-full items-center justify-center">
          <Video className="h-6 w-6 text-muted-foreground/40" />
        </div>
        <span className="absolute bottom-1 right-1 rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-foreground">
          {timestamp}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h4 className="text-sm font-medium text-foreground line-clamp-2">
            {title}
          </h4>
          <p className="mt-0.5 text-xs text-muted-foreground">{professor}</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">
            Relevant at {timestamp}
          </span>
          <div className="ml-auto flex items-center gap-1">
            <BarChart3 className="h-3 w-3 text-primary" />
            <span className="text-[11px] font-medium text-primary">
              {match}% match
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Document result card ---------- */
function DocumentResultCard({
  title,
  type,
  subject,
  size,
  page,
  match,
}: {
  title: string
  type: string
  subject: string
  size: string
  page: number
  match: number
}) {
  return (
    <div className="glass group flex items-start gap-4 rounded-xl p-4 transition-colors hover:border-primary/30">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/15">
        {type === "PDF" ? (
          <FileText className="h-5 w-5 text-accent" />
        ) : (
          <BookOpen className="h-5 w-5 text-primary" />
        )}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <Badge
            variant="outline"
            className="border-border bg-secondary/40 text-xs text-muted-foreground"
          >
            {type}
          </Badge>
          <span>{subject}</span>
          <span>{size}</span>
          <span>Found on Page {page}</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3 text-primary" />
            <span className="text-[11px] font-medium text-primary">
              {match}% match
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Download className="h-3 w-3" />
            Download
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Main Search Results ---------- */
export function SearchResults({ query }: { query: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <p className="mb-6 text-sm text-muted-foreground">
        Showing results for{" "}
        <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>
      </p>

      {/* AI Synthesis */}
      <AISynthesisCard query={query} />

      {/* Two-column results */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Left Column – Video Lectures */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Video className="h-4 w-4 text-primary" />
            Video Lectures
          </h3>
          <div className="flex flex-col gap-3">
            <VideoResultCard
              title="Introduction to Laplace Transform & Properties"
              professor="Prof. R. Sharma - Applied Mathematics III"
              timestamp="14:32"
              match={96}
            />
            <VideoResultCard
              title="Laplace Transform in Circuit Analysis - RLC Circuits"
              professor="Prof. A. Mehta - Network Theory"
              timestamp="08:15"
              match={91}
            />
            <VideoResultCard
              title="Inverse Laplace Transform Techniques"
              professor="Prof. R. Sharma - Applied Mathematics III"
              timestamp="22:05"
              match={87}
            />
            <VideoResultCard
              title="Transfer Functions & System Analysis"
              professor="Prof. S. Gupta - Control Systems"
              timestamp="05:48"
              match={78}
            />
          </div>
        </div>

        {/* Right Column – PDFs & Papers */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileText className="h-4 w-4 text-accent" />
            PDFs & Research Papers
          </h3>
          <div className="flex flex-col gap-3">
            <DocumentResultCard
              title="Laplace Transform: Theory and Applications in Engineering"
              type="PDF"
              subject="Applied Mathematics III"
              size="2.4 MB"
              page={12}
              match={97}
            />
            <DocumentResultCard
              title="Integral Transforms in Circuit Analysis"
              type="Research Paper"
              subject="Electrical Engineering"
              size="1.8 MB"
              page={5}
              match={92}
            />
            <DocumentResultCard
              title="Study Material: Unit 4 - Integral Transforms"
              type="PDF"
              subject="Department Notes"
              size="3.1 MB"
              page={1}
              match={89}
            />
            <DocumentResultCard
              title="GATE Preparation: Laplace Transform Problem Set"
              type="PDF"
              subject="Exam Prep"
              size="850 KB"
              page={3}
              match={84}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
