import { NextResponse, type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Category, type ICategory } from "@/lib/models/Category"
import { Product } from "@/lib/models/Product"
import { isValidObjectId } from "mongoose"

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB()
    const { id } = await params
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid category id" }, { status: 400 })
    }
    const body = await req.json()

    const update: Record<string, unknown> = {}
    const allowedFields = [
      "name", "slug", "image", "icon", "description",
      "parentCategory", "parentSlug", "featured", "displayOrder", "count",
    ]

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        update[field] = body[field]
      }
    }
    if (body.parent_category !== undefined) update.parentCategory = body.parent_category
    if (body.parent_slug !== undefined) update.parentSlug = body.parent_slug
    if (body.display_order !== undefined) update.displayOrder = body.display_order
    if (body.slug !== undefined) update.slug = slugify(body.slug)

    const category = await Category.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean()

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }
    return NextResponse.json(category)
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB()
    const { id } = await params
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid category id" }, { status: 400 })
    }

    const category = await Category.findById(id).lean<ICategory>()
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const productCount = await Product.countDocuments({ categorySlug: category.slug })
    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete — ${productCount} products use this category` },
        { status: 409 },
      )
    }

    await Category.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
