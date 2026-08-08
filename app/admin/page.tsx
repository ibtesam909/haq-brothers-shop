import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { AdminTopbar } from "@/components/admin/admin-topbar"
import { StatCard } from "@/components/admin/stat-card"
import { CategoryChart, RevenueChart, TrafficChart } from "@/components/admin/dashboard-charts"
import { OrdersTable } from "@/components/admin/orders-table"

export default function AdminOverviewPage() {
  return (
    <>
      <AdminTopbar title="Dashboard" subtitle="Welcome back, here is your store at a glance" />
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total revenue" value="PKR 8.75M" delta={12.4} icon={DollarSign} accent="primary" />
          <StatCard label="Orders" value="4,238" delta={8.1} icon={ShoppingCart} accent="accent" />
          <StatCard label="Products" value="261" delta={3.2} icon={Package} accent="primary" />
          <StatCard label="Customers" value="1,904" delta={-2.4} icon={Users} accent="accent" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <CategoryChart />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <OrdersTable />
          </div>
          <TrafficChart />
        </div>
      </div>
    </>
  )
}
