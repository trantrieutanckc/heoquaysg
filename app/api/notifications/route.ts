import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET — fetch unread + recent notifications for current user
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return new Response("Unauthorized", { status: 403 })

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      type: true,
      title: true,
      body: true,
      link: true,
      read: true,
      createdAt: true,
    },
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return Response.json({ notifications, unreadCount })
}
