import { useState, useRef } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { Note } from "@/types/db";
import { useUser } from "@/hooks/useUser";
import ReactMarkdown from "react-markdown";

export default function Notebook() {
  const { user, loading: userLoading } = useUser(1);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [newTag, setNewTag] = useState("");

  const selectedNote =
    notes.find((note) => note.id === selectedNoteId) ?? notes[0];

  const handleAddNote = () => {
    const newNote = {
      id: Date.now(),
      user_id: user?.id ?? 1,
      title: "Untitled Note",
      content: "",
      tags: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
  };

  const handleAddTag = () => {
    if (!selectedNote || !newTag.trim()) return;

    const currentTags = selectedNote.tags
      ? selectedNote.tags.split(",").map((t) => t.trim())
      : [];

    const newTagTrimmed = newTag.trim();

    if (!currentTags.includes(newTagTrimmed)) {
      const updatedTags = [...currentTags, newTagTrimmed].join(", ");

      const updatedTitle = selectedNote.title.replace(/\s*\[.*\]$/, "").trim(); // Remove existing [tags]

      const newTitleWithTags = `${updatedTitle} [${updatedTags}]`;

      setNotes((prev) =>
        prev.map((note) =>
          note.id === selectedNote.id
            ? {
                ...note,
                tags: updatedTags,
                title: newTitleWithTags,
              }
            : note
        )
      );

      setNewTag("");
    }
  };

  const insertMarkdown = (syntax: string, block = false) => {
    const textarea = textareaRef.current;
    if (!textarea || !selectedNote) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    const newText = block
      ? `${syntax} ${selectedText}`
      : `${syntax}${selectedText}${syntax}`;

    const updated =
      textarea.value.substring(0, start) +
      newText +
      textarea.value.substring(end);

    setNotes((prev) =>
      prev.map((note) =>
        note.id === selectedNote.id ? { ...note, content: updated } : note
      )
    );
  };

  return (
    <SidebarProvider>
      <AppSidebar
        notes={notes}
        onAddNote={handleAddNote}
        onSelectNote={(id: number) => setSelectedNoteId(id)}
      />
      <SidebarInset>
        <div className="flex flex-col h-screen">
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Notebook</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{selectedNote?.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="flex-1 p-4">
            {userLoading ? (
              <div className="text-muted-foreground">Loading note...</div>
            ) : selectedNote ? (
              <div className="flex flex-col h-full space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) =>
                      setNotes((prev) =>
                        prev.map((note) =>
                          note.id === selectedNote.id
                            ? { ...note, title: e.target.value }
                            : note
                        )
                      )
                    }
                    className="text-2xl font-bold outline-none border-none bg-transparent"
                  />
                  <div className="flex flex-wrap gap-1">
                    {selectedNote.tags &&
                      selectedNote.tags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                  </div>
                </div>

                <div className="flex gap-2 items-center mt-2">
                  <Input
                    type="text"
                    placeholder="New tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="h-8 px-2 text-sm w-32"
                  />
                  <Button size="sm" className="h-8" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <div className="flex gap-2 text-sm font-semibold">
                    {!previewMode && (
                      <>
                        <button
                          title="Bold"
                          onClick={() => insertMarkdown("**")}
                          className="px-2 py-1 border rounded"
                        >
                          B
                        </button>
                        <button
                          title="Italic"
                          onClick={() => insertMarkdown("_")}
                          className="px-2 py-1 border rounded"
                        >
                          I
                        </button>
                        <button
                          title="Underline"
                          onClick={() => insertMarkdown("__")}
                          className="px-2 py-1 border rounded"
                        >
                          U
                        </button>
                        <button
                          title="Header 1"
                          onClick={() => insertMarkdown("#", true)}
                          className="px-2 py-1 border rounded"
                        >
                          H₁
                        </button>
                        <button
                          title="Header 2"
                          onClick={() => insertMarkdown("##", true)}
                          className="px-2 py-1 border rounded"
                        >
                          H₂
                        </button>
                        <button
                          title="Header 3"
                          onClick={() => insertMarkdown("###", true)}
                          className="px-2 py-1 border rounded"
                        >
                          H₃
                        </button>
                        <button
                          title="Header 4"
                          onClick={() => insertMarkdown("####", true)}
                          className="px-2 py-1 border rounded"
                        >
                          H₄
                        </button>
                        {/* Bullet List */}
                        <button
                          title="Bullet List"
                          onClick={() => insertMarkdown("-", true)}
                          className="px-2 py-1 border rounded"
                        >
                          •
                        </button>

                        {/* Numbered List */}
                        <button
                          title="Numbered List"
                          onClick={() => insertMarkdown("1.", true)}
                          className="px-2 py-1 border rounded"
                        >
                          1.
                        </button>

                        {/* Task List */}
                        <button
                          title="Task List"
                          onClick={() => insertMarkdown("- [ ]", true)}
                          className="px-2 py-1 border rounded"
                        >
                          ☑
                        </button>

                        {/* Quote */}
                        <button
                          title="Blockquote"
                          onClick={() => insertMarkdown(">", true)}
                          className="px-2 py-1 border rounded"
                        >
                          ❝
                        </button>

                        {/* Code Block */}
                        <button
                          title="Code Block"
                          onClick={() => insertMarkdown("```js\n\n```", true)}
                          className="px-2 py-1 border rounded"
                        >
                          {"</>"}
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => setPreviewMode((prev) => !prev)}
                    className="text-xs underline"
                  >
                    {previewMode ? "Edit" : "Preview"}
                  </button>
                </div>

                {previewMode ? (
                  <div className="prose max-w-full h-full p-4 border rounded-md overflow-auto bg-white">
                    <ReactMarkdown>
                      {(selectedNote.content ?? "").replace(/^\u200C/, "") ||
                        "*Nothing to preview.*"}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    ref={textareaRef}
                    dir="ltr"
                    lang="en"
                    value={selectedNote.content ?? ""}
                    onChange={(e) =>
                      setNotes((prev) =>
                        prev.map((note) =>
                          note.id === selectedNote.id
                            ? { ...note, content: e.target.value }
                            : note
                        )
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.ctrlKey && e.key === "z") {
                        e.preventDefault();
                        document.execCommand("undo");
                      }
                      if (
                        e.ctrlKey &&
                        (e.key === "y" || (e.shiftKey && e.key === "z"))
                      ) {
                        e.preventDefault();
                        document.execCommand("redo");
                      }

                      if (e.key === "Enter") {
                        const value = selectedNote.content ?? "";
                        const lines = value.split("\n");
                        const caretPos =
                          textareaRef.current?.selectionStart ?? 0;
                        const lineIndex =
                          value.substring(0, caretPos).split("\n").length - 1;
                        const currentLine = lines[lineIndex];

                        const match = currentLine.match(
                          /^(\s*)([-*+]|\d+\.)\s/
                        );
                        if (match) {
                          e.preventDefault();
                          const prefix =
                            match[2].match(/\d+\./) != null
                              ? `${parseInt(match[2]) + 1}. `
                              : `${match[2]} `;

                          const before = value.substring(0, caretPos);
                          const after = value.substring(caretPos);
                          const updated = `${before}\n${prefix}${after}`;

                          setNotes((prev) =>
                            prev.map((note) =>
                              note.id === selectedNote.id
                                ? { ...note, content: updated }
                                : note
                            )
                          );

                          setTimeout(() => {
                            if (textareaRef.current) {
                              const newPos = caretPos + prefix.length + 1;
                              textareaRef.current.selectionStart = newPos;
                              textareaRef.current.selectionEnd = newPos;
                            }
                          }, 0);
                        }
                      }
                    }}
                    className="flex-1 w-full h-full resize-none rounded-md border p-4 text-sm font-mono outline-none text-left"
                    style={{
                      direction: "ltr",
                      unicodeBidi: "plaintext",
                      whiteSpace: "pre-wrap",
                      textAlign: "left",
                    }}
                  />
                )}
              </div>
            ) : (
              <div>No note selected</div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
