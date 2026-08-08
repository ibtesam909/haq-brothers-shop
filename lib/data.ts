import type { ProductLean, CategoryLean, SettingsLean } from "@/lib/queries"

export type Product = {
  _id: string
  id: string
  slug: string
  name: string
  category: string
  categorySlug: string
  subcategory?: string
  price: number
  comparePrice?: number
  oldPrice?: number
  rating: number
  reviews: number
  reviewsCount: number
  image: string
  thumbnail: string
  images: string[]
  stock: number
  stockQuantity: number
  sku: string
  badge?: "New" | "Sale" | "Bestseller" | "Limited"
  description: string
  shortDescription: string
  brand: string
  featured: boolean
  bestSeller: boolean
  newArrival: boolean
  specifications: Record<string, string>
  tags: string[]
  status: "active" | "hidden" | "out_of_stock"
  createdAt: string
  updatedAt: string
}

export type Category = {
  _id: string
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
  accent: string
}

export type StoreSettings = {
  shopName: string
  tagline: string
  name: string
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
}

export type Order = {
  id: string
  customer: string
  product: string
  date: string
  amount: number
  status: "Delivered" | "Processing" | "Shipped" | "Cancelled"
}

export function mapProduct(p: ProductLean): Product {
  const stock = p.stockQuantity ?? 0
  const oldPrice = p.comparePrice && p.comparePrice > p.price ? p.comparePrice : undefined
  let badge: Product["badge"] | undefined
  if (p.newArrival) badge = "New"
  else if (oldPrice) badge = "Sale"
  else if (p.bestSeller) badge = "Bestseller"
  else if (p.status === "out_of_stock") badge = "Limited"

  return {
    _id: p._id?.toString?.() ?? "",
    id: p._id?.toString?.() ?? "",
    slug: p.slug,
    name: p.name,
    category: p.category,
    categorySlug: p.categorySlug,
    subcategory: p.subcategory,
    price: p.price,
    comparePrice: p.comparePrice,
    oldPrice,
    rating: p.rating,
    reviews: p.reviewsCount,
    reviewsCount: p.reviewsCount,
    image: p.thumbnail || p.images?.[0] || "/placeholder.svg",
    thumbnail: p.thumbnail || p.images?.[0] || "/placeholder.svg",
    images: p.images?.length ? p.images : [p.thumbnail || "/placeholder.svg"],
    stock,
    stockQuantity: stock,
    sku: p.sku,
    badge,
    description: p.description,
    shortDescription: p.shortDescription,
    brand: p.brand,
    featured: p.featured,
    bestSeller: p.bestSeller,
    newArrival: p.newArrival,
    specifications: p.specifications ?? {},
    tags: p.tags ?? [],
    status: p.status,
    createdAt: p.createdAt?.toISOString?.() ?? "",
    updatedAt: p.updatedAt?.toISOString?.() ?? "",
  }
}

export function mapCategory(c: CategoryLean, count?: number): Category {
  return {
    _id: c._id?.toString?.() ?? "",
    name: c.name,
    slug: c.slug,
    image: c.image || "/placeholder.svg",
    icon: c.icon,
    description: c.description,
    parentCategory: c.parentCategory,
    parentSlug: c.parentSlug,
    featured: c.featured,
    displayOrder: c.displayOrder,
    count: count ?? c.count ?? 0,
    accent: c.displayOrder % 2 === 0 ? "primary" : "accent",
  }
}

export function mapSettings(s: SettingsLean): StoreSettings {
  return {
    shopName: s.shopName,
    tagline: s.tagline,
    name: s.shopName,
    logo: s.logo,
    address: s.address,
    city: s.city,
    phone: s.phone,
    whatsapp: s.whatsapp,
    email: s.email,
    hours: s.hours,
    facebook: s.facebook,
    tiktok: s.tiktok,
    youtube: s.youtube,
    instagram: s.instagram,
    twitter: s.twitter,
    googleMapsLink: s.googleMapsLink,
    freeDeliveryThreshold: s.freeDeliveryThreshold,
  }
}

