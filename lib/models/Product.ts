import { Schema, model, models, type Document } from "mongoose"

export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  shortDescription: string
  category: string
  categorySlug: string
  subcategory?: string
  brand: string
  images: string[]
  thumbnail: string
  price: number
  comparePrice?: number
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
  createdAt: Date
  updatedAt: Date
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true, default: "" },
    shortDescription: { type: String, default: "" },
    category: { type: String, required: true, trim: true },
    categorySlug: { type: String, required: true, index: true },
    subcategory: { type: String, default: "" },
    brand: { type: String, required: true, default: "Haq Pro" },
    images: { type: [String], default: [] },
    thumbnail: { type: String, default: "/placeholder.svg" },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, default: 0 },
    stockQuantity: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    specifications: { type: Schema.Types.Mixed, default: {} },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["active", "hidden", "out_of_stock"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true },
)

ProductSchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name)
  }
  if (this.name && this.slug) {
    this.slug = slugify(this.slug)
  }
  if (!this.thumbnail && this.images.length > 0) {
    this.thumbnail = this.images[0]
  }
  if (this.stockQuantity === 0 && this.status === "active") {
    this.status = "out_of_stock"
  }
  next()
})

export const Product = models.Product ?? model<IProduct>("Product", ProductSchema)
