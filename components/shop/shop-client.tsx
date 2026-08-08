"use client"

import { useMemo, useState } from "react"
import { LayoutGrid, SlidersHorizontal, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ProductCard } from "@/components/store/product-card"
import { Reveal } from "@/components/store/reveal"
import { categories, products } from "@/lib/data"
import { cn } from "@/lib/utils"

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
] as const

type SortValue = (typeof sortOptions)[number]["value"]

const priceBands = [
  { label: "Under PKR 3,000", min: 0, max: 3000 },
  { label: "PKR 3,000 – 6,000", min: 3000, max: 6000 },
  { label: "PKR 6,000 – 12,000", min: 6000, max: 12000 },
  { label: "Over PKR 12,000", min: 12000, max: Infinity },
]

function FilterPanel({
  activeCategory,
  setActiveCategory,
  activeBands,
  toggleBand,
  inStockOnly,
  setInStockOnly,
}: {
  activeCategory: string
  setActiveCategory: (c: string) => void
  activeBands: number[]
  toggleBand: (i: number) => void
  inStockOnly: boolean
  setInStockOnly: (v: boolean) => void
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide">Categories</h3>
        <div className="mt-4 space-y-1">
          <FilterRow label="All Products" active={activeCategory === "all"} onClick={() => setActiveCategory("all")} />
          {categories.map((c) => (
            <FilterRow
              key={c.slug}
              label={c.name}
              count={c.count}
              active={activeCategory === c.slug}
              onClick={() => setActiveCategory(c.slug)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide">Price</h3>
        <div className="mt-4 space-y-2">
          {priceBands.map((b, i) => (
            <button
              key={b.label}
              onClick={() => toggleBand(i)}
              className="flex w-full items-center gap-3 text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              <span
                className={cn(
                  "grid size-5 place-items-center rounded-md border transition-colors",
                  activeBands.includes(i) ? "border-primary bg-primary text-primary-foreground" : "border-border",
                )}
              >
                {activeBands.includes(i) && <Check className="size-3.5" />}
              </span>
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide">Availability</h3>
        <button
          onClick={() => setInStockOnly(!inStockOnly)}
          className="mt-4 flex w-full items-center gap-3 text-sm text-foreground/80 transition-colors hover:text-foreground"
        >
          <span
            className={cn(
              "grid size-5 place-items-center rounded-md border transition-colors",
              inStockOnly ? "border-primary bg-primary text-primary-foreground" : "border-border",
            )}
          >
            {inStockOnly && <Check className="size-3.5" />}
          </span>
          In stock only
        </button>
      </div>
    </div>
  )
}

function FilterRow({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count?: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-secondary",
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn("text-xs", active ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {count}
        </span>
      )}
    </button>
  )
}

export function ShopClient({ initialCategory = "all" }: { initialCategory?: string }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [sort, setSort] = useState<SortValue>("featured")
  const [activeBands, setActiveBands] = useState<number[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)

  const toggleBand = (i: number) =>
    setActiveBands((prev) => (prev.includes(i) ? prev.filter((b) => b !== i) : [...prev, i]))

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (activeCategory !== "all" && p.categorySlug !== activeCategory) return false
      if (inStockOnly && p.stock === 0) return false
      if (activeBands.length > 0) {
        const inBand = activeBands.some((i) => p.price >= priceBands[i].min && p.price < priceBands[i].max)
        if (!inBand) return false
      }
      return true
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return Number(b.id) - Number(a.id)
        default:
          return 0
      }
    })
    return list
  }, [activeCategory, sort, activeBands, inStockOnly])

  const activeName = activeCategory === "all" ? "All Products" : categories.find((c) => c.slug === activeCategory)?.name

  const filters = { activeCategory, setActiveCategory, activeBands, toggleBand, inStockOnly, setInStockOnly }

  return (
    <>
      {/* page banner */}
      <div className="border-b bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground">Home</span> / Shop {activeCategory !== "all" && `/ ${activeName}`}
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{activeName}</h1>
          <p className="mt-2 max-w-xl text-muted-foreground text-pretty">
            Explore our full range of premium sports gear, fitness equipment and toys — quality tested and player
            approved.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl gap-10 px-4 py-10 lg:flex">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-28">
            <FilterPanel {...filters} />
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> products
            </p>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 rounded-full lg:hidden">
                    <SlidersHorizontal className="size-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto p-6">
                  <SheetTitle className="mb-4 font-display text-lg">Filters</SheetTitle>
                  <FilterPanel {...filters} />
                </SheetContent>
              </Sheet>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 rounded-full">
                    <LayoutGrid className="size-4" />
                    {sortOptions.find((o) => o.value === sort)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  {sortOptions.map((o) => (
                    <DropdownMenuItem key={o.value} onClick={() => setSort(o.value)} className="justify-between">
                      {o.label}
                      {sort === o.value && <Check className="size-4 text-primary" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {activeBands.length > 0 || inStockOnly || activeCategory !== "all" ? (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {activeCategory !== "all" && (
                <Badge variant="secondary" className="cursor-pointer rounded-full" onClick={() => setActiveCategory("all")}>
                  {activeName} ✕
                </Badge>
              )}
              {inStockOnly && (
                <Badge variant="secondary" className="cursor-pointer rounded-full" onClick={() => setInStockOnly(false)}>
                  In stock ✕
                </Badge>
              )}
              {activeBands.map((i) => (
                <Badge key={i} variant="secondary" className="cursor-pointer rounded-full" onClick={() => toggleBand(i)}>
                  {priceBands[i].label} ✕
                </Badge>
              ))}
            </div>
          ) : null}

          {filtered.length === 0 ? (
            <div className="grid place-items-center rounded-3xl border border-dashed py-24 text-center">
              <p className="font-display text-lg font-semibold">No products found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
              {filtered.map((product, i) => (
                <Reveal key={product.id} delay={(i % 3) * 70}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
