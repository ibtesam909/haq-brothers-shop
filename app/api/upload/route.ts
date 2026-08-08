import { NextResponse, type NextRequest } from "next/server"
import { uploadToCloudinary, listCloudinaryResources, deleteFromCloudinary } from "@/lib/cloudinary"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") ?? ""
    const resources = await listCloudinaryResources()

    const filtered = search
      ? resources.filter((r) => r.public_id.toLowerCase().includes(search.toLowerCase()))
      : resources

    return NextResponse.json(
      filtered.map((r) => ({
        public_id: r.public_id,
        url: r.secure_url,
        width: r.width,
        height: r.height,
        format: r.format,
        bytes: r.bytes,
        created_at: r.created_at,
      })),
    )
  } catch {
    return NextResponse.json({ error: "Failed to list media" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll("files") as File[]
    const folder = (formData.get("folder") as string) || "haq-brothers"

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const results = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        return uploadToCloudinary(buffer, folder)
      }),
    )

    return NextResponse.json(results, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const publicId = searchParams.get("public_id")
    if (!publicId) {
      return NextResponse.json({ error: "public_id is required" }, { status: 400 })
    }
    await deleteFromCloudinary(publicId)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
