import { connectDB } from "@/lib/mongodb"
import { Admin } from "@/lib/models/Admin"
import { hashPassword } from "@/lib/auth"

async function seedAdmin() {
  await connectDB()

  const email = "admin@haqbrothers.pk"
  const existing = await Admin.findOne({ email })

  if (existing) {
    console.log("Admin user already exists:", email)
    return
  }

  const admin = await Admin.create({
    name: "Store Owner",
    email,
    username: "admin",
    hashedPassword: await hashPassword("admin123"),
    role: "owner",
  })

  console.log("Admin user created:", admin.email, admin.username)
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err)
    process.exit(1)
  })
