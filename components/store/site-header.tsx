"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, Menu, Phone, Search, ShoppingBag, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { categories, siteConfig } from "@/lib/data"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Cricket", href: "/shop?category=cricket" },
  { label: "Football", href: "/shop?category=football" },
  { label: "Fitness", href: "/shop?category=fitness" },
  { label: "Toys", href: "/shop?category=toys" },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <div className="bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-xs sm:text-[13px]">
          <p className="flex items-center gap-2 font-medium">
            <Zap className="size-3.5 text-accent" />
            <span className="hidden sm:inline">Free delivery across Chakwal on orders over PKR 5,000</span>
            <span className="sm:hidden">Free delivery over PKR 5,000</span>
          </p>
          <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-1.5 transition-colors hover:text-accent">
            <Phone className="size-3.5" />
            {siteConfig.phone}
          </a>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled ? "glass border-border/60 shadow-sm" : "border-transparent bg-background",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5">
          <div className="flex items-center gap-2 lg:hidden">
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open menu" />}>
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex items-center gap-2 border-b p-5">
                  <Logo />
                </div>
                <nav className="flex flex-col p-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="border-t p-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Categories
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/shop?category=${c.slug}`}
                        className="rounded-xl border px-3 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/" className="shrink-0">
            <Logo />
          </Link>

          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden max-w-xs flex-1 items-center md:flex">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search gear & toys..."
                className="h-10 rounded-full border-border bg-secondary/60 pl-10 focus-visible:bg-background"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1 md:ml-2">
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search">
              <Search className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" aria-label="Wishlist">
              <Heart className="size-5" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-accent" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
              <ShoppingBag className="size-5" />
              <Badge className="absolute -right-0.5 -top-0.5 grid size-5 min-w-5 place-items-center rounded-full border-2 border-background bg-primary p-0 text-[10px] text-primary-foreground">
                3
              </Badge>
            </Button>
          </div>
        </div>
      </header>
    </>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md">
        <span className="font-display text-lg font-extrabold">HB</span>
      </div>
      <div className="leading-none">
        <p className="font-display text-lg font-extrabold tracking-tight">{siteConfig.name}</p>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {siteConfig.tagline}
        </p>
      </div>
    </div>
  )
}
