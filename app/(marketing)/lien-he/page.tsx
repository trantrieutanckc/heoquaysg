export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { ContactClient } from "./contact-client"

export default async function ContactPage() {
  const config = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (config?.data ?? {}) as Record<string, string>

  return (
    <ContactClient
      siteName={cfg.siteName?.trim() || "Heo Quay 47"}
      contactPhone={cfg.contactPhone?.trim()}
      contactEmail={cfg.contactEmail?.trim()}
      contactAddress={cfg.contactAddress?.trim()}
      businessHours={cfg.businessHours?.trim()}
      contactZalo={cfg.contactZalo?.trim()}
    />
  )
}
