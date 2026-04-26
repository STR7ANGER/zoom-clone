"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { getMe } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setSession = useAuthStore((state) => state.setSession)

  useEffect(() => {
    const token = searchParams.get("token")
    const nextPath = searchParams.get("next") || "/myhome"
    if (!token) {
      router.replace("/signin")
      return
    }
    useAuthStore.setState({ token })
    getMe()
      .then((user) => {
        setSession(token, user)
        router.replace(nextPath)
      })
      .catch(() => router.replace("/signin"))
  }, [router, searchParams, setSession])

  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-[#232333]">
      <Loader2 className="mr-2 size-5 animate-spin" />
      Finishing sign in
    </main>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center">Loading</main>}>
      <AuthCallbackContent />
    </Suspense>
  )
}
