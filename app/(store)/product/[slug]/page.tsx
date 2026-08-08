import { notFound } from "next/navigation"
import { getProductBySlug, products } from "@/lib/data"
import { ProductDetail } from "@/components/shop/product-detail"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return { title: "Product not found" }
  return {
    title: `${product.name} — Haq Brothers`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()
  const related = products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4)
  return <ProductDetail product={product} related={related} />
}
