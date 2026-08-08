import { DollarSign, Repeat, TrendingUp, Users } from "lucide-react"
import { AdminTopbar } from "@/components/admin/admin-topbar"
import { StatCard } from "@/components/admin/stat-card"
import { CategoryChart, RevenueChart, TrafficChart } from "@/components/admin/dashboard-charts"

export const metadata = {
  title: "Analytics — Haq Brothers Admin",
}

export default function AdminAnalyticsPage() {
  return (
    <>
      <AdminTopbar title="Analytics" subtitle="Understand how your store is performing" />
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Avg. order value" value="PKR 6,420" delta={5.7} icon={DollarSign} accent="primary" />
          <StatCard label="Conversion rate" value="4.8%" delta={1.9} icon={TrendingUp} accent="accent" />
          <StatCard label="Returning buyers" value="38%" delta={3.4} icon={Repeat} accent="primary" />
          <StatCard label="New customers" value="612" delta={11.2} icon={Users} accent="accent" />
        </div>

        <RevenueChart />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TrafficChart />
          </div>
          <CategoryChart />
        </div>
      </div>
    </>
  )
}
