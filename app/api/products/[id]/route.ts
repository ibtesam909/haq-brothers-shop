import { NextResponse, type NextRequest } from "next/server"
import { supabase } from "@/lib/supabase-server"

type ProductRow = {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  category: string
  category_slug: string
  subcategory: string
  brand: string
  images: string[]
  thumbnail: string
  price: number
  compare_price: number
  stock_quantity: number
  sku: string
  featured: boolean
  best_seller: boolean
  new_arrival: boolean
  rating: number
  reviews_count: number
  specifications: Record<string, string>
  tags: string[]
  status: "active" | "hidden" | "out_of_stock"
  created_at: string
  updated_at: string
}

type ProductApiResponse = {
  _id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  category: string
  categorySlug: string
  subcategory: string
  brand: string
  images: string[]
  thumbnail: string
  price: number
  comparePrice: number
  stockQuantity: number
  sku: string
  featured: boolean
  bestSeller: boolean
  newArrival: boolean
  rating: number
  reviewsCount: number
  specifications: Record<string, string>
  tags: string[]
  status: "active" | "hidden" | "out_of_stock"
  createdAt: string
  updatedAt: string
}

function mapRow(r: ProductRow): ProductApiResponse {
  return {
    _id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    shortDescription: r.short_description,
    category: r.category,
    categorySlug: r.category_slug,
    subcategory: r.subcategory,
    brand: r.brand,
    images: r.images ?? [],
    thumbnail: r.thumbnail,
    price: Number(r.price),
    comparePrice: Number(r.compare_price),
    stockQuantity: r.stock_quantity,
    sku: r.sku,
    featured: r.featured,
    bestSeller: r.best_seller,
    newArrival: r.new_arrival,
    rating: Number(r.rating),
    reviewsCount: r.reviews_count,
    specifications: r.specifications ?? {},
    tags: r.tags ?? [],
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ error: "Product not found" }, { status: 404 })

    return NextResponse.json(mapRow(data as ProductRow))
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await req.json()

    const update: Record<string, unknown> = {}
    const allowedFields: Record<string, string> = {
      name: "name",
      slug: "slug",
      description: "description",
      shortDescription: "short_description",
      category: "category",
      categorySlug: "category_slug",
      subcategory: "subcategory",
      brand: "brand",
      images: "images",
      thumbnail: "thumbnail",
      price: "price",
      comparePrice: "compare_price",
      stockQuantity: "stock_quantity",
      sku: "sku",
      featured: "featured",
      bestSeller: "best_seller",
      newArrival: "new_arrival",
      rating: "rating",
      reviewsCount: "reviews_count",
      specifications: "specifications",
      tags: "tags",
      status: "status",
    }

    for (const [bodyKey, dbColumn] of Object.entries(allowedFields)) {
      if (body[bodyKey] !== undefined) {
        update[dbColumn] = body[bodyKey]
      }
    }

    if (body.oldPrice !== undefined) update.compare_price = body.oldPrice
    if (body.stock !== undefined) {
      update.stock_quantity = body.stock
      if (body.stock === 0 && update.status === undefined) {
        update.status = "out_of_stock"
      }
    }
    if (body.reviews !== undefined) update.reviews_count = body.reviews
    if (body.short_description !== undefined) update.short_description = body.short_description
    if (body.category_slug !== undefined) update.category_slug = body.category_slug
    if (body.stock_quantity !== undefined) {
      update.stock_quantity = body.stock_quantity
      if (body.stock_quantity === 0 && update.status === undefined) {
        update.status = "out_of_stock"
      }
    }

    const { data, error } = await supabase
      .from("products")
      .update(update)
      .eq("id", id)
      .select()
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ error: "Product not found" }, { status: 404 })

    return NextResponse.json(mapRow(data as ProductRow))
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const { error, count } = await supabase
      .from("products")
      .delete({ count: "exact" })
      .eq("id", id)

    if (error) throw error
    if (count === 0) return NextResponse.json({ error: "Product not found" }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
