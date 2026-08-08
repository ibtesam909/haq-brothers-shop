import { Schema, model, models, type Document } from "mongoose"

export interface ICategory extends Document {
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

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    image: { type: String, default: "/placeholder.svg" },
    icon: { type: String, default: "" },
    description: { type: String, default: "" },
    parentCategory: { type: String, default: null },
    parentSlug: { type: String, default: null, index: true },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  { timestamps: true },
)

CategorySchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name)
  }
  if (this.name && this.slug) {
    this.slug = slugify(this.slug)
  }
  next()
})

export const Category = models.Category ?? model<ICategory>("Category", CategorySchema)
