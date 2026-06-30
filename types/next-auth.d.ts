import { User } from "next-auth"
import { JWT } from "next-auth/jwt"

type UserId = string

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId
    role?: string
    error?: string
    refreshToken?: string
    accessTokenExpires?: number
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId
      role?: string
      error?: string
    }
  }

  interface User {
    role?: string
  }
}
