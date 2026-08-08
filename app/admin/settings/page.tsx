import { AdminTopbar } from "@/components/admin/admin-topbar"
import { SettingsPanel } from "@/components/admin/settings-panel"

export const metadata = {
  title: "Settings — Haq Brothers Admin",
}

export default function AdminSettingsPage() {
  return (
    <>
      <AdminTopbar title="Settings" subtitle="Manage your store profile and preferences" />
      <div className="mx-auto max-w-3xl p-4 md:p-6">
        <SettingsPanel />
      </div>
    </>
  )
}
