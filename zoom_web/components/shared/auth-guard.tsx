"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import { getMe } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const token = useAuthStore((state) => state.token)
  const hydrated = useAuthStore((state) => state.hydrated)
  const setUser = useAuthStore((state) => state.setUser)
  const signOut = useAuthStore((state) => state.signOut)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!hydrated) return
    if (!token) {
      router.replace(`/signin?next=${encodeURIComponent(pathname)}`)
      return
    }
    getMe()
      .then((user) => {
        setUser(user)
        setReady(true)
      })
      .catch(() => {
        signOut()
        router.replace(`/signin?next=${encodeURIComponent(pathname)}`)
      })
  }, [hydrated, pathname, router, setUser, signOut, token])

  if (!hydrated || !token || !ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-[#232333]">
        <Loader2 className="mr-2 size-5 animate-spin" />
        Loading
      </main>
    )
  }

  return children
}
