"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { categorySales, revenueData, trafficData } from "@/lib/data"

const revenueConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

const trafficConfig = {
  visitors: { label: "Visitors", color: "var(--chart-1)" },
  sales: { label: "Sales", color: "var(--chart-2)" },
} satisfies ChartConfig

const categoryConfig = {
  value: { label: "Share" },
} satisfies ChartConfig

const pieColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

export function RevenueChart() {
  return (
    <Card className="rounded-2xl border-border/60">
      <CardHeader>
        <CardTitle className="font-display">Revenue overview</CardTitle>
        <CardDescription>Monthly revenue across the last 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueConfig} className="h-[280px] w-full">
          <AreaChart data={revenueData} margin={{ left: 4, right: 4, top: 8 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="var(--border)" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} fontSize={12} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `PKR ${Number(value).toLocaleString("en-PK")}`}
                />
              }
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function TrafficChart() {
  return (
    <Card className="rounded-2xl border-border/60">
      <CardHeader>
        <CardTitle className="font-display">Weekly traffic</CardTitle>
        <CardDescription>Visitors and conversions this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={trafficConfig} className="h-[260px] w-full">
          <BarChart data={trafficData} margin={{ left: 4, right: 4, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="var(--border)" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="visitors" fill="var(--color-visitors)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="sales" fill="var(--color-sales)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function CategoryChart() {
  return (
    <Card className="rounded-2xl border-border/60">
      <CardHeader>
        <CardTitle className="font-display">Sales by category</CardTitle>
        <CardDescription>Share of total sales</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={categoryConfig} className="mx-auto aspect-square max-h-[260px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="category" hideLabel />} />
            <Pie data={categorySales} dataKey="value" nameKey="category" innerRadius={58} strokeWidth={4}>
              {categorySales.map((entry, i) => (
                <Cell key={entry.category} fill={pieColors[i % pieColors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {categorySales.map((entry, i) => (
            <div key={entry.category} className="flex items-center gap-2 text-sm">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: pieColors[i % pieColors.length] }}
              />
              <span className="text-muted-foreground">{entry.category}</span>
              <span className="ml-auto font-medium">{entry.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
