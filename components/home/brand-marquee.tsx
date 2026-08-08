const items = [
  "CRICKET",
  "FOOTBALL",
  "FITNESS",
  "BASKETBALL",
  "TOYS",
  "BADMINTON",
]

export function BrandMarquee() {
  const row = [...items, ...items]
  return (
    <div className="border-y bg-foreground py-4 text-background">
      <div className="relative flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
          {row.map((item, i) => (
            <div key={i} className="flex items-center gap-10">
              <span className="font-display text-xl font-bold tracking-tight sm:text-2xl">{item}</span>
              <span className="size-2 rounded-full bg-accent" />
            </div>
          ))}
        </div>
        <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10" aria-hidden="true">
          {row.map((item, i) => (
            <div key={i} className="flex items-center gap-10">
              <span className="font-display text-xl font-bold tracking-tight sm:text-2xl">{item}</span>
              <span className="size-2 rounded-full bg-accent" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