export const defaultSettings: StoreSettings = {
  shopName: "Haq Brothers",
  tagline: "Sports & Toy Shop",
  name: "Haq Brothers",
  logo: "",
  address: "Thana Gali, Choa Saiden Shah",
  city: "District Chakwal, Punjab, Pakistan",
  phone: "+92 300 1234567",
  whatsapp: "+92 300 1234567",
  email: "hello@haqbrothers.pk",
  hours: "Mon – Sat: 9:00 AM – 9:00 PM",
  facebook: "",
  tiktok: "",
  youtube: "",
  instagram: "",
  twitter: "",
  googleMapsLink: "",
  freeDeliveryThreshold: 5000,
}

export const testimonials = [
  {
    name: "Bilal Ahmed",
    role: "Club Cricketer, Chakwal",
    quote:
      "The best sports store in the region. My GrandSlam bat has incredible pickup and the staff genuinely know their gear.",
    rating: 5,
  },
  {
    name: "Ayesha Khan",
    role: "Fitness Coach",
    quote:
      "Quality equipment at fair prices, and delivery to Choa Saiden Shah was faster than I expected. Highly recommended.",
    rating: 5,
  },
  {
    name: "Usman Tariq",
    role: "Parent",
    quote:
      "Bought the RC car and building blocks for my kids — brilliant quality and they haven't put them down since. Thank you Haq Brothers!",
    rating: 5,
  },
]

export const revenueData = [
  { month: "Jan", revenue: 420000, orders: 210 },
  { month: "Feb", revenue: 385000, orders: 189 },
  { month: "Mar", revenue: 510000, orders: 256 },
  { month: "Apr", revenue: 470000, orders: 238 },
  { month: "May", revenue: 615000, orders: 301 },
  { month: "Jun", revenue: 720000, orders: 352 },
  { month: "Jul", revenue: 690000, orders: 338 },
  { month: "Aug", revenue: 810000, orders: 402 },
  { month: "Sep", revenue: 760000, orders: 371 },
  { month: "Oct", revenue: 905000, orders: 448 },
  { month: "Nov", revenue: 1120000, orders: 561 },
  { month: "Dec", revenue: 1340000, orders: 672 },
]

export const trafficData = [
  { day: "Mon", visitors: 1240, sales: 84 },
  { day: "Tue", visitors: 1580, sales: 102 },
  { day: "Wed", visitors: 1390, sales: 91 },
  { day: "Thu", visitors: 1720, sales: 128 },
  { day: "Fri", visitors: 2110, sales: 164 },
  { day: "Sat", visitors: 2540, sales: 198 },
  { day: "Sun", visitors: 1980, sales: 142 },
]

export const recentOrders: Order[] = [
  { id: "#HB-2481", customer: "Bilal Ahmed", product: "GrandSlam Willow Bat", date: "Aug 4, 2026", amount: 12500, status: "Delivered" },
  { id: "#HB-2480", customer: "Ayesha Khan", product: "IronCore Dumbbell Set", date: "Aug 4, 2026", amount: 18900, status: "Processing" },
  { id: "#HB-2479", customer: "Usman Tariq", product: "Turbo Rally RC Car", date: "Aug 3, 2026", amount: 4500, status: "Shipped" },
  { id: "#HB-2478", customer: "Fatima Noor", product: "ZenFlow Yoga Mat", date: "Aug 3, 2026", amount: 3400, status: "Delivered" },
  { id: "#HB-2477", customer: "Hamza Sheikh", product: "Aero Strike Football", date: "Aug 2, 2026", amount: 3200, status: "Cancelled" },
  { id: "#HB-2476", customer: "Zainab Ali", product: "BrickBuilder Blocks", date: "Aug 2, 2026", amount: 3600, status: "Delivered" },
]

export const formatPKR = (value: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value)

export const siteConfig: StoreSettings = { ...defaultSettings }

