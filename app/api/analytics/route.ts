import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/lib/models/Product"
import { Category } from "@/lib/models/Category"

export async function GET() {
  try {
    await connectDB()
    const [
      totalProducts,
      featuredProducts,
      totalCategories,
      lowStockProducts,
      outOfStockProducts,
      inventoryValueAgg,
      categorySales,
      inventoryStatus,
      recentProducts,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ featured: true }),
      Category.countDocuments(),
      Product.countDocuments({ stockQuantity: { $lte: 12, $gt: 0 } }),
      Product.countDocuments({ stockQuantity: 0 }),
      Product.aggregate([
        { $group: { _id: null, total: { $sum: { $multiply: ["$price", "$stockQuantity"] } } } },
      ]),
      Product.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: "$category", value: { $sum: 1 } } },
        { $sort: { value: -1 } },
        { $project: { _id: 0, category: "$_id", value: 1 } },
      ]),
      Product.aggregate([
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $eq: ["$stockQuantity", 0] }, then: "Out of Stock" },
                  { case: { $lte: ["$stockQuantity", 12] }, then: "Low Stock" },
                ],
                default: "In Stock",
              },
            },
            value: { $sum: 1 },
          },
        },
        { $project: { _id: 0, name: "$_id", value: 1 } },
      ]),
      Product.find().sort({ updatedAt: -1 }).limit(5).select("name slug thumbnail stockQuantity status updatedAt").lean(),
    ])

    return NextResponse.json({
      totalProducts,
      featuredProducts,
      totalCategories,
      lowStockProducts,
      outOfStockProducts,
      inventoryValue: inventoryValueAgg[0]?.total ?? 0,
      categorySales,
      inventoryStatus,
      recentProducts,
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
