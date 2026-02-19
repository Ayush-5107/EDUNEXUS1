"use client"

import { useState } from "react"
import {
  Link2,
  Video,
  FileUp,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Send,
  Upload,
  BrainCircuit,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const BASE_URL = "https://edunexus-backend-nv75.onrender.com"

/* ---------- Status Message Component ---------- */
function StatusMessage({
  message,
  type,
}: {
  message: string
  type: "success" | "error"
}) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm ${
        type === "success"
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : "bg-red-500/10 text-red-400 border border-red-500/20"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  )
}

/* ---------- Add Link/Video Material Tab ---------- */
function AddMaterialForm() {
  const [subjectId, setSubjectId] = useState("")
  const [type, setType] = useState<"LINK" | "VIDEO">("LINK")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  const handleSubmit = async () => {
    if (!subjectId || !url) return
    setIsLoading(true)
    setStatus(null)

    try {
      const res = await fetch(`${BASE_URL}/admin/material`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: Number(subjectId),
          type,
          filePath: url,
          description,
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(
          errData?.message || `Request failed with status ${res.status}`
        )
      }

      setStatus({ message: "Material added successfully!", type: "success" })
      setUrl("")
      setDescription("")
    } catch (err) {
      setStatus({
        message:
          err instanceof Error ? err.message : "Failed to add material",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Link2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Add Link or Video Material
          </h3>
          <p className="text-xs text-muted-foreground">
            Attach an external resource to a subject
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Subject ID
          </Label>
          <Input
            type="number"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            placeholder="e.g. 1"
            className="bg-secondary/30 border-border/50"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Type
          </Label>
          <Select
            value={type}
            onValueChange={(v) => setType(v as "LINK" | "VIDEO")}
          >
            <SelectTrigger className="w-full bg-secondary/30 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LINK">
                <span className="flex items-center gap-2">
                  <Link2 className="h-3.5 w-3.5" />
                  Link
                </span>
              </SelectItem>
              <SelectItem value="VIDEO">
                <span className="flex items-center gap-2">
                  <Video className="h-3.5 w-3.5" />
                  Video
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">URL</Label>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/resource"
          className="bg-secondary/30 border-border/50"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Description
        </Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this material"
          className="bg-secondary/30 border-border/50"
        />
      </div>

      {status && <StatusMessage message={status.message} type={status.type} />}

      <Button
        onClick={handleSubmit}
        disabled={isLoading || !subjectId || !url}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Add Material
          </>
        )}
      </Button>
    </div>
  )
}

/* ---------- Upload PDF Notes Tab ---------- */
function UploadPdfForm() {
  const [subjectId, setSubjectId] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  const handleSubmit = async () => {
    if (!subjectId || !file) return
    setIsLoading(true)
    setStatus(null)

    try {
      const formData = new FormData()
      formData.append("subjectId", subjectId)
      formData.append("type", "PDF")
      formData.append("description", description)
      formData.append("file", file)

      const res = await fetch(`${BASE_URL}/admin/upload`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(
          errData?.message || `Request failed with status ${res.status}`
        )
      }

      setStatus({ message: "PDF uploaded successfully!", type: "success" })
      setDescription("")
      setFile(null)
    } catch (err) {
      setStatus({
        message:
          err instanceof Error ? err.message : "Failed to upload PDF",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
          <FileUp className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Upload PDF Notes
          </h3>
          <p className="text-xs text-muted-foreground">
            Upload study material as a PDF document
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Subject ID
        </Label>
        <Input
          type="number"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          placeholder="e.g. 1"
          className="bg-secondary/30 border-border/50"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Description
        </Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Chapter 3: Sorting Algorithms"
          className="bg-secondary/30 border-border/50"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          PDF File
        </Label>
        <div className="relative">
          <label
            htmlFor="pdf-upload"
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 transition-colors ${
              file
                ? "border-primary/40 bg-primary/5"
                : "border-border/50 bg-secondary/20 hover:border-primary/30 hover:bg-secondary/30"
            }`}
          >
            <Upload className={`h-8 w-8 ${file ? "text-primary" : "text-muted-foreground/50"}`} />
            {file ? (
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Click to select a PDF
                </p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  PDF files only
                </p>
              </div>
            )}
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            className="sr-only"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0])
              }
            }}
          />
        </div>
      </div>

      {status && <StatusMessage message={status.message} type={status.type} />}

      <Button
        onClick={handleSubmit}
        disabled={isLoading || !subjectId || !file}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload PDF
          </>
        )}
      </Button>
    </div>
  )
}

/* ---------- Ask the AI Tab ---------- */
function AskAiForm() {
  const [subjectId, setSubjectId] = useState("")
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [answer, setAnswer] = useState("")
  const [status, setStatus] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  const handleSubmit = async () => {
    if (!subjectId || !question) return
    setIsLoading(true)
    setStatus(null)
    setAnswer("")

    try {
      const res = await fetch(`${BASE_URL}/ai/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: Number(subjectId),
          question,
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(
          errData?.message || `Request failed with status ${res.status}`
        )
      }

      const data = await res.json()
      setAnswer(
        data.answer || data.explanation || data.response || JSON.stringify(data)
      )
    } catch (err) {
      setStatus({
        message:
          err instanceof Error ? err.message : "Failed to get AI response",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10">
          <BrainCircuit className="h-5 w-5 text-sky-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Ask the AI
          </h3>
          <p className="text-xs text-muted-foreground">
            Get AI-powered explanations for any topic
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Subject ID
        </Label>
        <Input
          type="number"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          placeholder="e.g. 1"
          className="bg-secondary/30 border-border/50"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Your Question
        </Label>
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Explain the difference between BFS and DFS..."
          className="min-h-28 bg-secondary/30 border-border/50 resize-none"
        />
      </div>

      {status && <StatusMessage message={status.message} type={status.type} />}

      <Button
        onClick={handleSubmit}
        disabled={isLoading || !subjectId || !question}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Ask AI
          </>
        )}
      </Button>

      {/* AI Answer Display */}
      {answer && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              AI Response
            </span>
          </div>
          <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {answer}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- Main Admin Dashboard ---------- */
export function AdminDashboard() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-16">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground text-balance">
              Admin Dashboard
            </h2>
            <p className="text-xs text-muted-foreground">
              Manage materials, upload notes, and query the AI engine
            </p>
          </div>
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="material" className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-11 mb-6 bg-secondary/40 rounded-xl p-1">
          <TabsTrigger
            value="material"
            className="gap-1.5 rounded-lg text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <Link2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Link / Video</span>
            <span className="sm:hidden">Link</span>
          </TabsTrigger>
          <TabsTrigger
            value="pdf"
            className="gap-1.5 rounded-lg text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <FileUp className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Upload PDF</span>
            <span className="sm:hidden">PDF</span>
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="gap-1.5 rounded-lg text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ask AI</span>
            <span className="sm:hidden">AI</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Content Cards */}
        <div className="glass rounded-xl p-6">
          <TabsContent value="material" className="mt-0">
            <AddMaterialForm />
          </TabsContent>

          <TabsContent value="pdf" className="mt-0">
            <UploadPdfForm />
          </TabsContent>

          <TabsContent value="ai" className="mt-0">
            <AskAiForm />
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer Badge */}
      <div className="flex justify-center mt-6">
        <Badge
          variant="outline"
          className="text-[10px] border-border/40 bg-secondary/20 text-muted-foreground gap-1.5 px-3 py-1"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Connected to EduNexus Backend
        </Badge>
      </div>
    </section>
  )
}
