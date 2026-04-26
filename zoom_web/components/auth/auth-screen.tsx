"use client"

import Link from "next/link"
import { KeyRound } from "lucide-react"

import { googleOAuthUrl } from "@/lib/api"

type AuthScreenProps = {
  mode: "signin" | "signup"
  nextPath: string
  children: React.ReactNode
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[20px] fill-[#111827]">
      <path d="M16.58 12.49c.01 2.35 2.06 3.14 2.08 3.15-.02.06-.32 1.11-1.05 2.2-.64.94-1.31 1.88-2.36 1.9-1.04.02-1.37-.62-2.55-.62s-1.55.6-2.52.64c-1.02.04-1.81-1.02-2.45-1.96-1.3-1.88-2.3-5.31-.96-7.63.66-1.15 1.86-1.88 3.17-1.9 1-.02 1.93.67 2.55.67.61 0 1.77-.83 2.98-.71.51.02 1.95.21 2.87 1.55-.07.05-1.71 1-1.7 2.71Zm-2.1-5.93c.53-.64.9-1.53.8-2.42-.77.03-1.69.52-2.24 1.16-.5.58-.93 1.48-.82 2.35.86.07 1.73-.44 2.26-1.09Z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="size-[20px]">
      <path
        fill="#4285F4"
        d="M44.5 20H24v8.5h11.8C34.7 34.1 30 38 24 38c-7.7 0-14-6.3-14-14s6.3-14 14-14c3.4 0 6.6 1.2 9.1 3.5l6.4-6.4C35.2 3.1 29.9 1 24 1 11.3 1 1 11.3 1 24s10.3 23 23 23 22-10.3 22-23c0-1.3-.2-2.7-.5-4Z"
      />
      <path
        fill="#34A853"
        d="M24 47c6 0 11.5-2.2 15.8-5.9l-7.5-6.2c-2.3 1.6-5.2 2.6-8.3 2.6-6 0-11.2-4.1-13-9.7l-7.8 6C6.4 41.6 14.5 47 24 47Z"
      />
      <path
        fill="#FBBC04"
        d="M11 27.8A14 14 0 0 1 10 24c0-1.3.2-2.6.6-3.8l-7.8-6A23 23 0 0 0 1 24c0 3.6.8 7 2.2 10l7.8-6.2Z"
      />
      <path
        fill="#EA4335"
        d="M24 10c3.3 0 6.3 1.2 8.6 3.2l6.9-6.9A23 23 0 0 0 24 1C14.5 1 6.4 6.4 2.8 14.2l7.8 6C12.4 14.1 17.8 10 24 10Z"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[20px] fill-[#1877F2]">
      <path d="M24 12a12 12 0 1 0-13.88 11.86v-8.39H7.08V12h3.04V9.36c0-3 1.79-4.66 4.53-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.5c-1.48 0-1.94.92-1.94 1.86V12h3.3l-.53 3.47H13.9v8.39A12 12 0 0 0 24 12Z" />
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px]">
      <rect x="2" y="2" width="9" height="9" fill="#F25022" />
      <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
      <rect x="2" y="13" width="9" height="9" fill="#00A4EF" />
      <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
    </svg>
  )
}

const providers = [
  { label: "SSO", mark: <KeyRound className="size-[18px] text-[#20223a]" strokeWidth={2.4} />, disabled: true },
  { label: "Apple", mark: <AppleIcon />, disabled: true },
  { label: "Google", mark: <GoogleIcon />, disabled: false },
  { label: "Facebook", mark: <FacebookIcon />, disabled: true },
  { label: "Microsoft", mark: <MicrosoftIcon />, disabled: true },
]

