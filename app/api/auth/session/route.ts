import { NextResponse, type NextRequest } from "next/server"
import { verifyToken, getCookieName } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const token = req.cookies.get(getCookieName())?.value
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true, user: payload })
}
