"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPKR } from "@/lib/data"

function useCountdown(target: number) {
  const [remaining, setRemaining] = useState(target)
  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [])
  const days = Math.floor(remaining / 86400)
  const hours = Math.floor((remaining % 86400) / 3600)
  const minutes = Math.floor((remaining % 3600) / 60)
  const seconds = remaining % 60
  return { days, hours, minutes, seconds }
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="grid min-w-14 place-items-center rounded-2xl border border-sidebar-border bg-sidebar-accent/60 px-3 py-2.5 font-display text-2xl font-bold tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1.5 text-[11px] uppercase tracking-wide text-sidebar-foreground/60">{label}</span>
    </div>
  )
}

export function DealBanner() {
  const { days, hours, minutes, seconds } = useCountdown(2 * 86400 + 8 * 3600 + 42 * 60)

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-sidebar text-sidebar-foreground">
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-accent/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 size-80 rounded-full bg-primary/25 blur-3xl" />

        <div className="relative grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground">
              Deal of the week
            </span>
            <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Up to 30% off premium cricket gear
            </h2>
            <p className="mt-4 max-w-md text-sidebar-foreground/70">
              Kit out for the new season with pro-grade bats, balls and pads. Limited stock — once they&apos;re gone,
              they&apos;re gone.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <TimeBox value={days} label="Days" />
              <span className="pb-5 font-display text-2xl text-sidebar-foreground/40">:</span>
              <TimeBox value={hours} label="Hrs" />
              <span className="pb-5 font-display text-2xl text-sidebar-foreground/40">:</span>
              <TimeBox value={minutes} label="Min" />
              <span className="pb-5 font-display text-2xl text-sidebar-foreground/40">:</span>
              <TimeBox value={seconds} label="Sec" />
            </div>

            <Button
              asChild
              size="lg"
              className="group mt-8 h-12 gap-2 rounded-full bg-accent px-7 text-base text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent/90"
            >
              <Link href="/shop?category=cricket">
                Grab the deal
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-sm animate-float">
              <Image
                src="/products/cricket-bat.png"
                alt="Discounted premium cricket bat"
                fill
                sizes="(max-width: 1024px) 80vw, 40vw"
                className="object-contain drop-shadow-2xl"
              />
            </div>
            <div className="absolute right-4 top-4 flex size-24 flex-col items-center justify-center rounded-full bg-primary text-center text-primary-foreground shadow-xl sm:size-28">
              <span className="font-display text-2xl font-extrabold leading-none sm:text-3xl">30%</span>
              <span className="text-[11px] font-semibold uppercase tracking-wide">off</span>
            </div>
            <div className="absolute bottom-6 left-2 rounded-2xl border border-sidebar-border bg-sidebar-accent/90 px-4 py-3 shadow-xl backdrop-blur-sm">
              <p className="text-xs text-sidebar-foreground/60 line-through">{formatPKR(15000)}</p>
              <p className="font-display text-xl font-bold text-accent">{formatPKR(12500)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
