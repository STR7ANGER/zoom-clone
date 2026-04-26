import type { AuthUser } from "@/lib/auth-store"
import { API_BASE_URL, request } from "@/lib/api/client"
import type { AuthResponse } from "@/lib/api/types"

export function signup(payload: { email: string; name: string; password: string }) {
  return request<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function login(payload: { email: string; password: string }) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getMe() {
  return request<AuthUser>("/auth/me", { cache: "no-store" })
}

export function googleOAuthUrl(next = "/myhome") {
  return `${API_BASE_URL}/auth/google/start?next=${encodeURIComponent(next)}`
}
