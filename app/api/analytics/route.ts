import { BetaAnalyticsDataClient } from "@google-analytics/data"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"

function getClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not set")
  const decoded = Buffer.from(raw, "base64").toString("utf8")
  const credentials = JSON.parse(decoded)
  return new BetaAnalyticsDataClient({ credentials })
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const propertyId = process.env.GA4_PROPERTY_ID
  if (!propertyId) {
    return NextResponse.json({ error: "GA4_PROPERTY_ID not set" }, { status: 500 })
  }

  try {
    const client = getClient()

    const [dailyRes, summaryRes] = await Promise.all([
      // Visitors by day — last 30 days
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "29daysAgo", endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      // Summary totals
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
        ],
      }),
    ])

    const daily = (dailyRes[0].rows ?? []).map((row) => {
      const raw = row.dimensionValues?.[0]?.value ?? ""
      const date = `${raw.slice(6, 8)}/${raw.slice(4, 6)}`
      return {
        date,
        users: Number(row.metricValues?.[0]?.value ?? 0),
        sessions: Number(row.metricValues?.[1]?.value ?? 0),
      }
    })

    const summary = {
      users: Number(summaryRes[0].rows?.[0]?.metricValues?.[0]?.value ?? 0),
      sessions: Number(summaryRes[0].rows?.[0]?.metricValues?.[1]?.value ?? 0),
      pageviews: Number(summaryRes[0].rows?.[0]?.metricValues?.[2]?.value ?? 0),
    }

    return NextResponse.json({ daily, summary })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
