"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { AuthScreen } from "@/components/auth/auth-screen"
import { signup } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"

function SignUpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get("next") || "/myhome"
  const setSession = useAuthStore((state) => state.setSession)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [step, setStep] = useState<"email" | "name" | "password">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const canContinue =
    step === "email"
      ? email.trim()
      : step === "name"
        ? name.trim()
        : password.length >= 8 && password === confirmPassword

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    if (step === "email") {
      if (email.trim()) setStep("name")
      return
    }
    if (step === "name") {
      if (name.trim()) setStep("password")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setLoading(true)
    try {
      const session = await signup({ email, name, password })
      setSession(session.access_token, session.user)
      router.replace(nextPath)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign up")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreen mode="signup" nextPath={nextPath}>
      <form onSubmit={handleSubmit}>
        <h1 className="mb-8 text-center text-[34px] font-bold tracking-[-0.02em]">Sign up</h1>
        <div>
          {step === "email" ? (
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              disabled={loading}
              className="h-[48px] w-full rounded-[10px] border border-[#b8c0cc] px-3 text-[16px] font-medium outline-none placeholder:text-[#6f7685] focus:border-[#0b5cff] focus:ring-2 focus:ring-[#0b5cff]/10"
            />
          ) : null}
          {step === "name" ? (
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              autoFocus
              disabled={loading}
              className="h-[48px] w-full rounded-[10px] border border-[#b8c0cc] px-3 text-[16px] font-medium outline-none placeholder:text-[#6f7685] focus:border-[#0b5cff] focus:ring-2 focus:ring-[#0b5cff]/10"
            />
          ) : null}
          {step === "password" ? (
            <>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                autoFocus
                className="h-[48px] w-full rounded-[10px] border border-[#b8c0cc] px-3 text-[16px] font-medium outline-none placeholder:text-[#6f7685] focus:border-[#0b5cff] focus:ring-2 focus:ring-[#0b5cff]/10"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm password"
                className="mt-3 h-[48px] w-full rounded-[10px] border border-[#b8c0cc] px-3 text-[16px] font-medium outline-none placeholder:text-[#6f7685] focus:border-[#0b5cff] focus:ring-2 focus:ring-[#0b5cff]/10"
              />
            </>
          ) : null}
        </div>
        {error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={!canContinue || loading}
          className="mt-6 flex h-[41px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#0b5cff] text-[14px] font-bold text-white transition hover:bg-[#084bd8] disabled:bg-[#e5e5e8] disabled:text-[#a8aeba]"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {step === "password" ? "Create Account" : "Continue"}
        </button>
        {step !== "email" ? (
          <button
            type="button"
            onClick={() => setStep(step === "password" ? "name" : "email")}
            className="mt-3 text-[13px] font-medium text-[#005bff]"
          >
            Back
          </button>
        ) : null}
        <p className="mt-4 text-[14px] leading-snug text-[#687085]">
          By proceeding, I agree to{" "}
          <a className="text-[#005bff]" href="#">Zoom&apos;s Privacy Statement</a> and{" "}
          <a className="text-[#005bff]" href="#">Terms of Service</a>.
        </p>
        <p className="mt-5 text-center text-[14px] text-[#687085] sm:hidden">
          Already have an account? <Link className="text-[#005bff]" href="/signin">Sign In</Link>
        </p>
      </form>
    </AuthScreen>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center">Loading</main>}>
      <SignUpContent />
    </Suspense>
  )
}
