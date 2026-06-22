import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"

export async function getCurrentUser() {
  // const session = await getServerSession(authOptions)

  // return session?.user
  return {
    id: "clgshfksd000008l2h7a3aaaa",
    name: "Admin",
    email: "admin@test.com",
    image: "https://avatars.githubusercontent.com/u/1?v=4",
    role: "ADMIN" as const,
  }
}
