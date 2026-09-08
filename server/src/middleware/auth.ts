import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../prisma.js'

export type AuthUser = {
  id: string
  email: string
  role: 'customer' | 'admin'
}

export function signToken(user: AuthUser) {
  return jwt.sign(user, process.env.AUTH_SECRET || 'dev-secret', { expiresIn: '7d' })
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie('florinda_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.florinda_token as string | undefined
  if (!token) return next()
  try {
    const payload = jwt.verify(token, process.env.AUTH_SECRET || 'dev-secret') as AuthUser
    const user = await prisma.user.findUnique({ where: { id: payload.id } })
    if (user) req.user = { id: user.id, email: user.email, role: user.role as AuthUser['role'] }
  } catch {
    // ignore invalid tokens
  }
  next()
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'unauthorized' })
  next()
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'forbidden' })
  next()
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}
