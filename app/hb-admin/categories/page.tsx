import { AdminTopbar } from "@/components/admin/admin-topbar"
import { CategoriesManager } from "@/components/admin/categories-manager"

export const metadata = {
  title: "Categories — Haq Brothers Admin",
}

export default function AdminCategoriesPage() {
  return (
    <>
      <AdminTopbar title="Categories" subtitle="Group your products into shoppable collections" />
      <div className="p-4 md:p-6">
        <CategoriesManager />
      </div>
    </>
  )
}
