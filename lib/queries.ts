import { connectDB } from "@/lib/mongodb"
import { Product, type IProduct } from "@/lib/models/Product"
import { Category, type ICategory } from "@/lib/models/Category"
import { Settings, type ISettings } from "@/lib/models/Settings"

export type ProductLean = ReturnType<typeof Product.prototype.toObject> & { _id: IProduct["_id"] }
export type CategoryLean = ReturnType<typeof Category.prototype.toObject> & { _id: ICategory["_id"] }
export type SettingsLean = ReturnType<typeof Settings.prototype.toObject> & { _id: ISettings["_id"] }

export async function getSettings() {
  await connectDB()
  const settings = await Settings.findOne()
  if (!settings) {
    const created = await Settings.create({})
    return created.toObject()
  }
  return settings.toObject()
}

export async function getCategories() {
  await connectDB()
  const cats = await Category.find().sort({ displayOrder: 1, name: 1 }).lean()
  return cats
}

export async function getFeaturedCategories() {
  await connectDB()
  const cats = await Category.find({ featured: true })
    .sort({ displayOrder: 1 })
    .lean()
  return cats
}

export async function getProductsByStatus(status: string = "active") {
  await connectDB()
  const filter = status === "all" ? {} : { status }
  return Product.find(filter).sort({ createdAt: -1 }).lean()
}

export async function getFeaturedProducts(limit = 8) {
  await connectDB()
  return Product.find({ status: "active", featured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
}

export async function getBestSellerProducts(limit = 8) {
  await connectDB()
  return Product.find({ status: "active", bestSeller: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
}

export async function getNewArrivalProducts(limit = 8) {
  await connectDB()
  return Product.find({ status: "active", newArrival: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
}

export async function getProductBySlug(slug: string) {
  await connectDB()
  return Product.findOne({ slug }).lean()
}

export async function getRelatedProducts(product: ProductLean, limit = 4) {
  await connectDB()
  return Product.find({
    status: "active",
    categorySlug: product.categorySlug,
    _id: { $ne: product._id },
  })
    .limit(limit)
    .lean()
}

export async function getAllProductsForAdmin() {
  await connectDB()
  return Product.find().sort({ createdAt: -1 }).lean()
}

export async function getAllCategoriesForAdmin() {
  await connectDB()
  return Category.find().sort({ displayOrder: 1, name: 1 }).lean()
}

export async function getAnalyticsSummary() {
  await connectDB()
  const [totalProducts, featuredProducts, totalCategories, lowStockProducts, inventoryValueAgg] =
    await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ featured: true }),
      Category.countDocuments(),
      Product.countDocuments({ stockQuantity: { $lte: 12, $gt: 0 } }),
      Product.aggregate([
        { $group: { _id: null, total: { $sum: { $multiply: ["$price", "$stockQuantity"] } } } },
      ]),
    ])

  return {
    totalProducts,
    featuredProducts,
    totalCategories,
    lowStockProducts,
    inventoryValue: inventoryValueAgg[0]?.total ?? 0,
  }
}

export async function getCategorySalesData() {
  await connectDB()
  return Product.aggregate([
    { $match: { status: "active" } },
    { $group: { _id: "$category", value: { $sum: 1 } } },
    { $sort: { value: -1 } },
    { $project: { _id: 0, category: "$_id", value: 1 } },
  ])
}

export async function getInventoryStatusData() {
  await connectDB()
  const [inStock, lowStock, outOfStock] = await Promise.all([
    Product.countDocuments({ stockQuantity: { $gt: 12 } }),
    Product.countDocuments({ stockQuantity: { $lte: 12, $gt: 0 } }),
    Product.countDocuments({ stockQuantity: 0 }),
  ])
  return [
    { name: "In Stock", value: inStock },
    { name: "Low Stock", value: lowStock },
    { name: "Out of Stock", value: outOfStock },
  ]
}

export async function getRecentProducts(limit = 5) {
  await connectDB()
  return Product.find().sort({ updatedAt: -1 }).limit(limit).lean()
}
