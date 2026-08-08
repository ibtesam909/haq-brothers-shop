"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { formatPKR, type Product } from "@/lib/data"
import { cn } from "@/lib/utils"

type Category = {
  id: string
  name: string
  slug: string
}

type ProductRow = {
  _id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  category: string
  categorySlug: string
  subcategory: string
  brand: string
  images: string[]
  thumbnail: string
  price: number
  comparePrice: number
  stockQuantity: number
  sku: string
  featured: boolean
  bestSeller: boolean
  newArrival: boolean
  rating: number
  reviewsCount: number
  specifications: Record<string, string>
  tags: string[]
  status: "active" | "hidden" | "out_of_stock"
  createdAt: string
  updatedAt: string
}

function toProduct(r: ProductRow): Product {
  const stock = r.stockQuantity ?? 0
  const oldPrice = r.comparePrice && r.comparePrice > r.price ? r.comparePrice : undefined
  let badge: Product["badge"] | undefined
  if (r.newArrival) badge = "New"
  else if (oldPrice) badge = "Sale"
  else if (r.bestSeller) badge = "Bestseller"
  else if (r.status === "out_of_stock") badge = "Limited"
  return {
    _id: r._id,
    id: r._id,
    slug: r.slug,
    name: r.name,
    category: r.category,
    categorySlug: r.categorySlug,
    subcategory: r.subcategory,
    price: Number(r.price),
    comparePrice: Number(r.comparePrice),
    oldPrice,
    rating: Number(r.rating),
    reviews: r.reviewsCount,
    reviewsCount: r.reviewsCount,
    image: r.thumbnail || r.images?.[0] || "/placeholder.svg",
    thumbnail: r.thumbnail || r.images?.[0] || "/placeholder.svg",
    images: r.images?.length ? r.images : [r.thumbnail || "/placeholder.svg"],
    stock,
    stockQuantity: stock,
    sku: r.sku,
    badge,
    description: r.description,
    shortDescription: r.shortDescription,
    brand: r.brand,
    featured: r.featured,
    bestSeller: r.bestSeller,
    newArrival: r.newArrival,
    specifications: r.specifications ?? {},
    tags: r.tags ?? [],
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }
}

