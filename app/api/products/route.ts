import { NextResponse, type NextRequest } from "next/server"
import { supabase } from "@/lib/supabase-server"

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") ?? ""
    const category = searchParams.get("category") ?? "all"
    const status = searchParams.get("status") ?? "all"
    const featured = searchParams.get("featured")
    const bestSeller = searchParams.get("bestSeller")
    const newArrival = searchParams.get("newArrival")
    const sort = searchParams.get("sort") ?? "newest"
    const limit = parseInt(searchParams.get("limit") ?? "0", 10)

    let query = supabase.from("products").select("*")

    if (search) query = query.ilike("name", `%${search}%`)
    if (category !== "all") query = query.eq("category_slug", category)
    if (status !== "all") query = query.eq("status", status)
    if (featured === "true") query = query.eq("featured", true)
    if (bestSeller === "true") query = query.eq("best_seller", true)
    if (newArrival === "true") query = query.eq("new_arrival", true)

    switch (sort) {
      case "price-asc":
        query = query.order("price", { ascending: true })
        break
      case "price-desc":
        query = query.order("price", { ascending: false })
        break
      case "rating":
        query = query.order("rating", { ascending: false })
        break
      case "best-selling":
        query = query.order("best_seller", { ascending: false }).order("reviews_count", { ascending: false })
        break
      default:
        query = query.order("created_at", { ascending: false })
    }

    if (limit > 0) query = query.limit(limit)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json((data as ProductRow[]).map(mapRow))
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: "Name, price, and category are required" },
        { status: 400 },
      )
    }

    const slug = slugify(body.slug ?? body.name)

    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle()
    if (existing) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 })
    }

    const images = body.images ?? (body.thumbnail ? [body.thumbnail] : ["/placeholder.svg"])
    const thumbnail = body.thumbnail ?? body.images?.[0] ?? "/placeholder.svg"
    const stockQuantity = body.stockQuantity ?? body.stock ?? 0
    let status: "active" | "hidden" | "out_of_stock" = body.status ?? "active"
    if (stockQuantity === 0 && status === "active") status = "out_of_stock"

    const { data, error } = await supabase
      .from("products")
      .insert({
        name: body.name,
        slug,
        description: body.description ?? "",
        short_description: body.shortDescription ?? "",
        category: body.category,
        category_slug: body.categorySlug ?? slugify(body.category),
        subcategory: body.subcategory ?? "",
        brand: body.brand ?? "Haq Pro",
        images,
        thumbnail,
        price: body.price,
        compare_price: body.comparePrice ?? body.oldPrice ?? 0,
        stock_quantity: stockQuantity,
        sku: body.sku ?? "",
        featured: body.featured ?? false,
        best_seller: body.bestSeller ?? false,
        new_arrival: body.newArrival ?? false,
        rating: body.rating ?? 0,
        reviews_count: body.reviewsCount ?? body.reviews ?? 0,
        specifications: body.specifications ?? {},
        tags: body.tags ?? [],
        status,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(mapRow(data as ProductRow), { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