export const categories: Category[] = [
  { _id: "cat-cricket", name: "Cricket", slug: "cricket", image: "/products/cricket-bat.png", icon: "Cricket", description: "Bats, balls, gloves and protective gear", parentCategory: null, parentSlug: null, featured: true, displayOrder: 0, count: 3, accent: "primary" },
  { _id: "cat-football", name: "Football", slug: "football", image: "/products/football.png", icon: "Football", description: "Match balls, boots and training gear", parentCategory: null, parentSlug: null, featured: true, displayOrder: 1, count: 2, accent: "accent" },
  { _id: "cat-fitness", name: "Fitness", slug: "fitness", image: "/products/dumbbells.png", icon: "Fitness", description: "Dumbbells, mats and strength equipment", parentCategory: null, parentSlug: null, featured: true, displayOrder: 2, count: 3, accent: "primary" },
  { _id: "cat-toys", name: "Toys", slug: "toys", image: "/products/rc-car.png", icon: "Toys", description: "RC cars, building blocks and kids toys", parentCategory: null, parentSlug: null, featured: true, displayOrder: 3, count: 3, accent: "accent" },
  { _id: "cat-basketball", name: "Basketball", slug: "basketball", image: "/products/basketball.png", icon: "Basketball", description: "Basketballs and hoops", parentCategory: null, parentSlug: null, featured: false, displayOrder: 4, count: 1, accent: "primary" },
  { _id: "cat-badminton", name: "Badminton", slug: "badminton", image: "/products/badminton.png", icon: "Badminton", description: "Rackets, shuttlecocks and nets", parentCategory: null, parentSlug: null, featured: false, displayOrder: 5, count: 1, accent: "accent" },
]