export function AuthScreen({ mode, nextPath, children }: AuthScreenProps) {
  const isSignup = mode === "signup"
  const gridClass = isSignup
    ? "lg:grid-cols-[minmax(0,0.93fr)_minmax(480px,1.07fr)]"
    : "lg:grid-cols-[minmax(0,38.7%)_minmax(0,61.3%)]"

  function handleGoogle() {
    window.location.href = googleOAuthUrl(nextPath)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#232333]">
      <header className="fixed inset-x-0 top-0 z-20 flex h-[58px] items-center justify-between border-b border-[#e8e8ee] bg-white px-6 sm:px-12">
        <Link href="/" className="flex items-center" aria-label="Zoom home">
          <img
            src="https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/logo-zoom@2x.png"
            alt="Zoom"
            className="h-[30px] w-auto"
          />
        </Link>
        <nav className="flex items-center gap-4 text-[14px] font-medium sm:gap-6">
          <span className="hidden text-[#1f2330] sm:inline">
            {isSignup ? "Already have an account?" : "New to Zoom?"}{" "}
            <Link className="text-[#005bff]" href={isSignup ? "/signin" : "/signup"}>
              {isSignup ? "Sign In" : "Sign Up Free"}
            </Link>
          </span>
          <a className="text-[#005bff]" href="#">Support</a>
          <button className="hidden items-center gap-1 text-[#005bff] sm:inline-flex">English⌄</button>
        </nav>
      </header>

      <div className={`grid h-screen pt-[58px] ${gridClass} lg:overflow-hidden`}>
        <section className="relative hidden items-center justify-center bg-[#f7f8fa] lg:flex">
          {isSignup ? (
            <div className="relative flex h-full w-full items-center justify-center">
              <img
                src="/banner-step-2.BCd7FDlz.png"
                alt=""
                className="absolute top-[13%] left-1/2 w-[260px] -translate-x-1/2 opacity-95 xl:w-[300px]"
              />
              <div className="mt-[220px] w-[420px] rounded-2xl bg-white px-7 py-7 shadow-[0_8px_24px_rgba(15,23,42,0.18)] xl:mt-[250px] xl:w-[450px]">
                <h2 className="text-[23px] font-bold tracking-[-0.02em]">Create your free Basic account</h2>
                <ul className="mt-5 space-y-3 text-[14px]">
                  {[
                    "Get up to 40 minutes and 100 participants per meeting",
                    "Share AI docs",
                    "Get 3 editable whiteboards",
                    "Unlimited instant messaging",
                    "Create up to 5 two-minute video messages",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="flex size-4 items-center justify-center rounded-full bg-[#22c55e] text-[10px] font-bold text-white">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="relative h-full w-full">
              <img
                src="/4e09d6bc-62d1-41a4-9b76-d90112e6759b.png"
                alt=""
                className="absolute left-[4.55vw] top-[23.5vh] w-[39.6vw] min-w-[500px] max-w-[576px] shadow-none"
              />
            </div>
          )}
        </section>

        <section
          className={`flex h-[calc(100vh-58px)] justify-center overflow-y-auto px-6 py-6 sm:px-10 lg:overflow-hidden ${
            isSignup ? "items-center" : "items-center lg:items-start lg:pt-[143px]"
          }`}
        >
          <div className="w-full max-w-[348px]">
            {children}

            <div className="mt-6 flex items-center gap-3 text-center text-[14px] text-[#687085]">
              <span className="h-px flex-1 bg-[#e4e7ee]" />
              <span>{isSignup ? "Or sign up with" : "Or sign in with"}</span>
              <span className="h-px flex-1 bg-[#e4e7ee]" />
            </div>

            <div className="mt-5 grid grid-cols-5 gap-5">
              {providers.map((provider) => (
                <button
                  key={provider.label}
                  type="button"
                  onClick={provider.disabled ? undefined : handleGoogle}
                  disabled={provider.disabled}
                  className="group flex flex-col items-center gap-2 text-[13px] font-medium text-[#646c7a] disabled:cursor-not-allowed disabled:opacity-100"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl border border-[#cfd6e0] bg-[#f5f6f8] transition group-hover:border-[#b8c2d1]">
                    {provider.mark}
                  </span>
                  <span>{provider.label}</span>
                </button>
              ))}
            </div>

            {!isSignup ? (
              <div className="mt-[155px] text-center text-[13px]">
                <a className="text-[#005bff]" href="#">Forgot email?</a>
              </div>
            ) : null}

            <footer className={`${isSignup ? "mt-8" : "mt-9"} text-center text-[13px] leading-snug text-[#687085]`}>
              <div className="mb-4 flex justify-center gap-5 text-[#005bff]">
                <a href="#">Help</a>
                <a href="#">Terms</a>
                <a href="#">Privacy</a>
              </div>
              Zoom is protected by reCAPTCHA and the Google{" "}
              <a className="text-[#005bff]" href="#">Privacy Policy</a> and{" "}
              <a className="text-[#005bff]" href="#">Terms of Service</a> apply.
            </footer>
          </div>
        </section>
      </div>
    </main>
  )
}
