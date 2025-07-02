// @/components/app-sidebar.tsx

"use client"
import * as React from "react"
import {
  IconInnerShadowTop,
} from "@tabler/icons-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
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

type AppSidebarProps = {
  notes: Note[]
  onNoteCreate: () => void
  onNoteSelect: (id: number) => void
  activeNoteId: number | null
} & React.ComponentProps<typeof Sidebar>

export function AppSidebar({
  notes,
  onNoteCreate,
  onNoteSelect,
  activeNoteId,
  ...props
}: AppSidebarProps) {
  const user = {
    name: "abebe",
    email: "abebekebede@example.com",
    avatar: "/avatars/shadcn.jpg",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Notebook</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          notes={notes}
          onNoteCreate={onNoteCreate}
          onNoteSelect={onNoteSelect}
          activeNoteId={activeNoteId}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
