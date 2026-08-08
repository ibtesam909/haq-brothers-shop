import { Schema, model, models, type Document } from "mongoose"

export interface ISettings extends Document {
  shopName: string
  tagline: string
  logo: string
  address: string
  city: string
  phone: string
  whatsapp: string
  email: string
  hours: string
  facebook: string
  tiktok: string
  youtube: string
  instagram: string
  twitter: string
  googleMapsLink: string
  freeDeliveryThreshold: number
  updatedAt: Date
}

const SettingsSchema = new Schema<ISettings>(
  {
    shopName: { type: String, default: "Haq Brothers" },
    tagline: { type: String, default: "Sports & Toy Shop" },
    logo: { type: String, default: "" },
    address: { type: String, default: "Thana Gali, Choa Saiden Shah" },
    city: { type: String, default: "District Chakwal, Punjab, Pakistan" },
    phone: { type: String, default: "+92 300 1234567" },
    whatsapp: { type: String, default: "+92 300 1234567" },
    email: { type: String, default: "hello@haqbrothers.pk" },
    hours: { type: String, default: "Mon – Sat: 9:00 AM – 9:00 PM" },
    facebook: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    youtube: { type: String, default: "" },
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
    googleMapsLink: { type: String, default: "" },
    freeDeliveryThreshold: { type: Number, default: 5000 },
  },
  { timestamps: true },
)

export const Settings = models.Settings ?? model<ISettings>("Settings", SettingsSchema)
