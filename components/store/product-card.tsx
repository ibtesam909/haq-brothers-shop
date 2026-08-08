import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RatingStars } from "@/components/store/rating-stars"
import { formatPKR, type Product } from "@/lib/data"
import { cn } from "@/lib/utils"

const badgeStyles: Record<NonNullable<Product["badge"]>, string> = {
  New: "bg-primary text-primary-foreground",
  Sale: "bg-accent text-accent-foreground",
  Bestseller: "bg-foreground text-background",
  Limited: "bg-accent text-accent-foreground",
}

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock === 0
  const lowStock = product.stock > 0 && product.stock <= 10

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
      <div className="relative aspect-square overflow-hidden bg-secondary/50">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={cn(
              "object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-2",
              outOfStock && "opacity-60 grayscale",
            )}
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.badge && (
            <Badge className={cn("rounded-full border-0 px-3 py-1 text-[11px] font-semibold shadow-sm", badgeStyles[product.badge])}>
              {product.badge}
            </Badge>
          )}
          {product.oldPrice && !product.badge && (
            <Badge className="rounded-full border-0 bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground">
              Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </Badge>
          )}
        </div>

        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-card/80 text-foreground/70 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-accent hover:text-accent-foreground group-hover:opacity-100"
        >
          <Heart className="size-4" />
        </button>

        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            disabled={outOfStock}
            className="w-full gap-2 rounded-xl bg-foreground text-background shadow-lg hover:bg-primary hover:text-primary-foreground"
          >
            <ShoppingBag className="size-4" />
            {outOfStock ? "Sold Out" : "Add to Cart"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.category}</span>
          <span
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium",
              outOfStock ? "text-destructive" : lowStock ? "text-accent" : "text-primary",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                outOfStock ? "bg-destructive" : lowStock ? "bg-accent" : "bg-primary",
              )}
            />
            {outOfStock ? "Out of stock" : lowStock ? `Only ${product.stock} left` : "In stock"}
          </span>
        </div>

        <Link href={`/product/${product.slug}`}>
          <h3 className="font-display text-[15px] font-semibold leading-snug text-balance transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <RatingStars rating={product.rating} />
          <span className="text-xs text-muted-foreground">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="mt-auto flex items-end gap-2 pt-2">
          <span className="font-display text-lg font-bold">{formatPKR(product.price)}</span>
          {product.oldPrice && (
            <span className="pb-0.5 text-sm text-muted-foreground line-through">{formatPKR(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </article>
  )
}
