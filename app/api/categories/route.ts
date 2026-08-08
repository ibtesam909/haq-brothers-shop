import { NextResponse, type NextRequest } from "next/server"
import { supabase } from "@/lib/supabase-server"

type CategoryRow = {
  id: string
  name: string
  slug: string
  image: string
  icon: string
  description: string
  parent_category: string | null
  parent_slug: string | null
  featured: boolean
  display_order: number
  count: number
}

type CategoryApiResponse = {
  _id: string
  id: string
  name: string
  slug: string
  image: string
  icon: string
  description: string
  parentCategory: string | null
  parentSlug: string | null
  featured: boolean
  displayOrder: number
  count: number
}

function mapRow(r: CategoryRow): CategoryApiResponse {
  return {
    _id: r.id,
    id: r.id,
    name: r.name,
    slug: r.slug,
    image: r.image,
    icon: r.icon,
    description: r.description,
    parentCategory: r.parent_category,
    parentSlug: r.parent_slug,
    featured: r.featured,
    displayOrder: r.display_order,
    count: r.count,
  }
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true })

    if (error) throw error

    return NextResponse.json((data as CategoryRow[]).map(mapRow))
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    const slug = slugify(body.slug ?? body.name)

    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle()
    if (existing) {
      return NextResponse.json({ error: "Category slug already exists" }, { status: 409 })
    }

    let parentCategory: string | null = null
    let parentSlug: string | null = null
    if (body.parentCategory) {
      const { data: parent } = await supabase
        .from("categories")
        .select("name, slug")
        .eq("slug", body.parentSlug ?? body.parentCategory)
        .maybeSingle()
      if (parent) {
        parentCategory = (parent as CategoryRow).name
        parentSlug = (parent as CategoryRow).slug
      }
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: body.name,
        slug,
        image: body.image ?? "/placeholder.svg",
        icon: body.icon ?? "",
        description: body.description ?? "",
        parent_category: parentCategory,
        parent_slug: parentSlug,
        featured: body.featured ?? false,
        display_order: body.displayOrder ?? 0,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(mapRow(data as CategoryRow), { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
