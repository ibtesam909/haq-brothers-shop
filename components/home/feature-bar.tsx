import { ShieldCheck, Truck, Headphones, RefreshCw } from "lucide-react"
import { Reveal } from "@/components/store/reveal"

const features = [
  { icon: Truck, title: "Fast Delivery", desc: "Free shipping over PKR 5,000 across Chakwal" },
  { icon: ShieldCheck, title: "Genuine Products", desc: "100% authentic gear from trusted brands" },
  { icon: RefreshCw, title: "Easy Returns", desc: "7-day hassle-free return policy" },
  { icon: Headphones, title: "Expert Support", desc: "Advice from real players & coaches" },
]

export function FeatureBar() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 70}>
            <div className="group flex h-full items-start gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
              <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="size-6" />
              </div>
              <div>
                <p className="font-display font-semibold">{f.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
