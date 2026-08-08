"use client"

import { useState } from "react"
import Image from "next/image"
import { MoreHorizontal, Pencil, Plus, Tags, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { categories as seedCategories, products } from "@/lib/data"

type Category = (typeof seedCategories)[number]

export function CategoriesManager() {
  const [items, setItems] = useState<Category[]>(seedCategories)

  function removeCategory(slug: string) {
    setItems((prev) => prev.filter((c) => c.slug !== slug))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} categories · {products.length} products total
        </p>
        <Button className="h-10 rounded-xl bg-primary shadow-lg shadow-primary/20">
          <Plus className="size-4" />
          Add category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((c) => {
          const count = products.filter((p) => p.categorySlug === c.slug).length
          return (
            <Card
              key={c.slug}
              className="group overflow-hidden rounded-2xl border-border/60 transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-border/60 bg-secondary/50">
                  <Image
                    src={c.image || "/placeholder.svg"}
                    alt={c.name}
                    width={64}
                    height={64}
                    className="size-12 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-display text-base font-bold">{c.name}</h3>
                    <Badge variant="secondary" className="rounded-full font-normal">
                      {count}
                    </Badge>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Tags className="size-3" />
                    /{c.slug}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="size-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => removeCategory(c.slug)}
                    >
                      <Trash2 className="size-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
