import { NextResponse, type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Admin } from "@/lib/models/Admin"
import {
  hashPassword,
  verifyPassword,
  signToken,
  getCookieName,
  getTokenExpirySeconds,
} from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() })
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const valid = await verifyPassword(password, admin.hashedPassword)
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = signToken({
      id: admin._id.toString(),
      email: admin.email,
      username: admin.username,
      role: admin.role,
    })

    const res = NextResponse.json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      username: admin.username,
      role: admin.role,
    })
    res.cookies.set(getCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: getTokenExpirySeconds(),
    })
    return res
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete(getCookieName())
  return res
}
