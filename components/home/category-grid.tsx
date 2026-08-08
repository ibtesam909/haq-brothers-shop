import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { categories } from "@/lib/data"
import { Reveal } from "@/components/store/reveal"

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-primary">Browse by category</span>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
          Find your game
        </h2>
        <p className="mt-3 text-muted-foreground text-pretty">
          From the pitch to the playroom — explore our curated collections built for every athlete and every age.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((category, i) => (
          <Reveal key={category.slug} delay={i * 60}>
            <Link
              href={`/shop?category=${category.slug}`}
              className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-3xl border border-border/70 bg-card p-4 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-0 top-0 flex h-3/5 items-center justify-center p-5">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  width={140}
                  height={140}
                  className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="relative z-10">
                <p className="font-display text-base font-bold transition-colors group-hover:text-background">
                  {category.name}
                </p>
                <p className="text-xs text-muted-foreground transition-colors group-hover:text-background/70">
                  {category.count} items
                </p>
              </div>
              <span className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-500 group-hover:opacity-100">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
