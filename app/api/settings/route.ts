import { NextResponse, type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Settings } from "@/lib/models/Settings"

export async function GET() {
  try {
    await connectDB()
    let settings = await Settings.findOne()
    if (!settings) {
      settings = await Settings.create({})
    }
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    let settings = await Settings.findOne()
    if (!settings) {
      settings = await Settings.create(body)
    } else {
      Object.assign(settings, body)
      await settings.save()
    }
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
