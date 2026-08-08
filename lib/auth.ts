import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "haq-brothers-secret-key-change-in-production"
const COOKIE_NAME = "hb_admin_token"
const TOKEN_EXPIRY = "7d"

export interface AdminTokenPayload {
  id: string
  email: string
  username: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed)
}

export function signToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload
  } catch {
    return null
  }
}

export function getCookieName() {
  return COOKIE_NAME
}

export function getTokenExpirySeconds() {
  return 7 * 24 * 60 * 60
}
