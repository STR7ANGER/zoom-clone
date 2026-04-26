"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { AuthScreen } from "@/components/auth/auth-screen"
import { login } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get("next") || "/myhome"
  const setSession = useAuthStore((state) => state.setSession)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState<"email" | "password">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    if (step === "email") {
      if (email.trim()) setStep("password")
      return
    }

    setLoading(true)
    try {
      const session = await login({ email, password })
      setSession(session.access_token, session.user)
      router.replace(nextPath)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreen mode="signin" nextPath={nextPath}>
      <form onSubmit={handleSubmit}>
        <h1 className="mb-8 text-center text-[34px] font-bold tracking-[-0.02em]">Sign in</h1>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email or phone number"
          disabled={step === "password" || loading}
          className="h-[44px] w-full rounded-[10px] border border-[#b8c0cc] px-3 text-[15px] font-medium outline-none placeholder:text-[#6f7685] focus:border-[#0b5cff] focus:ring-2 focus:ring-[#0b5cff]/10 disabled:bg-[#f8fafc]"
        />
        {step === "password" ? (
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoFocus
            className="mt-3 h-[44px] w-full rounded-[10px] border border-[#b8c0cc] px-3 text-[15px] font-medium outline-none placeholder:text-[#6f7685] focus:border-[#0b5cff] focus:ring-2 focus:ring-[#0b5cff]/10"
          />
        ) : null}
        {error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={!email.trim() || (step === "password" && !password) || loading}
          className="mt-4 flex h-[38px] w-full items-center justify-center gap-2 rounded-[9px] bg-[#0b5cff] text-[14px] font-bold text-white transition hover:bg-[#084bd8] disabled:bg-[#e5e7eb] disabled:text-[#9aa2b1]"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {step === "email" ? "Next" : "Sign in"}
        </button>
        {step === "password" ? (
          <button type="button" onClick={() => setStep("email")} className="mt-3 text-[13px] font-medium text-[#005bff]">
            Use a different email
          </button>
        ) : null}
        <p className="mt-5 text-center text-[14px] text-[#687085] sm:hidden">
          New to Zoom? <Link className="text-[#005bff]" href="/signup">Sign Up Free</Link>
        </p>
      </form>
    </AuthScreen>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center">Loading</main>}>
      <SignInContent />
    </Suspense>
  )
}
