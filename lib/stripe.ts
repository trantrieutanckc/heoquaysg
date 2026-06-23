// [UNUSED] Stripe chưa được kích hoạt cho dự án này. Xóa file này khi không cần thanh toán.
import Stripe from "stripe"

import { env } from "@/env.mjs"

export const stripe = new Stripe(env.STRIPE_API_KEY, {
  apiVersion: "2022-11-15",
  typescript: true,
})