export const products: Product[] = [
  { _id: "p1", id: "p1", slug: "grandslam-willow-bat", name: "GrandSlam Willow Bat", category: "Cricket", categorySlug: "cricket", price: 12500, oldPrice: 15000, rating: 4.8, reviews: 124, reviewsCount: 124, image: "/products/cricket-bat.png", thumbnail: "/products/cricket-bat.png", images: ["/products/cricket-bat.png"], stock: 18, stockQuantity: 18, sku: "HB-CB-001", badge: "Sale", description: "Premium grade English willow cricket bat with excellent pickup and balance. Hand-crafted for competitive play.", shortDescription: "Premium English willow cricket bat", brand: "GrandSlam", featured: true, bestSeller: true, newArrival: false, specifications: { Material: "English Willow", Weight: "1180g" }, tags: ["cricket", "bat"], status: "active", createdAt: "2026-07-01", updatedAt: "2026-08-01" },
  { _id: "p2", id: "p2", slug: "aero-strike-football", name: "Aero Strike Football", category: "Football", categorySlug: "football", price: 3200, rating: 4.6, reviews: 89, reviewsCount: 89, image: "/products/football.png", thumbnail: "/products/football.png", images: ["/products/football.png"], stock: 42, stockQuantity: 42, sku: "HB-FB-001", badge: "Bestseller", description: "Match-grade size 5 football with durable stitched panels and consistent flight performance.", shortDescription: "Match-grade size 5 football", brand: "Aero", featured: true, bestSeller: true, newArrival: false, specifications: { Size: "5", Material: "PU Synthetic" }, tags: ["football"], status: "active", createdAt: "2026-07-02", updatedAt: "2026-08-01" },
  { _id: "p3", id: "p3", slug: "ironcore-dumbbell-set", name: "IronCore Dumbbell Set", category: "Fitness", categorySlug: "fitness", price: 18900, oldPrice: 22000, rating: 4.9, reviews: 56, reviewsCount: 56, image: "/products/dumbbells.png", thumbnail: "/products/dumbbells.png", images: ["/products/dumbbells.png"], stock: 8, stockQuantity: 8, sku: "HB-FT-001", badge: "Sale", description: "Adjustable cast-iron dumbbell set from 2kg to 20kg per hand. Includes storage rack.", shortDescription: "Adjustable cast-iron dumbbell set", brand: "IronCore", featured: true, bestSeller: false, newArrival: true, specifications: { Weight: "2-20kg", Material: "Cast Iron" }, tags: ["fitness", "dumbbells"], status: "active", createdAt: "2026-07-03", updatedAt: "2026-08-01" },
  { _id: "p4", id: "p4", slug: "turbo-rally-rc-car", name: "Turbo Rally RC Car", category: "Toys", categorySlug: "toys", price: 4500, rating: 4.7, reviews: 203, reviewsCount: 203, image: "/products/rc-car.png", thumbnail: "/products/rc-car.png", images: ["/products/rc-car.png"], stock: 25, stockQuantity: 25, sku: "HB-TY-001", badge: "New", description: "High-speed 1:18 scale RC rally car with 2.4GHz remote control and up to 25 km/h top speed.", shortDescription: "High-speed RC rally car", brand: "Turbo", featured: true, bestSeller: true, newArrival: true, specifications: { Scale: "1:18", Speed: "25 km/h" }, tags: ["toys", "rc"], status: "active", createdAt: "2026-07-04", updatedAt: "2026-08-01" },
  { _id: "p5", id: "p5", slug: "brickbuilder-blocks", name: "BrickBuilder Blocks", category: "Toys", categorySlug: "toys", price: 3600, rating: 4.5, reviews: 167, reviewsCount: 167, image: "/products/building-blocks.png", thumbnail: "/products/building-blocks.png", images: ["/products/building-blocks.png"], stock: 30, stockQuantity: 30, sku: "HB-TY-002", description: "500-piece creative building blocks set compatible with all major brands. Ages 6+.", shortDescription: "500-piece building blocks set", brand: "BrickBuilder", featured: false, bestSeller: false, newArrival: false, specifications: { Pieces: "500", Ages: "6+" }, tags: ["toys", "blocks"], status: "active", createdAt: "2026-07-05", updatedAt: "2026-08-01" },
  { _id: "p6", id: "p6", slug: "zenflow-yoga-mat", name: "ZenFlow Yoga Mat", category: "Fitness", categorySlug: "fitness", price: 3400, rating: 4.4, reviews: 78, reviewsCount: 78, image: "/products/yoga-mat.png", thumbnail: "/products/yoga-mat.png", images: ["/products/yoga-mat.png"], stock: 35, stockQuantity: 35, sku: "HB-FT-002", description: "Non-slip 6mm eco-friendly TPE yoga mat with carrying strap. Lightweight and durable.", shortDescription: "Non-slip eco-friendly yoga mat", brand: "ZenFlow", featured: false, bestSeller: false, newArrival: false, specifications: { Thickness: "6mm", Material: "TPE" }, tags: ["fitness", "yoga"], status: "active", createdAt: "2026-07-06", updatedAt: "2026-08-01" },
  { _id: "p7", id: "p7", slug: "pro-hoops-basketball", name: "Pro Hoops Basketball", category: "Basketball", categorySlug: "basketball", price: 2800, rating: 4.3, reviews: 45, reviewsCount: 45, image: "/products/basketball.png", thumbnail: "/products/basketball.png", images: ["/products/basketball.png"], stock: 22, stockQuantity: 22, sku: "HB-BB-001", description: "Official size 7 indoor/outdoor basketball with superior grip and bounce consistency.", shortDescription: "Official size 7 basketball", brand: "Pro Hoops", featured: false, bestSeller: false, newArrival: false, specifications: { Size: "7", Surface: "Indoor/Outdoor" }, tags: ["basketball"], status: "active", createdAt: "2026-07-07", updatedAt: "2026-08-01" },
  { _id: "p8", id: "p8", slug: "swiftstride-running-shoes", name: "SwiftStride Running Shoes", category: "Fitness", categorySlug: "fitness", price: 9800, oldPrice: 12000, rating: 4.6, reviews: 92, reviewsCount: 92, image: "/products/running-shoes.png", thumbnail: "/products/running-shoes.png", images: ["/products/running-shoes.png"], stock: 15, stockQuantity: 15, sku: "HB-FT-003", badge: "Sale", description: "Lightweight breathable running shoes with cushioned soles for long-distance comfort.", shortDescription: "Lightweight running shoes", brand: "SwiftStride", featured: true, bestSeller: false, newArrival: true, specifications: { Type: "Running", Sizes: "39-45" }, tags: ["fitness", "shoes"], status: "active", createdAt: "2026-07-08", updatedAt: "2026-08-01" },
  { _id: "p9", id: "p9", slug: "featherlite-badminton-racket", name: "FeatherLite Badminton Racket", category: "Badminton", categorySlug: "badminton", price: 5200, rating: 4.5, reviews: 34, reviewsCount: 34, image: "/products/badminton.png", thumbnail: "/products/badminton.png", images: ["/products/badminton.png"], stock: 12, stockQuantity: 12, sku: "HB-BM-001", badge: "New", description: "Carbon-fiber badminton racket with isometric head shape for a larger sweet spot.", shortDescription: "Carbon-fiber badminton racket", brand: "FeatherLite", featured: false, bestSeller: false, newArrival: true, specifications: { Weight: "85g", Material: "Carbon Fiber" }, tags: ["badminton"], status: "active", createdAt: "2026-07-09", updatedAt: "2026-08-01" },
  { _id: "p10", id: "p10", slug: "aerostride-cycling-helmet", name: "AeroStride Cycling Helmet", category: "Fitness", categorySlug: "fitness", price: 4100, rating: 4.7, reviews: 51, reviewsCount: 51, image: "/products/cycling-helmet.png", thumbnail: "/products/cycling-helmet.png", images: ["/products/cycling-helmet.png"], stock: 0, stockQuantity: 0, sku: "HB-FT-004", badge: "Limited", description: "Ventilated aerodynamic cycling helmet with adjustable fit system and UV protection.", shortDescription: "Aerodynamic cycling helmet", brand: "AeroStride", featured: false, bestSeller: false, newArrival: false, specifications: { Weight: "260g", Sizes: "M/L" }, tags: ["fitness", "cycling"], status: "out_of_stock", createdAt: "2026-07-10", updatedAt: "2026-08-01" },
  { _id: "p11", id: "p11", slug: "kids-adventure-toy-set", name: "Kids Adventure Toy Set", category: "Toys", categorySlug: "toys", price: 2900, rating: 4.2, reviews: 88, reviewsCount: 88, image: "/products/kids-toys.png", thumbnail: "/products/kids-toys.png", images: ["/products/kids-toys.png"], stock: 40, stockQuantity: 40, sku: "HB-TY-003", description: "Multi-piece outdoor adventure toy set with binoculars, compass and flashlight. Ages 4+.", shortDescription: "Outdoor adventure toy set", brand: "Kids Adventure", featured: false, bestSeller: false, newArrival: false, specifications: { Ages: "4+", Pieces: "6" }, tags: ["toys"], status: "active", createdAt: "2026-07-11", updatedAt: "2026-08-01" },
  { _id: "p12", id: "p12", slug: "proguard-cricket-gloves", name: "ProGuard Cricket Gloves", category: "Cricket", categorySlug: "cricket", price: 2200, rating: 4.4, reviews: 37, reviewsCount: 37, image: "/products/cricket-bat.png", thumbnail: "/products/cricket-bat.png", images: ["/products/cricket-bat.png"], stock: 28, stockQuantity: 28, sku: "HB-CB-002", description: "Left-hand batting gloves with leather palm and high-density foam protection.", shortDescription: "Protective cricket batting gloves", brand: "ProGuard", featured: false, bestSeller: false, newArrival: false, specifications: { Hand: "Left", Material: "Leather" }, tags: ["cricket", "gloves"], status: "active", createdAt: "2026-07-12", updatedAt: "2026-08-01" },
]

export const categorySales = [
  { category: "Cricket", value: 32 },
  { category: "Football", value: 24 },
  { category: "Fitness", value: 22 },
  { category: "Toys", value: 14 },
  { category: "Other", value: 8 },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
