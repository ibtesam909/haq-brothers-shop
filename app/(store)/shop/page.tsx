import { ShopClient } from "@/components/shop/shop-client"

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  return <ShopClient initialCategory={category ?? "all"} />
}