function stockBadge(stock: number) {
  if (stock === 0) return { label: "Out of stock", cls: "bg-destructive/10 text-destructive border-destructive/20" }
  if (stock <= 12) return { label: `Low · ${stock}`, cls: "bg-accent/15 text-accent border-accent/25" }
  return { label: `In stock · ${stock}`, cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" }
}

const emptyForm = {
  id: "",
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  category: "",
  categorySlug: "",
  brand: "Haq Pro",
  thumbnail: "/products/football.png",
  price: "",
  comparePrice: "",
  stockQuantity: "",
  sku: "",
  featured: false,
  bestSeller: false,
  newArrival: false,
  status: "active" as "active" | "hidden" | "out_of_stock",
}

const PAGE_SIZE = 8

export function ProductsManager() {
  const [query, setQuery] = useState("")
  const [cat, setCat] = useState("all")
  const [rows, setRows] = useState<ProductRow[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [stockEdits, setStockEdits] = useState<Record<string, string>>({})
  const [featuredBusy, setFeaturedBusy] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (query) params.set("search", query)
      if (cat !== "all") params.set("category", cat)
      const res = await fetch(`/api/products?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to load products")
      const data: ProductRow[] = await res.json()
      setRows(data)
      setTotal(data.length)
    } catch {
      setError("Could not load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [query, cat])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories")
      if (!res.ok) return
      const data: Category[] = await res.json()
      setCats(data)
    } catch {
      // silent — categories filter just won't populate
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    setPage(1)
  }, [query, cat])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function openAdd() {
    setForm({ ...emptyForm, thumbnail: "/products/football.png" })
    setEditing(false)
    setFormError(null)
    setSheetOpen(true)
  }

  function openEdit(r: ProductRow) {
    setForm({
      id: r._id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      shortDescription: r.shortDescription,
      category: r.category,
      categorySlug: r.categorySlug,
      brand: r.brand,
      thumbnail: r.thumbnail || "/products/football.png",
      price: String(r.price),
      comparePrice: r.comparePrice ? String(r.comparePrice) : "",
      stockQuantity: String(r.stockQuantity),
      sku: r.sku,
      featured: r.featured,
      bestSeller: r.bestSeller,
      newArrival: r.newArrival,
      status: r.status,
    })
    setEditing(true)
    setFormError(null)
    setSheetOpen(true)
  }

  async function saveProduct() {
    setFormError(null)
    if (!form.name.trim()) return setFormError("Product name is required")
    if (!form.price || Number(form.price) <= 0) return setFormError("Price must be greater than 0")
    if (!form.categorySlug) return setFormError("Please select a category")

    setSaving(true)
    try {
      const body = {
        name: form.name,
        slug: form.slug || undefined,
        description: form.description,
        shortDescription: form.shortDescription,
        category: form.category,
        categorySlug: form.categorySlug,
        brand: form.brand,
        thumbnail: form.thumbnail,
        images: [form.thumbnail],
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : 0,
        stockQuantity: form.stockQuantity ? Number(form.stockQuantity) : 0,
        sku: form.sku,
        featured: form.featured,
        bestSeller: form.bestSeller,
        newArrival: form.newArrival,
        status: form.status,
      }

      const url = editing ? `/api/products/${form.id}` : "/api/products"
      // _id from MongoDB is a 24-char hex string; use it directly for edits
      const method = editing ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || "Failed to save product")
      }
      setSheetOpen(false)
      await fetchProducts()
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to save product")
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/products/${deleteId}`, { method: "DELETE" })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || "Failed to delete product")
      }
      setDeleteId(null)
      await fetchProducts()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete product")
    } finally {
      setDeleting(false)
    }
  }

  async function toggleFeatured(r: ProductRow) {
    setFeaturedBusy(r._id)
    try {
      const res = await fetch(`/api/products/${r._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !r.featured }),
      })
      if (!res.ok) throw new Error("Failed to update")
      await fetchProducts()
    } catch {
      setError("Could not update featured status")
    } finally {
      setFeaturedBusy(null)
    }
  }

  async function saveStock(r: ProductRow) {
    const raw = stockEdits[r._id]
    if (raw === undefined) return
    const qty = Number(raw)
    if (Number.isNaN(qty) || qty < 0) return
    if (qty === r.stockQuantity) {
      setStockEdits((s) => {
        const next = { ...s }
        delete next[r._id]
        return next
      })
      return
    }
    try {
      const res = await fetch(`/api/products/${r._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockQuantity: qty }),
      })
      if (!res.ok) throw new Error("Failed to update stock")
      setStockEdits((s) => {
        const next = { ...s }
        delete next[r._id]
        return next
      })
      await fetchProducts()
    } catch {
      setError("Could not update stock")
    }
  }

  return (
    <>
      <Card className="rounded-2xl border-border/60">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="h-10 rounded-xl pl-9"
              />
            </div>
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger className="h-10 w-full rounded-xl sm:w-44">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {cats.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={openAdd} className="h-10 rounded-xl bg-primary shadow-lg shadow-primary/20">
              <Plus className="size-4" />
              Add product
            </Button>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

          <div className="mt-5 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden sm:table-cell">Stock</TableHead>
                  <TableHead className="hidden sm:table-cell">Featured</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      <Loader2 className="mx-auto size-5 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : pageRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No products match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  pageRows.map((r) => {
                    const p = toProduct(r)
                    const sb = stockBadge(r.stockQuantity)
                    const stockValue = stockEdits[r._id] ?? String(r.stockQuantity)
                    return (
                      <TableRow key={r._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-border/60 bg-secondary/50">
                              <Image
                                src={r.thumbnail || "/placeholder.svg"}
                                alt={r.name}
                                width={44}
                                height={44}
                                className="size-9 object-contain"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium">{r.name}</p>
                              <p className="text-xs text-muted-foreground">{r.brand}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="secondary" className="rounded-full font-normal">
                            {r.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{formatPKR(p.price)}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={0}
                              value={stockValue}
                              onChange={(e) =>
                                setStockEdits((s) => ({ ...s, [r._id]: e.target.value }))
                              }
                              onBlur={() => saveStock(r)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") (e.target as HTMLInputElement).blur()
                              }}
                              className="h-8 w-20 rounded-lg"
                            />
                            <Badge variant="outline" className={cn("rounded-full font-medium", sb.cls)}>
                              {sb.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <button
                            onClick={() => toggleFeatured(r)}
                            disabled={featuredBusy === r._id}
                            className="inline-flex items-center gap-2"
                            aria-label="Toggle featured"
                          >
                            {featuredBusy === r._id ? (
                              <Loader2 className="size-4 animate-spin text-muted-foreground" />
                            ) : (
                              <Star
                                className={cn(
                                  "size-4 transition-colors",
                                  r.featured ? "fill-accent text-accent" : "text-muted-foreground",
                                )}
                              />
                            )}
                            <Switch checked={r.featured} onCheckedChange={() => toggleFeatured(r)} />
                          </button>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                            >
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Actions</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEdit(r)}>
                                <Pencil className="size-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteId(r._id)}
                              >
                                <Trash2 className="size-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {total > PAGE_SIZE && (
            <div className="mt-5 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} · {total} products
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="size-4" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto p-6 sm:max-w-md">
          <SheetTitle className="font-display text-lg">
            {editing ? "Edit product" : "Add product"}
          </SheetTitle>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-name">Name</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. GrandSlam Willow Bat"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-slug">Slug (optional)</Label>
              <Input
                id="p-slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="auto-generated from name"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="p-category">Category</Label>
                <Select
                  value={form.categorySlug}
                  onValueChange={(v: string) => {
                    const c = cats.find((x) => x.slug === v)
                    setForm((f) => ({ ...f, categorySlug: v, category: c?.name ?? v }))
                  }}
                >
                  <SelectTrigger id="p-category" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {cats.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-brand">Brand</Label>
                <Input
                  id="p-brand"
                  value={form.brand}
                  onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="p-price">Price (PKR)</Label>
                <Input
                  id="p-price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-compare">Compare price (optional)</Label>
                <Input
                  id="p-compare"
                  type="number"
                  min={0}
                  value={form.comparePrice}
                  onChange={(e) => setForm((f) => ({ ...f, comparePrice: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="p-stock">Stock quantity</Label>
                <Input
                  id="p-stock"
                  type="number"
                  min={0}
                  value={form.stockQuantity}
                  onChange={(e) => setForm((f) => ({ ...f, stockQuantity: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-sku">SKU</Label>
                <Input
                  id="p-sku"
                  value={form.sku}
                  onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                  placeholder="HB-XX-001"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-thumb">Image URL</Label>
              <Input
                id="p-thumb"
                value={form.thumbnail}
                onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))}
                placeholder="/products/football.png"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-short">Short description</Label>
              <Input
                id="p-short"
                value={form.shortDescription}
                onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
                placeholder="One-line summary"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-desc">Description</Label>
              <Textarea
                id="p-desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={4}
                placeholder="Full product description"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v: string) => setForm((f) => ({ ...f, status: v as typeof form.status }))}
              >
                <SelectTrigger id="p-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                  <SelectItem value="out_of_stock">Out of stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-border/60 p-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="p-featured">Featured</Label>
                <Switch
                  id="p-featured"
                  checked={form.featured}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="p-best">Best seller</Label>
                <Switch
                  id="p-best"
                  checked={form.bestSeller}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, bestSeller: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="p-new">New arrival</Label>
                <Switch
                  id="p-new"
                  checked={form.newArrival}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, newArrival: v }))}
                />
              </div>
            </div>

            {formError && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button onClick={saveProduct} disabled={saving} className="flex-1">
                {saving && <Loader2 className="size-4 animate-spin" />}
                {editing ? "Save changes" : "Create product"}
              </Button>
              <Button variant="outline" onClick={() => setSheetOpen(false)} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete confirm sheet */}
      <Sheet open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <SheetContent side="right" className="w-full p-6 sm:max-w-sm">
          <SheetTitle className="font-display text-lg">Delete product?</SheetTitle>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">
            This will permanently remove the product from your catalogue. This action cannot be undone.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting && <Loader2 className="size-4 animate-spin" />}
              Delete
            </Button>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>
              Cancel
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
