import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Play, Star, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-sidebar text-sidebar-foreground">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -left-32 top-0 size-96 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_color-mix(in_oklch,_var(--sidebar-foreground)_9%,_transparent)_1px,_transparent_0)] [background-size:26px_26px] opacity-40" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-sidebar-border bg-sidebar-accent/60 px-4 py-1.5 text-xs font-medium">
            <span className="flex size-2 rounded-full bg-accent" />
            #1 Sports & Toy Store in Chakwal
          </span>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Gear up to <span className="text-gradient">play bold</span> &amp; win big.
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-sidebar-foreground/70 sm:text-lg">
            Premium cricket, football, fitness gear and the toys kids love — hand-picked by Haq Brothers in Choa
            Saiden Shah. Quality you can trust, prices you&apos;ll love.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="group h-12 gap-2 rounded-full bg-primary px-7 text-base text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
            >
              <Link href="/shop">
                Shop Collection
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 gap-2 rounded-full border-sidebar-border bg-transparent px-6 text-base text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Play className="size-4 fill-current" />
              Watch Story
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div>
              <p className="font-display text-2xl font-bold">12k+</p>
              <p className="text-xs text-sidebar-foreground/60">Happy customers</p>
            </div>
            <div className="hidden h-10 w-px bg-sidebar-border sm:block" />
            <div>
              <div className="flex items-center gap-1">
                <p className="font-display text-2xl font-bold">4.9</p>
                <Star className="size-4 fill-accent text-accent" />
              </div>
              <p className="text-xs text-sidebar-foreground/60">Average rating</p>
            </div>
            <div className="hidden h-10 w-px bg-sidebar-border sm:block" />
            <div>
              <p className="font-display text-2xl font-bold">300+</p>
              <p className="text-xs text-sidebar-foreground/60">Products in store</p>
            </div>
          </div>
        </div>

        <div className="relative animate-scale-in">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-transparent to-accent/30 blur-2xl" />
            <div className="glass-dark relative h-full w-full overflow-hidden rounded-[2.5rem] border border-sidebar-border">
              <Image
                src="/products/hero-athlete.png"
                alt="Athlete in action with sports gear from Haq Brothers"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -left-4 top-10 flex animate-float items-center gap-3 rounded-2xl border border-sidebar-border bg-sidebar-accent/90 p-3 pr-5 shadow-xl backdrop-blur-sm">
              <div className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Truck className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Fast Delivery</p>
                <p className="text-xs text-sidebar-foreground/60">Across Chakwal</p>
              </div>
            </div>

            <div className="absolute -right-3 bottom-12 flex animate-float items-center gap-3 rounded-2xl border border-sidebar-border bg-sidebar-accent/90 p-3 pr-5 shadow-xl backdrop-blur-sm animation-delay-300">
              <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Star className="size-5 fill-current" />
              </div>
              <div>
                <p className="text-sm font-semibold">Premium Quality</p>
                <p className="text-xs text-sidebar-foreground/60">Trusted brands</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
