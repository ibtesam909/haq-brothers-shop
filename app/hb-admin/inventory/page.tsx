import { AdminTopbar } from "@/components/admin/admin-topbar"
import { InventoryManager } from "@/components/admin/inventory-manager"

export const metadata = {
  title: "Inventory — Haq Brothers Admin",
}

export default function AdminInventoryPage() {
  return (
    <>
      <AdminTopbar title="Inventory" subtitle="Monitor stock levels and restock in seconds" />
      <div className="p-4 md:p-6">
        <InventoryManager />
      </div>
    </>
  )
}
