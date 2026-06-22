import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db as any),
  session: {
    strategy: "jwt",
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

          const user = await db.user.findUnique({
            where: { email: credentials.email },
            select: { id: true, name: true, email: true, image: true, password: true, role: true },
          })

          if (!user || !user.password) return null

          const valid = await compare(credentials.password, user.password)
          if (!valid) return null

          return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role }
        } catch (error) {
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
      }
      return session
    },
    async jwt({ token, user }) {
      try {
        const dbUser = await db.user.findFirst({
          where: { email: token.email! },
          select: { id: true, name: true, email: true, image: true, role: true },
        })

        if (!dbUser) {
          if (user) {
            token.id = user.id
            ;(token as any).role = (user as any).role
          }
          return token
        }

        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          picture: dbUser.image,
          role: dbUser.role,
        }
      } catch (error) {
        console.error("[auth] jwt callback error:", error)
        if (user) {
          token.id = user.id
          ;(token as any).role = (user as any).role
        }
        return token
      }
    },
  },
}
