import { Schema, model, models, type Document } from "mongoose"

export interface IAdmin extends Document {
  name: string
  email: string
  username: string
  hashedPassword: string
  role: "owner" | "manager"
  createdAt: Date
  updatedAt: Date
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    username: { type: String, required: true, unique: true, trim: true },
    hashedPassword: { type: String, required: true },
    role: { type: String, enum: ["owner", "manager"], default: "owner" },
  },
  { timestamps: true },
)

export const Admin = models.Admin ?? model<IAdmin>("Admin", AdminSchema)
