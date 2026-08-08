"use client"

import { Bell, Search, Sun } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export function AdminTopbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 px-4 md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-6" />
      <div className="flex min-w-0 flex-col">
        <h1 className="truncate font-display text-base font-bold leading-tight md:text-lg">{title}</h1>
        {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search…"
            className="h-9 w-56 rounded-full border-border/70 bg-secondary/60 pl-9 text-sm"
          />
        </div>
        <button
          className="grid size-9 place-items-center rounded-full border border-border/70 bg-secondary/60 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Toggle theme"
        >
          <Sun className="size-4" />
        </button>
        <button
          className="relative grid size-9 place-items-center rounded-full border border-border/70 bg-secondary/60 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <Badge className="absolute -right-1 -top-1 grid size-5 min-w-5 place-items-center rounded-full border-2 border-background bg-accent p-0 text-[10px] text-accent-foreground">
            3
          </Badge>
        </button>
      </div>
    </header>
  )
}
