"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Minus, Plus, ShoppingBag, Truck, ShieldCheck, RefreshCw, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RatingStars } from "@/components/store/rating-stars"
import { ProductCard } from "@/components/store/product-card"
import { Reveal } from "@/components/store/reveal"
import { formatPKR, type Product } from "@/lib/data"
import { cn } from "@/lib/utils"

const specs = [
  ["Brand", "brand"],
  ["Category", "category"],
  ["Warranty", null],
  ["Material", null],
  ["SKU", null],
] as const

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [qty, setQty] = useState(1)
  const [activeThumb, setActiveThumb] = useState(0)
  const outOfStock = product.stock === 0
  const thumbs = [product.image, product.image, product.image]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/shop" className="transition-colors hover:text-foreground">
          Shop
        </Link>
        <ChevronRight className="size-3.5" />
        <Link
          href={`/shop?category=${product.categorySlug}`}
          className="transition-colors hover:text-foreground"
        >
          {product.category}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {/* gallery */}
        <div className="animate-fade-in">
          <div className="relative aspect-square overflow-hidden rounded-3xl border bg-secondary/40">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10" />
            <Image
              src={thumbs[activeThumb] || "/placeholder.svg"}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-contain p-10"
            />
            {product.badge && (
              <Badge className="absolute left-4 top-4 rounded-full border-0 bg-accent px-3 py-1 text-accent-foreground">
                {product.badge}
              </Badge>
            )}
          </div>
          <div className="mt-4 flex gap-3">
            {thumbs.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveThumb(i)}
                className={cn(
                  "relative aspect-square w-20 overflow-hidden rounded-2xl border-2 bg-secondary/40 transition-all",
                  activeThumb === i ? "border-primary" : "border-transparent hover:border-border",
                )}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={t || "/placeholder.svg"} alt="" fill sizes="80px" className="object-contain p-2" />
              </button>
            ))}
          </div>
        </div>

        {/* info */}
        <div className="animate-fade-up">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium uppercase tracking-wide text-primary">{product.category}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{product.brand}</span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <RatingStars rating={product.rating} size={16} />
            <span className="text-sm text-muted-foreground">
              {product.rating} • {product.reviews} reviews
            </span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <span className="font-display text-4xl font-extrabold">{formatPKR(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="pb-1.5 text-lg text-muted-foreground line-through">
                  {formatPKR(product.oldPrice)}
                </span>
                <Badge className="mb-1.5 rounded-full border-0 bg-accent/15 text-accent">
                  Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                </Badge>
              </>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-muted-foreground text-pretty">{product.description}</p>

          <div className="mt-6 flex items-center gap-2 text-sm">
            <span
              className={cn(
                "flex size-2 rounded-full",
                outOfStock ? "bg-destructive" : "bg-primary",
              )}
            />
            <span className={cn("font-medium", outOfStock ? "text-destructive" : "text-primary")}>
              {outOfStock ? "Currently out of stock" : `In stock — ${product.stock} available`}
            </span>
          </div>

          <Separator className="my-7" />

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border bg-card p-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-10 rounded-full"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" />
              </Button>
              <span className="w-10 text-center font-display font-semibold tabular-nums">{qty}</span>
              <Button
                variant="ghost"
                size="icon"
                className="size-10 rounded-full"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </Button>
            </div>

            <Button
              disabled={outOfStock}
              size="lg"
              className="group h-12 flex-1 gap-2 rounded-full text-base shadow-lg shadow-primary/25"
            >
              <ShoppingBag className="size-5" />
              {outOfStock ? "Sold Out" : "Add to Cart"}
            </Button>

            <Button variant="outline" size="icon" className="size-12 rounded-full" aria-label="Add to wishlist">
              <Heart className="size-5" />
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, label: "Free delivery over PKR 5,000" },
              { icon: ShieldCheck, label: "1-year brand warranty" },
              { icon: RefreshCw, label: "7-day easy returns" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2.5 rounded-2xl border bg-card p-3">
                <f.icon className="size-5 shrink-0 text-primary" />
                <span className="text-xs leading-tight text-muted-foreground">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* tabs */}
      <div className="mt-14">
        <Tabs defaultValue="description">
          <TabsList className="h-11 rounded-full bg-secondary p-1">
            <TabsTrigger value="description" className="rounded-full px-5">
              Description
            </TabsTrigger>
            <TabsTrigger value="specs" className="rounded-full px-5">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-full px-5">
              Reviews ({product.reviews})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            <p className="text-pretty">{product.description}</p>
            <p className="mt-4 text-pretty">
              Every product at Haq Brothers is inspected by our team before it reaches you. Backed by our quality
              promise and friendly after-sales support at our Choa Saiden Shah store.
            </p>
          </TabsContent>

          <TabsContent value="specs" className="mt-6 max-w-2xl">
            <dl className="divide-y rounded-2xl border">
              {specs.map(([label, key], i) => (
                <div key={label} className="flex items-center justify-between px-5 py-3.5">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-medium">
                    {key ? (product[key as keyof Product] as string) : ["12 months", "Premium grade", `HB-${product.id}00${i}`][i - 2] ?? "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 max-w-3xl">
            <div className="flex flex-col gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center">
              <div className="text-center sm:border-r sm:pr-8">
                <p className="font-display text-5xl font-extrabold">{product.rating}</p>
                <RatingStars rating={product.rating} className="mt-2 justify-center" />
                <p className="mt-1 text-xs text-muted-foreground">{product.reviews} reviews</p>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const pct = star === 5 ? 72 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 2 : 1
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="w-6 text-xs text-muted-foreground">{star}★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-xs text-muted-foreground">{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">You might also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
