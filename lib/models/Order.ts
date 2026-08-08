import { Schema, model, models, type Document } from "mongoose"

export interface IOrderItem {
  product: Schema.Types.ObjectId
  name: string
  slug: string
  price: number
  quantity: number
  image: string
}

export interface IOrder extends Document {
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail: string
  customerAddress: string
  items: IOrderItem[]
  subtotal: number
  shipping: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "unpaid" | "paid" | "refunded"
  paymentMethod: "cod" | "card" | "bank_transfer"
  notes: string
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: "/placeholder.svg" },
  },
  { _id: false },
)

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    customerEmail: { type: String, trim: true, lowercase: true, default: "" },
    customerAddress: { type: String, required: true, trim: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "bank_transfer"],
      default: "cod",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
)

export const Order = models.Order ?? model<IOrder>("Order", OrderSchema)
