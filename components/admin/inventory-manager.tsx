"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { AlertTriangle, Boxes, Minus, PackageX, Plus, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { StatCard } from "@/components/admin/stat-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { products as seedProducts } from "@/lib/data"
import { cn } from "@/lib/utils"

const LOW_THRESHOLD = 12
const TARGET_STOCK = 60

function statusFor(stock: number) {
  if (stock === 0) return { label: "Out of stock", cls: "bg-destructive/10 text-destructive border-destructive/20" }
  if (stock <= LOW_THRESHOLD) return { label: "Low stock", cls: "bg-accent/15 text-accent border-accent/25" }
  return { label: "Healthy", cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" }
}

export function InventoryManager() {
  const [stock, setStock] = useState<Record<string, number>>(
    () => Object.fromEntries(seedProducts.map((p) => [p.id, p.stock])),
  )
  const [query, setQuery] = useState("")

  const adjust = (id: string, delta: number) =>
    setStock((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }))

  const set = (id: string, value: number) =>
    setStock((prev) => ({ ...prev, [id]: Math.max(0, Number.isNaN(value) ? 0 : value) }))

  const filtered = useMemo(
    () => seedProducts.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  const totalUnits = Object.values(stock).reduce((a, b) => a + b, 0)
  const lowCount = Object.values(stock).filter((s) => s > 0 && s <= LOW_THRESHOLD).length
  const outCount = Object.values(stock).filter((s) => s === 0).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Units in stock" value={totalUnits.toLocaleString("en-PK")} delta={2.8} icon={Boxes} accent="primary" />
        <StatCard label="Low stock items" value={String(lowCount)} delta={-4.1} icon={AlertTriangle} accent="accent" />
        <StatCard label="Out of stock" value={String(outCount)} delta={-1.2} icon={PackageX} accent="accent" />
      </div>

      <Card className="rounded-2xl border-border/60">
        <CardContent className="p-4 md:p-6">
          <div className="relative sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search inventory…"
              className="h-10 rounded-xl pl-9"
            />
          </div>

          <div className="mt-5 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden md:table-cell">Stock level</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const value = stock[p.id] ?? 0
                  const st = statusFor(value)
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-border/60 bg-secondary/50">
                            <Image
                              src={p.image || "/placeholder.svg"}
                              alt={p.name}
                              width={44}
                              height={44}
                              className="size-9 object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex w-40 items-center gap-2">
                          <Progress value={Math.min(100, (value / TARGET_STOCK) * 100)} className="h-2" />
                          <span className="w-8 text-xs text-muted-foreground">{value}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline" className={cn("rounded-full font-medium", st.cls)}>
                          {st.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="ml-auto flex w-fit items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 rounded-lg"
                            onClick={() => adjust(p.id, -1)}
                            aria-label={`Decrease ${p.name} stock`}
                          >
                            <Minus className="size-3.5" />
                          </Button>
                          <Input
                            value={value}
                            onChange={(e) => set(p.id, Number.parseInt(e.target.value, 10))}
                            inputMode="numeric"
                            className="h-8 w-14 rounded-lg text-center"
                            aria-label={`${p.name} quantity`}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 rounded-lg"
                            onClick={() => adjust(p.id, 1)}
                            aria-label={`Increase ${p.name} stock`}
                          >
                            <Plus className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No products match your search.</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
