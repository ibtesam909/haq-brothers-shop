import { Quote } from "lucide-react"
import { testimonials } from "@/lib/data"
import { RatingStars } from "@/components/store/rating-stars"
import { Reveal } from "@/components/store/reveal"

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-primary">Loved by athletes</span>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
          What our customers say
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 90}>
            <figure className="relative flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <Quote className="size-8 text-accent/30" />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground/90 text-pretty">
                “{t.quote}”
              </blockquote>
              <RatingStars rating={t.rating} className="mt-5" />
              <figcaption className="mt-4 flex items-center gap-3 border-t pt-4">
                <div className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-primary to-accent font-display font-bold text-primary-foreground">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
