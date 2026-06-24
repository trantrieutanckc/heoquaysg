// In-memory rate limiter — resets on server restart (acceptable for this use case)
const loginAttempts = new Map<string, { count: number; firstAt: number; lockedUntil?: number }>()

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000
const LOCKOUT_MS = 15 * 60 * 1000

export function checkLoginRateLimit(email: string): { ok: boolean; remainingMs?: number } {
  const now = Date.now()
  const key = email.toLowerCase()
  const rec = loginAttempts.get(key)

  if (!rec) return { ok: true }

  if (rec.lockedUntil) {
    if (now < rec.lockedUntil) return { ok: false, remainingMs: rec.lockedUntil - now }
    loginAttempts.delete(key)
    return { ok: true }
  }

  if (now - rec.firstAt > WINDOW_MS) {
    loginAttempts.delete(key)
    return { ok: true }
  }

  if (rec.count >= MAX_ATTEMPTS) {
    return { ok: false, remainingMs: LOCKOUT_MS }
  }

  return { ok: true }
}

export function recordLoginFailure(email: string) {
  const now = Date.now()
  const key = email.toLowerCase()
  const rec = loginAttempts.get(key)

  if (!rec || now - rec.firstAt > WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAt: now })
    return
  }

  rec.count++
  if (rec.count >= MAX_ATTEMPTS) {
    rec.lockedUntil = now + LOCKOUT_MS
  }
}

export function resetLoginAttempts(email: string) {
  loginAttempts.delete(email.toLowerCase())
}

export function getRemainingAttempts(email: string): number {
  const key = email.toLowerCase()
  const rec = loginAttempts.get(key)
  if (!rec || Date.now() - rec.firstAt > WINDOW_MS) return MAX_ATTEMPTS
  return Math.max(0, MAX_ATTEMPTS - rec.count)
}
