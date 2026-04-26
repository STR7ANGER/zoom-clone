"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type AuthUser = {
  id: number
  email: string
  name: string
  avatar_url: string | null
  auth_provider: string
}

type AuthState = {
  token: string | null
  user: AuthUser | null
  hydrated: boolean
  setSession: (token: string, user: AuthUser) => void
  setUser: (user: AuthUser) => void
  setHydrated: (hydrated: boolean) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      setSession: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      setHydrated: (hydrated) => set({ hydrated }),
      signOut: () => set({ token: null, user: null }),
    }),
    {
      name: "zoom-auth",
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)

export function getAuthToken() {
  return useAuthStore.getState().token
}

export function initials(name: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
  return letters || "U"
}
