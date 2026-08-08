import { Schema, model, models, type Document } from "mongoose"

export interface ICustomer extends Document {
  name: string
  email: string
  phone: string
  address: string
  city: string
  totalOrders: number
  totalSpent: number
  status: "active" | "blocked"
  createdAt: Date
  updatedAt: Date
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, index: true },
    phone: { type: String, trim: true, index: true },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
  },
  { timestamps: true },
)

export const Customer = models.Customer ?? model<ICustomer>("Customer", CustomerSchema)
