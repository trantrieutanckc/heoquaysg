import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import type { JWT } from "next-auth/jwt"

import { db } from "@/lib/db"
import { checkLoginRateLimit, recordLoginFailure, resetLoginAttempts } from "@/lib/rate-limit"
import { generateToken, hashToken } from "@/lib/tokens"

const ACCESS_TTL_MS  = 30 * 60 * 1000           // 30 phút
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000  // 7 ngày

async function rotateRefreshToken(token: JWT): Promise<JWT> {
  const raw = (token as any).refreshToken as string | undefined
  if (!raw) return { ...token, error: "RefreshTokenExpired" }

  try {
    const stored = await db.refreshToken.findUnique({
      where: { tokenHash: hashToken(raw) },
    })

    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await db.refreshToken.delete({ where: { id: stored.id } }).catch(() => {})
      return { ...token, error: "RefreshTokenExpired" }
    }

    const newRaw = generateToken()
    await db.$transaction([
      db.refreshToken.delete({ where: { id: stored.id } }),
      db.refreshToken.create({
        data: {
          userId: stored.userId,
          tokenHash: hashToken(newRaw),
          expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
        },
      }),
    ])

    return {
      ...token,
      refreshToken: newRaw,
      accessTokenExpires: Date.now() + ACCESS_TTL_MS,
      error: undefined,
    }
  } catch {
    return { ...token, error: "RefreshTokenExpired" }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db as any),
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // cookie sống 7 ngày
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null

          const rateCheck = checkLoginRateLimit(credentials.email)
          if (!rateCheck.ok) {
            const mins = Math.ceil((rateCheck.remainingMs ?? 900000) / 60000)
            throw new Error(`LOCKED:${mins}`)
          }

          const user = await db.user.findUnique({
            where: { email: credentials.email },
            select: { id: true, name: true, email: true, image: true, password: true, role: true },
          })

          if (!user || !user.password) {
            recordLoginFailure(credentials.email)
            return null
          }

          const valid = await compare(credentials.password, user.password)
          if (!valid) {
            recordLoginFailure(credentials.email)
            return null
          }

          resetLoginAttempts(credentials.email)
          return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role }
        } catch (error) {
          if (error instanceof Error && error.message.startsWith("LOCKED:")) throw error
          console.error("[auth] authorize error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        ;(session.user as any).role = token.role
        ;(session.user as any).error = (token as any).error
      }
      return session
    },
    async jwt({ token, user }) {
      // Đăng nhập lần đầu — tạo refresh token mới
      if (user) {
        const rawToken = generateToken()
        await db.refreshToken.create({
          data: {
            userId: user.id,
            tokenHash: hashToken(rawToken),
            expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
          },
        })
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: (user as any).image,
          role: (user as any).role,
          refreshToken: rawToken,
          accessTokenExpires: Date.now() + ACCESS_TTL_MS,
        }
      }

      // Access token còn hạn → pass
      if (Date.now() < ((token as any).accessTokenExpires ?? 0)) {
        return token
      }

      // Access token hết hạn → rotate refresh token
      return rotateRefreshToken(token)
    },
  },
  events: {
    async signOut(message: any) {
      const raw = message?.token?.refreshToken as string | undefined
      if (raw) {
        await db.refreshToken.deleteMany({
          where: { tokenHash: hashToken(raw) },
        }).catch(() => {})
      }
    },
  },
}
