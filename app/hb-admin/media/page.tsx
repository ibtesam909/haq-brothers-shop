import { AdminTopbar } from "@/components/admin/admin-topbar"
import { ImageUploader } from "@/components/admin/image-uploader"

export const metadata = {
  title: "Media — Haq Brothers Admin",
}

export default function AdminMediaPage() {
  return (
    <>
      <AdminTopbar title="Media library" subtitle="Upload and manage product imagery" />
      <div className="p-4 md:p-6">
        <ImageUploader />
      </div>
    </>
  )
}
