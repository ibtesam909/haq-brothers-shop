import { Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Reveal } from "@/components/store/reveal"

export function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 text-center sm:p-14">
          <div className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 size-64 rounded-full bg-accent/15 blur-3xl" />

          <div className="relative mx-auto max-w-xl">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <Mail className="size-7" />
            </div>
            <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              Join the Haq Brothers club
            </h2>
            <p className="mt-3 text-muted-foreground text-pretty">
              Be first to know about new arrivals, exclusive drops, and members-only discounts. No spam, just great
              gear.
            </p>

            <form className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="h-12 rounded-full border-border bg-background pl-10"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="group h-12 gap-2 rounded-full px-7 shadow-lg shadow-primary/25"
              >
                Subscribe
                <Send className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
