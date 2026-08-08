import { Schema, model, models, type Document } from "mongoose"

export interface INewsletter extends Document {
  email: string
  subscribedAt: Date
  active: boolean
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    subscribedAt: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const Newsletter = models.Newsletter ?? model<INewsletter>("Newsletter", NewsletterSchema)
