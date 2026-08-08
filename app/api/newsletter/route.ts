import { NextResponse, type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Newsletter } from "@/lib/models/Newsletter"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email } = await req.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() })
    if (existing) {
      if (!existing.active) {
        existing.active = true
        await existing.save()
      }
      return NextResponse.json({ success: true, message: "Already subscribed" })
    }

    await Newsletter.create({ email: email.toLowerCase() })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
