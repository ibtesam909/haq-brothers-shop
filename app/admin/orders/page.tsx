import { CheckCircle2, Clock, Truck, XCircle } from "lucide-react"
import { AdminTopbar } from "@/components/admin/admin-topbar"
import { OrdersTable } from "@/components/admin/orders-table"
import { StatCard } from "@/components/admin/stat-card"

export const metadata = {
  title: "Orders — Haq Brothers Admin",
}

export default function AdminOrdersPage() {
  return (
    <>
      <AdminTopbar title="Orders" subtitle="Track and fulfil customer orders" />
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Delivered" value="3,182" delta={6.2} icon={CheckCircle2} accent="primary" />
          <StatCard label="Processing" value="146" delta={4.8} icon={Clock} accent="accent" />
          <StatCard label="Shipped" value="284" delta={9.1} icon={Truck} accent="primary" />
          <StatCard label="Cancelled" value="52" delta={-1.6} icon={XCircle} accent="accent" />
        </div>
        <OrdersTable />
      </div>
    </>
  )
}
