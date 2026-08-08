import { AdminTopbar } from "@/components/admin/admin-topbar"
import { ProductsManager } from "@/components/admin/products-manager"

export const metadata = {
  title: "Products — Haq Brothers Admin",
}

export default function AdminProductsPage() {
  return (
    <>
      <AdminTopbar title="Products" subtitle="Create, edit and organise your catalogue" />
      <div className="p-4 md:p-6">
        <ProductsManager />
      </div>
    </>
  )
}
