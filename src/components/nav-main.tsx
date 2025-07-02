/* eslint-disable @typescript-eslint/no-unused-vars */
// @/components/nav-main.tsx

"use client"

import {
  IconCirclePlusFilled,
  IconNotes,
  type Icon,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type Note = {
  id: number
  title: string
  content: string
  badge?: {
    label: string
    variant: "default" | "secondary" | "destructive" | "outline"
  }
}

type NavMainProps = {
  notes: Note[]
  onNoteCreate: () => void
  onNoteSelect: (id: number) => void
  activeNoteId: number | null
}

export function NavMain({
  notes,
  onNoteCreate,
  onNoteSelect,
  activeNoteId,
}: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* New Note Button */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="New Note"
              onClick={onNoteCreate}
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>New</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Notes List */}
        <SidebarMenu>
          {notes.map((note) => (
            <SidebarMenuItem key={note.id}>
              <SidebarMenuButton
                tooltip={note.title}
                onClick={() => onNoteSelect(note.id)}
                className={`justify-start ${note.id === activeNoteId ? "bg-muted" : ""
                  }`}
              >
                <IconNotes className="mr-2" />
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{note.title}</span>
                  {note.badge && (
                    <Badge variant={note.badge.variant} className="ml-2 shrink-0">
                      {note.badge.label}
                    </Badge>
                  )}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
