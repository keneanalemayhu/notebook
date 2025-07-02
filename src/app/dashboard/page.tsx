// @/app/dashboard/page.tsx

"use client"
import { useState, useRef } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github.css"

type Note = {
  id: number
  title: string
  content: string
  badge?: {
    label: string
    variant: "default" | "secondary" | "destructive" | "outline"
  }
}

export default function Page() {
  const [notes, setNotes] = useState<Note[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null)

  const badgeOptions = [
    { label: "Personal", variant: "default" },
    { label: "Work", variant: "secondary" },
    { label: "Important", variant: "destructive" },
    { label: "Idea", variant: "outline" },
  ] as const


  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: `Untitled ${notes.length + 1}`,
      content: "",
    }
    setNotes([newNote, ...notes])
    setActiveNoteId(newNote.id)
  }

  const insertMarkdown = (wrapWith: string, type: "wrap" | "line" = "wrap") => {
    const textarea = textareaRef.current
    if (!textarea || activeNoteId === null) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = textarea.value.slice(start, end)

    let newContent = textarea.value

    if (type === "wrap" && selected) {
      const wrapped = wrapWith + selected + wrapWith
      newContent =
        textarea.value.slice(0, start) +
        wrapped +
        textarea.value.slice(end)
    } else if (type === "line") {
      const lineStart = textarea.value.lastIndexOf("\n", start - 1) + 1
      newContent =
        textarea.value.slice(0, lineStart) +
        wrapWith +
        textarea.value.slice(lineStart)
    } else {
      newContent += wrapWith
    }

    handleContentChange(newContent)

    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd =
        type === "wrap" ? start + wrapWith.length : end + wrapWith.length
      textarea.focus()
    })
  }

  const handleSelectNote = (id: number) => {
    setActiveNoteId(id)
  }

  const handleContentChange = (content: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === activeNoteId ? { ...note, content } : note
      )
    )
  }

  const activeNote = notes.find((note) => note.id === activeNoteId)

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        notes={notes}
        onNoteCreate={handleCreateNote}
        onNoteSelect={handleSelectNote}
        activeNoteId={activeNoteId}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4">
          {activeNote ? (
            <div className="flex flex-col gap-4 h-full w-full">
              {/* Title Input */}
              <input
                value={activeNote.title}
                onChange={(e) =>
                  setNotes((prev) =>
                    prev.map((note) =>
                      note.id === activeNoteId
                        ? { ...note, title: e.target.value }
                        : note
                    )
                  )
                }
                className="text-xl font-semibold border p-2 rounded"
                placeholder="Note title"
              />

              {/* Toolbar + Badge Selector + Preview Button */}
              <div className="flex justify-between items-end flex-wrap gap-2 text-sm w-full">
                {/* Left side: toolbar buttons + badge */}
                <div className="flex gap-4 flex-wrap items-end">
                  {/* Toolbar Buttons */}
                  <div className="flex gap-2">
                    <button onClick={() => insertMarkdown("**")} className="px-2 py-1 border rounded">B</button>
                    <button onClick={() => insertMarkdown("*")} className="px-2 py-1 border rounded italic">i</button>
                    <button onClick={() => insertMarkdown("# ", "line")} className="px-2 py-1 border rounded">H</button>
                    <button onClick={() => insertMarkdown("<u>", "wrap")} className="px-2 py-1 border rounded">U</button>
                    <button onClick={() => insertMarkdown("---", "line")} className="px-2 py-1 border rounded">---</button>
                  </div>

                  {/* Badge Selector */}
                  <div className="flex flex-col">
                    <Select
                      onValueChange={(value) => {
                        let selectedBadge: Note["badge"] | undefined = undefined
                        if (value !== "none") {
                          const found = badgeOptions.find((b) => b.label === value)
                          if (found) {
                            selectedBadge = { label: found.label, variant: found.variant }
                          }
                        }
                        setNotes((prev) =>
                          prev.map((note) =>
                            note.id === activeNoteId ? { ...note, badge: selectedBadge } : note
                          )
                        )
                      }}
                      value={activeNote?.badge?.label ?? "none"}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Select badge" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select Badge</SelectItem>
                        {badgeOptions.map((badge) => (
                          <SelectItem key={badge.label} value={badge.label}>
                            {badge.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right side: Preview toggle button */}
                <div className="ml-auto">
                  <button
                    onClick={() => setIsPreviewing(!isPreviewing)}
                    className="px-2 py-1 border border-border rounded bg-muted text-foreground hover:bg-muted/80 transition"
                  >
                    {isPreviewing ? "Edit" : "Preview"}
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex flex-col border border-border rounded overflow-hidden bg-background text-foreground">
                {isPreviewing ? (
                  <div className="prose max-w-none dark:prose-invert text-foreground p-4 overflow-auto flex-1">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      skipHtml={false}
                    >
                      {activeNote.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    ref={textareaRef}
                    value={activeNote.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="w-full h-full resize-none outline-none bg-background text-foreground p-4 flex-1"
                    placeholder="Start typing your note..."
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Select or create a note to begin</div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
