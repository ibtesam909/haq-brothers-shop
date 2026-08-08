import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type StatCardProps = {
  label: string
  value: string
  delta: number
  icon: LucideIcon
  accent?: "primary" | "accent"
}

export function StatCard({ label, value, delta, icon: Icon, accent = "primary" }: StatCardProps) {
  const positive = delta >= 0
  return (
    <Card className="group relative overflow-hidden rounded-2xl border-border/60 p-5 transition-all hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <span
          className={cn(
            "grid size-11 place-items-center rounded-xl transition-transform group-hover:scale-110",
            accent === "primary" ? "bg-primary/10 text-primary" : "bg-accent/15 text-accent",
          )}
        >
          <Icon className="size-5" />
        </span>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-sm">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold",
            positive ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive",
          )}
        >
          {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          {Math.abs(delta)}%
        </span>
        <span className="text-muted-foreground">vs last month</span>
      </div>
    </Card>
  )
}
